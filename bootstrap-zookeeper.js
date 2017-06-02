/*
 * this script is used to bootstrap zookeeper with initialized configs, 
 * for more info see https://github.com/bass3l/node-zookeeper-demo
 */

var zookeeper = require('node-zookeeper-client'),
    configs = require('./config/configs'),
    client = zookeeper.createClient(configs.zookeeper.host + ':' + configs.zookeeper.port);


client.once('connected', function(error){
    console.log("connected to zookeeper, creating nodes...");

    var promises = [
        new Promise(function(resolve, reject){
            client.create('/system', //path
                       null, //data
                       zookeeper.CreateMode.PERSISTENT, //mode
                       function(error, path){ //callback
                            if(error)
                                reject(error);
                            else
                                resolve();
                        });
        }),
        new Promise(function(resolve, reject){
            client.create('/services', //path
                       null, //data
                       zookeeper.CreateMode.PERSISTENT, //mode
                       function(error, path){ //callback
                            if(error)
                                reject(error);
                            else
                                resolve();
                        });
            
        }),
        new Promise(function(resolve, reject){
            client.create('/system/dev', //path
                       null, //data
                       zookeeper.CreateMode.PERSISTENT, //mode
                       function(error, path){ //callback
                            if(error)
                                reject(error);
                            else
                                resolve();
                        });
            
        }),
        new Promise(function(resolve, reject){
            client.create('/system/prod', //path
                       null, //data
                       zookeeper.CreateMode.PERSISTENT, //mode
                       function(error, path){ //callback
                            if(error)
                                reject(error);
                            else
                                resolve();
                        });
            
        }),
        new Promise(function(resolve, reject){
            client.create('/system/test', //path
                       null, //data
                       zookeeper.CreateMode.PERSISTENT, //mode
                       function(error, path){ //callback
                            if(error)
                                reject(error);
                            else
                                resolve();
                        });
            
        }),
        new Promise(function(resolve, reject){
            client.create('/system/dev/db', //path
                       new Buffer(JSON.stringify({ host : '127.0.0.1', port : '56828', name : 'db_name', user : 'db_user', password : 'db_password'})), //data
                       zookeeper.CreateMode.PERSISTENT, //mode
                       function(error, path){ //callback
                            if(error)
                                reject(error);
                            else
                                resolve();
                        });
            
        }),
        new Promise(function(resolve, reject){
            client.create('/system/prod/db', //path
                       new Buffer(JSON.stringify({ host : '127.0.0.1', port : '56828', name : 'db_name', user : 'db_user', password : 'db_password'})), //data
                       zookeeper.CreateMode.PERSISTENT, //mode
                       function(error, path){ //callback
                            if(error)
                                reject(error);
                            else
                                resolve();
                        });
            
        }),
        new Promise(function(resolve, reject){
            client.create('/system/test/db', //path
                       new Buffer(JSON.stringify({ host : '127.0.0.1', port : '56828', name : 'db_name', user : 'db_user', password : 'db_password'})), //data
                       zookeeper.CreateMode.PERSISTENT, //mode
                       function(error, path){ //callback
                            if(error)
                                reject(error);
                            else
                                resolve();
                        });
            
        }),
        new Promise(function(resolve, reject){
            client.create('/system/dev/express', //path
                       new Buffer(JSON.stringify({ ports : [3001, 3002, 3003, 3004, 3005]})), //data
                       zookeeper.CreateMode.PERSISTENT, //mode
                       function(error, path){ //callback
                            if(error)
                                reject(error);
                            else
                                resolve();
                        });
            
        }),
        new Promise(function(resolve, reject){
            client.create('/system/prod/express', //path
                       new Buffer(JSON.stringify({ ports : [3001, 3002, 3003, 3004, 3005]})), //data
                       zookeeper.CreateMode.PERSISTENT, //mode
                       function(error, path){ //callback
                            if(error)
                                reject(error);
                            else
                                resolve();
                        });
            
        }),
        new Promise(function(resolve, reject){
            client.create('/system/test/express', //path
                       new Buffer(JSON.stringify({ ports : [3001, 3002, 3003, 3004, 3005]})), //data
                       zookeeper.CreateMode.PERSISTENT, //mode
                       function(error, path){ //callback
                            if(error)
                                reject(error);
                            else
                                resolve();
                        });
            
        })
    ];

    Promise.all(promises)
    .then(function(){
        client.close();
        console.log("All went well...");
    }).catch(function(error){
        console.log("Something went wrong:");
        console.log(error);
    });

});

client.connect();

