let zookeeper = require('./zookeeper'),
    app = require('express')();

module.exports = function(env, route, registerService, service){
    zookeeper.getConfigsData(["db", "express"], env, function(configs){

        //after we've got our configurations from zookeeper, we start boostraping our components
        bootstrapExpress(configs.express, route, registerService, service);
        
    });
}

function bootstrapExpress(configs, route, registerService, service){
    let ports = configs.ports;

    function createServer(idx){

        if(idx >= ports.length){
            console.log("* Aborting, no available ports on machine...");
            zookeeper.disconnect();
            return;
        }

        app.listen(ports[idx], function(){
            //up and running
            console.log("* Node app up and running on " + ports[idx]);

            //bootstrap routes
            route(app);

            //register service ?
            if(registerService){

                process.port = service.port = ports[idx]; // augment with selected port

                zookeeper.registerService(service.serviceType, service.url, service.port)
                         .then(function(path){
                            console.log("* Service registered under " + path);
                         })
                         .catch(function(error){
                             console.log("* Error registering service:");
                             console.log(error);
                         });
            }

        })
        .on('error', function(){ 
            //try new port
            createServer(++idx);
        });
    }
    createServer(0);
}