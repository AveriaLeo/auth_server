/**
 * Created by leonid on 6/21/16.
 */

var config = {
    database: 'node-reset-auth',
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

module.exports = config;
