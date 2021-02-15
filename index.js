const TelegramBot = require('node-telegram-bot-api');
/* подключение токена*/
const token = require('./token.js');
token() !== "" ? console.log("\x1b[35m", 'Token was successfully received!') : console.log("\x1b[31m", 'Token was not received');

const bot = new TelegramBot(token(), {
  polling: true
});
var count = [];
const week = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];

function addChat(num) {
  bot.sendMessage(num, 'Если вы менеджер, отправтье в лс боту сообщение: ');
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
bot.onText(/\/notify (.+)/, (msg, [source, match]) => {

  chatid = match;
  if (parseInt(msg.chat.id) < 0) {
    bot.sendMessage(msg.chat.id, `*Данная команда работает только в личных сообщениях*`, {
      parse_mode: 'Markdown'
    });
  } else {

    bot.sendMessage(msg.chat.id, 'Выберите действие', {
      reply_markup: {
        keyboard: [
          [`/редактировать дейли`, '/закрыть']
        ]
      }
    });

    bot.on('message', msg => {
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
    break;  
    
    case '/вт':
      day = 2;
    break;

    case '/ср':
      day = 3;
    break;
    
    case '/чт':
      day = 4;
    break;

    case '/пт':
      day = 5;
    break;

    case '/сб':
      day = 6;
    break;

    case '/вс':
      day = 7;
    break;
  }

  if ((msg.text === '/пн')||(msg.text === '/вт')||(msg.text === '/ср')||(msg.text === '/чт')||(msg.text === '/пт')||(msg.text === '/сб')||(msg.text === '/вс')) {
    count[day]=1;
    bot.sendMessage(msg.chat.id, 'Выберите время:', {
      reply_markup: {
        remove_keyboard: true
      }
    });
  

    bot.onText(/время (.+)/, function (msg, [source1, match1]) {
      if(count[day] == 1){
        var time = day + ', ' + match1; 
        notes.push({
          'uid': chatid,
          'time': time,
          'day': day
        });
        bot.sendMessage(msg.chat.id, `Отлично! Я обязательно напомню в ${week[day]} ${match1}, если не сдохну :)`);
        count[day] = 0;
      }
    });
  }
});

setInterval(function () {
  for (var i = 0; i < notes.length; i++) {
    const curDate = new Date().getDay() + ', ' + new Date().getHours() + ':' + new Date().getMinutes();
    console.log(notes);
    if (notes[i]['time'] == curDate) {
      
      bot.sendMessage(notes[i]['uid'] , `Напоминание: 
*день недели*: _${week[notes[i]['day']]}_
*время*: _${new Date().getHours() + ':' + new Date().getMinutes()}_
*дейли начинается*`, {
        parse_mode: 'Markdown'
      });
      bot.sendSticker(notes[i]['uid'],'CAACAgIAAxkBAAIDFWAlGqvp8xWUkL2G4yeFTC0rHHgdAAIEAAPVhWMYCsDZsXKfqX8eBA');

      notes.splice(i, 1);
    }
  }
}, 1000);
