/**
 * Created by leonid on 6/21/16.
 */
//Здесь мы будем эксперементировать с аутентификацией.
//Попытка номер ждва. Нашел статью на хабре, попробую по ней.
/*
Единственное, меня до сих пор смущает, что для работы с passport.js
необходим mongoose.js. Учитывая, что уже используется sequelize,
использование мангуста кажется немного странным, так как они
выполняют одни и те же ф-ии.
 */

/*
Я создам две модели пользователя на mongoose и sequelize
и посмотрю, насколько они взаимозаменяемы.

Походу вообще плевать. Использую sequelize.
 */

var Passport = require("passport");
var Mongoose = require("mongoose");
var Express = require("express");
var Sequelize = require("sequelize");
var Config = require("./config/sqconfig");
var LocalStrategy  = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Session = require('express-session');



app = Express();
app.use(cookieParser());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(Session({ secret: 'SECRET' }));

app.use(Passport.initialize());
app.use(Passport.session());

//Тестовая инициализация сиквалайза

var sequelize = new Sequelize(Config.servercfg.database, Config.servercfg.username, Config.servercfg.password, Config.servercfg.options);
sequelize
    .authenticate()
    .then(function() {
        console.log('Connection has been established successfully.');
    })
    .catch(function (err) {
        console.log('Unable to connect to the database:', err);
    });

//Создаем модель пользователя (sequelize)
//Определяет структуру таблицы в sequelize
var User = sequelize.define('users_testificate', Config.servercfg.usercfg);

Passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, function(username, password,done){
    User.findOne({ username : username},function(err,user){
        return err
            ? done(err)
            : user
            ? password === user.password
            ? done(null, user)
            : done(null, false, { message: 'Incorrect password.' })
            : done(null, false, { message: 'Incorrect username.' });
    });
}));

Passport.serializeUser(function(user, done) {
    done(null, user.id);
});


Passport.deserializeUser(function(id, done) {
    User.findById(id, function(err,user){
        err
            ? done(err)
            : done(null,user);
    });
});


//Прописываю контроллеры (пока сюда, да простит меня господь)

var controllers = {
    users: {
        login: function(req, res, next) {
            console.log('LOGINNING!');
            Passport.authenticate('local',
                function(err, user, info) {
                    return err
                        ? next(err)
                        : user
                        ? req.logIn(user, function(err) {
                        return err
                            ? next(err)
                            : res.redirect('/private');
                    })
                        : res.redirect('/');
                }
            )(req, res, next);
        },
        logout: function(req, res) {
            req.logout();
            res.redirect('/');
        },
        register: function(req, res, next) {
            var user = new User({ username: req.body.email, password: req.body.password});
            user.save(function(err) {
                return err
                    ? next(err)
                    : req.logIn(user, function(err) {
                    return err
                        ? next(err)
                        : res.redirect('/private');
                });
            });
        },
        mustAuthenticatedMw: function(req, res, next) {
            req.isAuthenticated()
                ? next()
                : res.redirect('/');
        }
    }
}

Passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, function(username, password,done){
    User.findOne({ username : username},function(err,user){
        return err
            ? done(err)
            : user
            ? password === user.password
            ? done(null, user)
            : done(null, false, { message: 'Incorrect password.' })
            : done(null, false, { message: 'Incorrect username.' });
    });
}));

//Пост запросы на аутентификацию
app.post('/login',                   Passport.authenticate('local'), controllers.users.login);
app.post('/register',                Passport.authenticate('local'), controllers.users.register);
app.get('/logout',                   Passport.authenticate('local'), controllers.users.logout);
app.all('private',  Passport.authenticate('local'), controllers.users.mustAuthenticatedMw);
app.all('private/*',  Passport.authenticate('local'), controllers.users.mustAuthenticatedMw);


app.listen(3000);
