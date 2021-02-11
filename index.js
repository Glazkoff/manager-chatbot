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

/* понедельник */
bot.on('message', msg => {
  if (msg.text === '/пн') {
    let day = 1;
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
        bot.sendMessage(chatid, `Дейли: ${week[day]} ${match1}`);
        bot.sendMessage(msg.chat.id, `Отлично! Я обязательно напомню в ${week[day]} ${match1}, если не сдохну :)`);
        count[day] = 0;
      }
    });
  }
});



/* вторник */
bot.on('message', msg => {
  if (msg.text === '/вт') {
    let day = 2;
    count[day] = 1;
    bot.sendMessage(msg.chat.id, 'Выберите время:', {
      reply_markup: {
        remove_keyboard: true
      }
    });
    bot.onText(/время (.+)/, function (msg, [source1, match2]) {
      if(count[day] == 1){
        var time = day + ', ' + match2;
        notes.push({
          'uid': chatid,
          'time': time,
          'day': day
        });
        bot.sendMessage(chatid, `Дейли: ${week[day]} ${match2}`);
        bot.sendMessage(msg.chat.id, `Отлично! Я обязательно напомню в ${week[day]} ${match2}, если не сдохну :)`);
        count[day]=0;
      }
    });
  }
});



/* среда */
bot.on('message', msg => {
  if (msg.text === '/ср') {
    let day = 3;
    count[day] = 1;
    bot.sendMessage(msg.chat.id, 'Выберите время:', {
      reply_markup: {
        remove_keyboard: true
      }
    });
    bot.onText(/время (.+)/, function (msg, [source1, match3]) {
      if(count[day] == 1){
        var time = day + ', ' + match3;
        notes.push({
          'uid': chatid,
          'time': time,
          'day': day
        });
        bot.sendMessage(chatid, `Дейли: ${week[day]} ${match3}`);
        bot.sendMessage(msg.chat.id, `Отлично! Я обязательно напомню в ${week[day]} ${match3}, если не сдохну :)`);
        count[day] = 0;
      }
    });
  }
});

/* четверг */
bot.on('message', msg => {
  if (msg.text === '/чт') {
    let day = 4;
    count[day] = 1;
    bot.sendMessage(msg.chat.id, 'Выберите время:', {
      reply_markup: {
        remove_keyboard: true
      }
    });
    bot.onText(/время (.+)/, function (msg, [source1, match4]) {
        if(count[day] == 1){
        var time = day + ', ' + match4;
        notes.push({
          'uid': chatid,
          'time': time,
          'day': day
        });
        console.log(chatid);
        bot.sendMessage(chatid, `Дейли: ${week[day]} ${match4}`);
        bot.sendMessage(msg.chat.id, `Отлично! Я обязательно напомню в ${week[day]} ${match4}, если не сдохну :)`);
        count[day] = 0;
      }
    });
  }
});



/* пятница */
bot.on('message', msg => {
  if (msg.text === '/пт') {
    let day = 5;
    count[day] = 1;
    bot.sendMessage(msg.chat.id, 'Выберите время:', {
      reply_markup: {
        remove_keyboard: true
      }
    });
    bot.onText(/время (.+)/, function (msg, [source1, match5]) {
      if(count[day] == 1){
        var time = day + ', ' + match5;
        notes.push({
          'uid': chatid,
          'time': time,
          'day': day
        });
        bot.sendMessage(chatid, `Дейли: ${week[day]} ${match5}`);
        bot.sendMessage(msg.chat.id, `Отлично! Я обязательно напомню в ${week[day]} ${match5}, если не сдохну :)`);
        count[day] = 0;
      }
    });
  }
});

/* суббота */
bot.on('message', msg => {
  if (msg.text === '/сб') {
    let day = 6;
    count[day] = 1;
    bot.sendMessage(msg.chat.id, 'Выберите время:', {
      reply_markup: {
        remove_keyboard: true
      }
    });
    bot.onText(/время (.+)/, function (msg, [source1, match6]) {
      if(count[day] == 1){
        var time = day + ', ' + match6;
        notes.push({
          'uid': chatid,
          'time': time,
          'day': day
        });
        bot.sendMessage(chatid, `Дейли: ${week[day]} ${match6}`);
        bot.sendMessage(msg.chat.id, `Отлично! Я обязательно напомню в ${week[day]} ${match6}, если не сдохну :)`);
      }
    });
  }
});

/* воскресенье */
bot.on('message', msg => {
  if (msg.text === '/вс') {
    let day = 0;
    count[day] = 1;
    bot.sendMessage(msg.chat.id, 'Выберите время:', {
      reply_markup: {
        remove_keyboard: true
      }
    });
    bot.onText(/время (.+)/, function (msg, [source1, match7]) {
      if(count[day]){
      var time = day + ', ' + match7;
      notes.push({
        'uid': chatid,
        'time': time,
        'day': day
      });
      bot.sendMessage(chatid, `Дейли: ${week[day]} ${match7}`);
      bot.sendMessage(msg.chat.id, `Отлично! Я обязательно напомню в ${week[day]} ${match7}, если не сдохну :)`);
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
      bot.sendSticker(notes[i],['uid'],'CAACAgIAAxkBAAIDFWAlGqvp8xWUkL2G4yeFTC0rHHgdAAIEAAPVhWMYCsDZsXKfqX8eBA');

      notes.splice(i, 1);
    }
  }
}, 1000);
