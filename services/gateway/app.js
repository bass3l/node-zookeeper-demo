let express = require('express'),
    routes = require('./routes'),
    bootstrap = require('./../../config/bootstrap'),
    env = process.argv[2] || 'dev';


bootstrap(env, routes);




