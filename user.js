/**
 * Created by leonid on 6/21/16.
 */
var express = require("express");
var Sequelize = require("sequelize");
var configdb = require("./database");
var bcrypt  = require("bcrypt");
var sequelize = new Sequelize(configdb.database, configdb.username, configdb.password, configdb.options);

var User = sequelize.define('user', {
    user: {
        type: Sequelize.STRING,
        unique: true,
        required: true
    },
    password:  {
        type: Sequelize.STRING,
        unique: true,
        required: true
    }
});

sequelize
    .sync()
    .then(function() {

        bcrypt.genSalt(10, function (err, salt) {

            bcrypt.hash() {

            }

        }
        /*
        return User.create({
            login: 'test',
            password: 'test'
        });
        */
    })
    .then(function(user) {
        console.log('Возврат данных в виде json');
        var jsonUser = user.get({
            plain: true
        });
        console.log(jsonUser);
    });
