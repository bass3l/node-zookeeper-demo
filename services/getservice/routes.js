
module.exports = function(app){
    app.get('/', function(req, res){
        res.send("GET / :" + process.port);
    });

    app.get('/posts', function(req, res){
        res.send("GET /posts :" + process.port);
    });
}