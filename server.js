const bodyParser = require('body-parser');
const express =  require('express');
const App = require('./app');
const router = express.Router();
const server = express();
const port = 4000;


server.use(bodyParser.urlencoded({ extended: true}));
server.use(bodyParser.json());

router.get('/', function(req, res){
    console.log(req);
    res.send("API para boleto EWALLY");
})

router.post("/api", function(req, res){
    var a = new App();
    var resposta = a.CalcularDados(req.body.boleto);

    console.log(resposta);

    res.json(resposta);
})

server.listen(process.env.PORT || port, function(){
    console.log('To ouvindo na porta '+port+'!');
});
server.use('/', router);
server.use('/api', router);

module.exports = server;