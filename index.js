const TelegramBot = require('node-telegram-bot-api');
/* подключение токена*/
const token = require('./token.js');
token() !== ""? console.log("\x1b[35m",'Token was successfully received!'):console.log("\x1b[31m",'Token was not received');

const bot = new TelegramBot(token(), {
  polling:true
});

function addChat(num) {
  bot.sendMessage(num, `Если вы менеджер, отправтье в лс боту сообщение: 
/notify ${num}`);
}

/* варианты сообщений */
bot.on('message', msg=> {
  if(msg.text.toLowerCase() == "привет, бот"){
    bot.sendMessage(msg.chat.id, `привет, ${msg.from.first_name}!`);
  } else if(msg.text === '/закрыть' ){
    bot.sendMessage(msg.chat.id, 'закрываю клавиатуру', {
      reply_markup: {
        remove_keyboard:true
      }
    })
  }  
});

bot.onText(/\/chatid/, msg => {
  if(parseInt(msg.chat.id)<0) {
    addChat(msg.chat.id);
  } 
  else {
    bot.sendMessage(msg.chat.id, `*Данная команда работает только в чате*`, {
      parse_mode: 'Markdown'
    });
  }
});

bot.onText(/\/start/, msg => {
  bot.sendMessage(msg.chat.id, `Дорогой ${msg.from.first_name}, данный бот был придуман для бла бла бла бла...`);
});

bot.onText(/\/help/, msg => {
  bot.sendMessage(msg.chat.id, `*Список необходимых действий*:
  _1) Добавить бота в группу_
  _2) Написать в группе /chatid@PolywebBot_
  _3) Полученный код чата отправить в лс бота_
  _4) указать нужное время для оповещения_` , {
    parse_mode: 'Markdown'
  });
});


bot.onText(/\/notify (.+)/, (msg, [source, match]) => {
  if(parseInt(msg.chat.id)<0) {
    bot.sendMessage(msg.chat.id, `*Данная команда работает только в личных сообщениях*`, {
      parse_mode: 'Markdown'
    });
  } 
  else {
    
    bot.sendMessage(msg.chat.id, 'Выберите действие', {
      reply_markup: {
        keyboard: [
          [`/редактировать дейли`, '/закрыть']
        ]
      }
    });
  
  bot.on('message', msg=> {
    if(msg.text === '/редактировать дейли'){
      bot.sendMessage(msg.chat.id, 'выберите день:', {
        reply_markup: {
          keyboard: [
            ['/пн', '/вт', '/ср'],
            ['/чт', '/пт',],
            ['/сб', '/вс','/закрыть'],
          ]
        }
      });
    }
  });  




  }
});