var Peers = require('weighted-round-robin'),
    zookeeper = require('./../../config/zookeeper'),
    _ = require('lodash'),
    getPeers = new Peers(),
    postPeers = new Peers(),
    getServices = [],
    postServices = [];
    
bootstrapServiceRegistry();

module.exports.getGETService = function(){
    return getPeers.get().service;
}

module.exports.getPOSTService = function(){
    return postPeers.get().service;
}

function bootstrapServiceRegistry(){
    zookeeper.getServicesAndWatch(function(services){
        //invoked each time the services change
        onServicesChange(services);

    }).then(function(services){
        //invoked first time only
        
        //get services' data
        let promises = [];
        services.forEach(function(service){
            promises.push(
                zookeeper.getServiceData(service)
            );
        });

        return Promise.all(promises)
                      .then(function(servicesData){
                          let _servicesData = [];

                          for(let i =0; i < servicesData.length; i++)
                            _servicesData.push({ service : services[i], data : servicesData[i] });

                          return _servicesData;
                      });
    }).then(function(services){
        
        //filter services by type
        getServices = services.filter(function(service) { return service.data.serviceType == 'GET' });
        postServices = services.filter(function(service) { return service.data.serviceType == 'POST' });

        getServices.forEach(function(getService){
            getPeers.add({service : getService, weight : 10 });
        });

        postServices.forEach(function(postService){
            postPeers.add({service : postService, weight : 10 });
        });

    });
}

function onServicesChange(services){

    //get services' data
    let promises = [];
    services.forEach(function(service){
        promises.push(
            zookeeper.getServiceData(service)
        );
    });

    Promise.all(promises)
           .then(function(servicesData){
                let _servicesData = [];

                for(let i =0; i < servicesData.length; i++)
                _servicesData.push({ service : services[i], data : servicesData[i] });

                return _servicesData;
            })
            .then(function(services){

                //filter services by type
                newGetServices = services.filter(function(service) { return service.data.serviceType == 'GET' });
                newPostServices = services.filter(function(service) { return service.data.serviceType == 'POST' });

                //GET services:
                //for each old service, if not found, remove it from peers
                for(let i = 0; i < getServices.length; i++){
                    let found = false;

                    for(let j = 0; j < newGetServices.length; j++){
                        if(newGetServices[j].service == getServices[i].service)
                            found = true;
                    }

                    if(!found)
                        getPeers.remove(function(peer) { return peer.service.service == getServices[i].service; });
                    
                }

                //for each new service, add it to peers
                for(let i = 0; i < newGetServices.length; i++){
                    let found = false;

                    for(let j = 0; j < getServices.length; j++){
                        if(newGetServices[i].service == getServices[j].service)
                            found = true;
                    }

                    if(!found)
                        getPeers.add({ service : newGetServices[i], weight : 10 });
                }

                getServices = newGetServices;
                //POST services
                //for each old service, if not found, remove it from peers
                for(let i = 0; i < postServices.length; i++){
                    let found = false;

                    for(let j = 0; j < newPostServices.length; j++){
                        if(newPostServices[j].service == postServices[i].service)
                            found = true;
                    }

                    if(!found)
                        postPeers.remove(function(peer) { return peer.service.service == postServices[i].service; });
                    
                }

                //for each new service, add it to peers
                for(let i = 0; i < newPostServices.length; i++){
                    let found = false;

                    for(let j = 0; j < postServices.length; j++){
                        if(newPostServices[i].service == postServices[j].service)
                            found = true;
                    }

                    if(!found)
                        postPeers.add({ service : newPostServices[i], weight : 10 });
                }
                
                postServices = newPostServices;

            });
}


