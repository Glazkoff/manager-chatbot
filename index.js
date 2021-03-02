const TelegramBot = require('node-telegram-bot-api');
const { Op } = require('sequelize');
const models = require('./orm.js');
const express = require('express');
const https = require('https');


/* подключение токена*/
const token = require('./token.js');
token() !== "" ? console.log( "\x1b[35m", 'Token was successfully received!', "\x1b[35m") : console.log("\x1b[31m", 'Token was not received');

const bot = new TelegramBot(token(), {
  polling: true
});
var count = [];
let chatCount = 1;
let managerCount = 1;
let dailyCount = 1;
const week = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
const weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
let chatId = 0;
let chat;
let weekDay;
models.test();

// async function testInclude() {
//   let chats = await models.Chat.findAll({include: {model: models.DailyTime, as: 'dailyTime', where: {
//     [weekDays[curDate.getDay()]]: {
//       [Op.lte]: curDate2
//     }
//   } }});
//   console.log(daily[0].chat);
// }
// testInclude();

function addChat(num) {
  bot.sendMessage(num, 'Если вы менеджер, отправьте в лс боту сообщение: ');
  bot.sendMessage(num, `/notify ${num}`);
}

/* варианты сообщений */
bot.on('message', msg => {
  if (msg.text.toLowerCase() == "привет, бот") {
    bot.sendMessage(msg.chat.id, `привет, ${msg.from.first_name}!`);
  } else if (msg.text === '/закрыть') {
    bot.sendMessage(msg.chat.id, 'закрываю клавиатуру', {
      reply_markup: {
        remove_keyboard: true
      }
    });
  }
});

bot.onText(/\/chatid/, msg => {
  if (parseInt(msg.chat.id) < 0) {
    addChat(msg.chat.id);
  } else {
    bot.sendMessage(msg.chat.id, `*Данная команда работает только в чате*`, {
      parse_mode: 'Markdown'
    });
  }
});

bot.onText(/\/start/, msg => {
  bot.sendMessage(msg.chat.id, `Привет, ${msg.from.first_name}, данный бот был придуман для бла бла бла бла...`);
});

bot.onText(/\/help/, msg => {
  bot.sendMessage(msg.chat.id, `*Список необходимых действий*:
  _1) Добавить бота в группу_
  _2) Написать в группе /chatid@PolywebBot_
  _3) Полученный код чата отправить в лс бота_
  _4) указать нужное время для оповещения_`, {
    parse_mode: 'Markdown'
  });
});

var notes = [];
var chatid;
bot.onText(/\/notify (.+)/, async (msg, [source, match]) => {

  chatid = match;
  if (parseInt(msg.chat.id) < 0) {
    bot.sendMessage(msg.chat.id, `*Данная команда работает только в личных сообщениях*`, {
      parse_mode: 'Markdown'
    });
  } else {
    try {
      
      chat = await models.Chat.create({ 
        chat_id: chatCount, 
        tg_chat_id: chatid 
      });
    } catch (e) {
      console.log(e);
      let manager = await models.Manager.findOne({ where: { tg_manager_id: msg.chat.id } });
      chat = { id: manager.chatId };
    }
      
    try {
      await models.Manager.create({ 
        manager_id: managerCount, 
        chat_id: chatCount, 
        tg_manager_id: msg.chat.id,
        chatId: chat.id
      });
      
    } catch (e) {
      console.log(e);
    }
    
    
    
    bot.sendMessage(msg.chat.id, 'Выберите действие', {
      reply_markup: {
        keyboard: [
          ['/редактировать дейли', '/закрыть']
        ]
      }
    });

    bot.on('message', async msg => {
      
      
      if (msg.text === '/редактировать дейли') {
        bot.sendMessage(msg.chat.id, 'выберите день:', {
          reply_markup: {
            keyboard: [
              ['/пн', '/вт', '/ср'],
              ['/чт', '/пт', ],
              ['/сб', '/вс', '/закрыть'],
            ]
          }
        });
      }
    });
  }
});

let day;

bot.on('message', msg =>{
  switch (msg.text) {
    case '/пн':
      day = 1;
      weekDay = 'monday';
    break;  
    
    case '/вт':
      day = 2;
      weekDay = 'tuesday';
    break;

    case '/ср':
      day = 3;
      weekDay = 'wednesday';
    break;
    
    case '/чт':
      day = 4;
      weekDay = 'thursday';
    break;

    case '/пт':
      day = 5;
      weekDay = 'friday';
    break;

    case '/сб':
      day = 6;
      weekDay = 'saturday';
    break;

    case '/вс':
      day = 0;
      weekDay = 'sunday';
    break;
  }

  if (((msg.text === '/пн')||(msg.text === '/вт')||(msg.text === '/ср')||(msg.text === '/чт')||(msg.text === '/пт')||(msg.text === '/сб')||(msg.text === '/вс'))&&(chatid!='')) {
    count[day]=1;
    bot.sendMessage(msg.chat.id, 'Выберите время. пример записи "/время 21:34"', {
      reply_markup: {
        remove_keyboard: true
      }
    });
  

    bot.onText(/время (.+)/, async function (msg, [source1, match1]) {
      if(count[day] == 1){
        
        let t = match1.split('').slice(-2);
        if(t[1] == '0'){
          match1 = match1.split('').slice(-2,1).join('');
          console.log(match1);
        }   
        
        var time = day + ', ' + match1;
        console.log(time);
        
        
        if((chatid != undefined)&&(time != '')) {

          notes.push({
            'uid': chatid,
            'time': time,
            'day': day,
          });
          
          let timeForDB = match1.split(':');
          let dateForDB = new Date();
          dateForDB.setHours(timeForDB[0]);
          dateForDB.setMinutes(timeForDB[1]);
          
          
          try {
            let existingDaily = await models.Chat.findOne({include: {model: models.DailyTime, as: 'dailyTime'},  where: { tg_chat_id: chatid } });
            if ( existingDaily.dailyTime[0] ) {
              
              let dailyObject = {};
              dailyObject[weekDay] = dateForDB;
              
              await existingDaily.dailyTime[0].update(dailyObject);
              
            } else {
              
              let dailyObject = {
                daily_id: dailyCount,
                chatId: chat.id
              };
             
              dailyObject[weekDay] = dateForDB;
              
              await models.DailyTime.create(dailyObject);
              
            }
            
          } catch (e) {
            console.log(e);
          }
          
          bot.sendMessage(msg.chat.id, `Отлично! Я обязательно напомню в ${week[day]} ${match1}, если не сдохну :)`);
          count[day] = 0;

        } else bot.sendMessage(msg.chat.id, 'Ошибка! Напишите /help для того, чтобы узнать правильный порядок ввода команд');
        
      }
    });
  } 
});

setInterval(async function () {
  const curDate2 = new Date();
  curDate2.setHours(curDate2.getHours() + 2);
  const curDate = new Date();
  // let dailies = await models.DailyTime.findAll();
  // let dailies = await models.DailyTime.findAll({
  //   where: {
  //     [weekDays[curDate.getDay()]]: {
  //       [Op.lte]: curDate2
  //     }
  //   }
  // });
  
  let chatsDaily = await models.DailyTime.findAll({ where: {
      [weekDays[curDate.getDay()]]: {
        [Op.lte]: curDate2
      }
    
  } });
  
  let dailies = chatsDaily;
  
  console.log(chatsDaily);
  
  
  for (let i = 0; i < dailies.length; i++) {
    
    // const curDate2 = new Date().getDay() + ', ' + (new Date().getHours()+2) + ':' + new Date().getMinutes();
    
    for (let j = 0; j < week.length; j++) {
      if ((dailies[i][weekDays[j]] ? dailies[i][weekDays[j]].getHours() : '') == curDate2.getHours() && (dailies[i][weekDays[j]] ? dailies[i][weekDays[j]].getMinutes() : '') == curDate2.getMinutes()) {
        
        let chatTgId = await models.Chat.findByPk(dailies[i].chatId);
        let { manager } = await models.Chat.findOne({ include: {model: models.Manager, as: 'manager'}, where: { id: dailies[i].chatId }} );
        
        for (let p = 0; p < manager.length; p++) {
          bot.sendMessage(manager[p].tg_manager_id , `Напоминание: 
          *день недели*: _${weekDays[j]}_
          *время*: _${new Date().getHours() + ':' + new Date().getMinutes()}_
          *дейли начнется через два часа*`, {
          parse_mode: 'Markdown'
        });
        }
        
        bot.sendMessage(chatTgId.tg_chat_id , `Напоминание: 
          *день недели*: _${weekDays[j]}_
          *время*: _${new Date().getHours() + ':' + new Date().getMinutes()}_
          *дейли начнется через два часа*`, {
          parse_mode: 'Markdown'
        });
      }
    }
    



    // const curDate = new Date().getDay() + ', ' + new Date().getHours() + ':' + new Date().getMinutes();
    
    
    
    for (let j = 0; j < week.length; j++) {
      if ((dailies[i][weekDays[j]] ? dailies[i][weekDays[j]].getHours() : '') == curDate.getHours() && (dailies[i][weekDays[j]] ? dailies[i][weekDays[j]].getMinutes() : '') == curDate.getMinutes()) {
      
        let chatTgId = await models.Chat.findByPk(dailies[i].chatId);
        let { manager } = await models.Chat.findOne({ include: {model: models.Manager, as: 'manager'}, where: { id: dailies[i].chatId }} );
        
        for (let p = 0; p < manager.length; p++) {
          bot.sendMessage(manager[p].tg_manager_id , `Напоминание: 
          *день недели*: _${weekDays[j]}_
          *время*: _${new Date().getHours() + ':' + new Date().getMinutes()}_
          *дейли начинается сейчас*`, {
          parse_mode: 'Markdown'
        });
        }
        
        bot.sendMessage(chatTgId.tg_chat_id , `Напоминание: 
          *день недели*: _${weekDays[j]}_
          *время*: _${new Date().getHours() + ':' + new Date().getMinutes()}_
          *дейли начинается сейчас*`, {
          parse_mode: 'Markdown'
        });
        bot.sendSticker(dailies[i].tg_chat_id,'CAACAgIAAxkBAAIDFWAlGqvp8xWUkL2G4yeFTC0rHHgdAAIEAAPVhWMYCsDZsXKfqX8eBA');
      }
    }
  }
}, 60000);





// Сервер
const url = 'https://rentgbot.herokuapp.com/';

const PORT = process.env.PORT || 3000;


const app = express();

app.get('/', (req, res) => {
    res.send('Здрасьте, я бот)');
});

function doRequest(url) {
  https.get(url, (res) => {
    if (res.statusCode >= 300 && res.statusCode <= 400 && res.headers.location) {
      doRequest(res.headers.location);
    }
    res.on('data', (d) => {
    });

  }).on('error', (e) => {
    console.error(e);
  });
}
app.listen(PORT, _ => {
  setInterval(_ => {
      doRequest(url);
  }, 1200000);
});