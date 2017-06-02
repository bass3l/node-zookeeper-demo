let request = require('request'),
    balancer = require('./balancer');

module.exports = function(app){
    app.get('/*', function(req, res){

        //var serviceUrl = "http://localhost:3001";

        var service = balancer.getGETService();

        console.log("GET Service " + JSON.stringify(service));

        var serviceUrl = "http://" + service.data.url + ":" + service.data.port;        

        var newUrl = serviceUrl + req.originalUrl;

        var rreq = request(newUrl);

        console.log("* Routing " + req.originalUrl + " to: " + newUrl);

        req.pipe(rreq).pipe(res);

    });

    app.post('/*', function(req, res){

        //var serviceUrl = "http://localhost:3002";

        var service = balancer.getPOSTService();

        console.log("POST Service " + service);

        var serviceUrl = "http://" + service.data.url + ":" + service.data.port;

        var newUrl = serviceUrl + req.originalUrl;

        var rreq = request({ uri : newUrl, json : req.body });

        console.log("* Routing " + req.originalUrl + " to: " + newUrl);

        req.pipe(rreq).pipe(res);

    });
}