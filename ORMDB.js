/**
 * Created by leonid on 6/17/16.
 */

/*
 /\
 |   ^,
 ,_-/---;;___     |   ,\
 (^^-.. /^ /   /#/--/ ^^---/   \ \
 \ ) \^^-/_  /#/--/      |     ; \
 .\  )  \  \##|-;       /     |  ,
 /  ^\|   ) /#/--|      (      |  |
 {  / ^\  ||#|---|       \,    /  |
 /  /  | ^\_|#|---| _______.\.     /
 [  ^  /    _#-^^^^// ## # | ~    /
 /  |  ;  _/       / | ##  # \     |
 |  |  |/\(        | | ##### |     |
 |  / / \_)\       | |  # #  /-.   |
 |  /  ._ / ^\     | \. ### /--,  //
 | /      \\-_\     \  \  ./--,  /|                    ---/^^^---\,
 \/        |###)    \   ^^     /^ |                  /^     ____   ^\,
 \*#/     |     \__/ ,/|                /^    /^^----^^\   ^\
 \_/          /  _./ /\              /^    --___--_----^-,  ^\
 /^ )  |      |^^ _/^  |             |  -,-/^######^^\----\   \
 \,  ,/      /--^^  _/^\            / -/^#############^\---\   |
 \-__---^^/|   _-^/ ##\,         | /^.,;---;,.   #####^,--\  \|
 / L/-^ /^ ##--|)-^^^^^\/ /_,--^-,    \,   #####;--;  |\
 /    ,-/   ##-| |        \/       ^^\   \    ###\--\  | \
 |   ,/     ##--| /  * ^  * |          \   \    ##|--|  | |
 /    \    ###--/ /   _ | _   \          ^|  \   ##|--|   \ \
 |     ^,####--/  |    \A/     |           \  |  ##\---\  | |
 |       \##--/  ,^ *  /#\     |            | |   ##|--|  | |
 |        \--/   /    / V \    /            \  \  ##|--|  |  \
 \         ^\  ,/       |   * |              | ^  ##/-/   /  |
 |\         ^V       *       /              |  \ #|--|  |   |
 |^\  |          \         /               |  | #|--|  |   |
 \  ^\/           ^;      |                |  | #|--|  |   |
 \  /     /----^^^ \     /^^\             |  | #/-/  /    /
 \ |    |      ^\  \        |             \ |#|--|  |   -
 /     |\       \  ^\       \            | |#|--|  | ,/
 /      | ;       \   ^       |           | |#|--/ | /
 |      | \        ^   \       \          // #/-|   -
 /       ^  ;        \   \       |        | |#|--| ,/
 |       |   \         |   \      |        | ^#|--,/
 |       |    ;        |   |       \      ,/|#|--/
 /        |    |        |   |        |     | / ,/
 /         |     \       |   |        |     / ,/
 |         |      |       /   |        \    |,/
 /          |      |      /    /         |   /
 /          /       /      (   /          |
 (          /-----^^^        ^^^|          /
 ^-------^^                    \-------^^
 */          //  Понечка Твайлайт. Сломалась (((




var express = require("express");
var Sequelize = require("sequelize");



var config = {
    database: 'nodejs_test',
    username: 'root',
    password: '',
    options: {
        host: 'localhost',
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    }
};


var sequelize = new Sequelize(config.database, config.username, config.password, config.options);
sequelize
    .authenticate()
    .then(function(err) {
        console.log('Connection has been established successfully.');
    })
    .catch(function (err) {
        console.log('Unable to connect to the database:', err);
    });

//Определяет структуру таблицы в sequelize
var User = sequelize.define('users_testificate', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    login: Sequelize.STRING,
    password: Sequelize.STRING
});


/*
 Unhandled rejection SequelizeUniqueConstraintError: Validation error
 Идентификатор не задается при создании, на место его передается null, что воспринимается как 0.
 Повторное создание строки с id - 0 приводит к этой ошибке.
 Необходимо добиться автоинкрементации.
 */
sequelize
// эта хрень синхронизирует структуру
    .sync()
    // возвращает промис
    .then(function() {
        // По промису содает пользователя.
        return User.create({
            // id: 1, //Нельзя создать строку в таблице с таким же id (огр. primaryKey)
            //Этому полю вообще ничего не нужно присваивать, если включена автоинкрементация в столбце.
            login: 'test',
            password: 'test'
        });
    })
    .then(function(user) {
        console.log('Возврат данных в виде json');
        var jsonUser = user.get({
            plain: true
        });
        console.log(jsonUser);
    });

/*
 Unhandled rejection TypeError: Cannot read property 'get' of null
 Кусок кода не может найти того, чего нет.
 */
User
    .findOne({where: {id: 3}})
    .then(function (user) {
        var json = user.get({plain: true});
        console.log(json);
    })
    .catch(function(user) {
        console.log("Required row not found. Sorry :(");
    });


//Стадия изучения №2. Попробуем использовать уже созданную таблицу.

//var Model = sequelize.import();

var Mail = sequelize.define('mail', {
    account_id: Sequelize.INTEGER,
    raw: Sequelize.TEXT,
    title: Sequelize.STRING,
    from: Sequelize.STRING,
    to: Sequelize.STRING,
    delivery_time: Sequelize.DATE
});


sequelize
// Снова синхронизируем.
    .sync()
    .then(function() {
        //return Mail.create({});
    });




//Редактирование данных производится следующим образом:
/*
 НИХРЕНА ЭТО НЕ РАБОТАЕТ
 Надо было читать оффициальную документацию, а не stackoverflow

 Project.find({ where: {title: 'aProject'} }).on('success', function(project) {
 if (project) { // if the record exists in the db
 project.updateAttributes({
 title: 'a very different title now'
 }).success(function() {});
 }
 })

 Ещё не пробовал, ибо влом, да и собираться пора.

 Пришел пробовать:

 */

Mail
.findOne({where: {account_id: 3}})
.then(function (mail){
   if (mail) {
       mail.update({raw: "This text was changed"}).then(function () {

       })
   }
});

Mail
    .findOne({where: {account_id: 3}})
    .then(function (mail) {
        var json_test = mail.get({plain: true});
        console.log(json_test);

    });

/*
            ^
            |
            |
            
    Вот эта хрень уже работает.

 http://docs.sequelizejs.com/en/latest/docs/instances/
 Вот тут подробнее.

 */