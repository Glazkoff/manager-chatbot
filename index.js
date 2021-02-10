const TelegramBot = require('node-telegram-bot-api');
/* подключение токена*/
const token = require('./token.js');
token() !== ""? console.log("\x1b[35m",'Token was successfully received!'):console.log("\x1b[31m",'Token was not received');

/* настройка работы интервала с сервером */
const bot = new TelegramBot(token(), {
  polling:true
})

/* закрепить */
function addChat(num) {
  bot.sendMessage(num, `Если вы менеджер, отправтье в лс боту сообщение: 
/notify ${num}`);
}

/* варианты сообщений */
bot.on('message', msg=> {
  if(msg.text.toLowerCase() == "привет, бот"){
    bot.sendMessage(msg.chat.id, 'привет!');
    console.log(msg)
  }  
});

bot.onText(/\/chatID/, msg => {
  if(parseInt(msg.chat.id)<0) {
    addChat(msg.chat.id);
  } 
  else {
    bot.sendMessage(msg.chat.id, `Переписка не является группой`);
  }
})