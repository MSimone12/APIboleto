const bodyParser = require('body-parser');
const express =  require('express');
const App = require('./app');
const router = express.Router();
const server = express();
const port = 4000;


server.use(bodyParser.urlencoded({ extended: true}));
server.use(bodyParser.json());

server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

router.get('/', function(req, res){
    console.log(req);
    res.send("API para boleto EWALLY");
})

router.post("/api", function(req, res){
    var a = new App();
    var resposta = a.CalcularDados(req.body.boleto);

    res.json(resposta);
})

server.listen(process.env.PORT || port, function(){
    console.log('To ouvindo na porta '+port+'!');
});
server.use('/', router);
server.use('/api', router);

module.exports = server;