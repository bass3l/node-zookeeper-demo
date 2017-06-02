
module.exports = function(app){
    app.post('/post', function(req, res){
        res.send("POST /post :" + process.port);
    });
}