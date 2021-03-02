const { Sequelize, Model, DataTypes } = require('sequelize');
const config = require('./config.db.js');

const sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  dialect: 'postgres',
  logging: false
});

async function lol() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}



const Chat = sequelize.define("chat", {
  chat_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  tg_chat_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: true
  }
}, {
  freezeTableName: true
});

const Manager = sequelize.define("manager", {
  manager_id: { 
    type: DataTypes.BIGINT,
    allowNull: false
  },
  chat_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  tg_manager_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: true
  }
}, {
  freezeTableName: true
});


const DailyTime = sequelize.define('daily', {
  daily_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  // chat_id: {
  //   type: DataTypes.BIGINT,
  //   allowNull: false
  // },
  sunday: {
    type: DataTypes.DATE,
    allowNull: true
  },
  monday: {
    type: DataTypes.DATE,
    allowNull: true
  },
  tuesday: {
    type: DataTypes.DATE,
    allowNull: true
  },
  wednesday: {
    type: DataTypes.DATE,
    allowNull: true
  },
  thursday: {
    type: DataTypes.DATE,
    allowNull: true
  },
  friday: {
    type: DataTypes.DATE,
    allowNull: true
  },
  saturday: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  freezeTableName: true
});

Chat.hasMany(Manager, { as: 'manager' });
Chat.hasMany(DailyTime, { as: 'dailyTime' });

sequelize
  // .sync({
  //   force: true
  // })
  .sync({
    alter: true
  })
  // .sync()
  .then(result => {
    console.log("Подключено к БД");
  })
  .catch(err => console.log("Ошибка подключения к БД", err));

module.exports = {
  Chat,
  Manager,
  DailyTime,
  test: lol
};