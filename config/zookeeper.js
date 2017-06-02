let zookeeper = require('node-zookeeper-client'),
    configs = require('./configs'),
    client = zookeeper.createClient(configs.zookeeper.host + ':' + configs.zookeeper.port);

client.connect();

module.exports.getConfigsData = function(systemConfigs, env, callback){

    client.once('connected', function(){
        console.log('Connected to zookeeper.');

        systemConfigs = Array.isArray(systemConfigs) ? systemConfigs : [ systemConfigs ];

        Promise.all(
            systemConfigs.map(function(systemConfig){
                return getData(client, configs.system_znode + "/" + env + "/" + systemConfig);
            })
        )
        .then(function(data){
            let result = {};

            for(let i = 0; i < data.length; i++)
                result[systemConfigs[i]] = data[i];

            callback(result);
        }).catch(function(error){
            console.log(error);
        });          
    });

}

module.exports.registerService = function(serviceType, url, port){
    return new Promise(function(resolve, reject){
        client.create(configs.services_znode + "/app" ,
                      new Buffer(JSON.stringify({ url : url, serviceType : serviceType, port : port })),
                      zookeeper.CreateMode.EPHEMERAL_SEQUENTIAL,
                      function(error, path){
                        if(error)
                            reject(error);
                        else
                            resolve(path);
                      });
    });
}

module.exports.getServicesAndWatch = getServicesAndWatch;

module.exports.getServiceData = function(servicePath){
    return new Promise(function(resolve, reject){
        client.getData(configs.services_znode + "/" + servicePath, function() {},
                    function(error, data){
                        if(error){
                            reject(error);
                        }else {
                            resolve(JSON.parse(data));
                        }
                    });
    });    
}

module.exports.disconnect = function(){
    client.close();
}

function getServicesAndWatch (watchCallback){
    return new Promise(function(resolve, reject){
        client.getChildren(configs.services_znode,
                           function(){
                               getServicesAndWatch(watchCallback).then(function(children){
                                  watchCallback(children);
                               });
                           },
                           function(error, children){
                                if(error){
                                    reject(error);
                                }else {
                                    resolve(children);
                                }
                           });
    });
}

function getData(client, znodePath){
    return new Promise(function(resolve, reject){
        client.getData(znodePath, function(){ } , function(error, data, stat){
            if(error)
                reject(error);
            else
                resolve(JSON.parse(data));            
        });
    })
}
