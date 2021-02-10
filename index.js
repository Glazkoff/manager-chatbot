const TelegramBot = require('node-telegram-bot-api')
/* подключение токена*/
const token = require('./token.js')
token() !== ""? console.log("\x1b[35m",'Token was successfully received!'):console.log("\x1b[31m",'Token was not received') 

/* настройка работы интервала с сервером */
const bot = new TelegramBot(token(), {
  polling: {
    interval:300,
    autoStart: true, // переключить на true на проде
    params: {
      timeout:10
    }
  }
})

bot.on('message', msg=> {
  bot.sendMessage(msg.chat.id, 'привет!')
})