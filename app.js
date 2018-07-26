const fs = require('fs');

module.exports = class App {
    constructor(){
        
    }

    CalcularDados(input) {

        var inputFinal = input.replace(/[^0-9]/g, "");

        if(inputFinal.length != 47){
            return ({erro: "boleto não é valido"});
        }
        else
        {

            var valor = this.CalculaValor(inputFinal);
            var vencimento = this.CalculaData(inputFinal);
            var cod = this.CalculaCodBarras(inputFinal);
            var inst = this.InstituicaoFinanceira(inputFinal);

            var json = {
                "instituicao": inst,
                "valor": valor,
                "vencimento": vencimento,
                "codigo": cod,
            }

            return JSON.stringify(json);
        }

    }

    CalculaValor(input) {
        var valor = parseFloat(input.substring(input.length-10, input.length)).toString();

        if (valor.length == 2) { // verifica se linha tem apenas 2 caracteres
            var valor_final = "0," + valor; // coloca o zero na frente
        }else if (valor.length == 1) { // verifica se linha tem apenas 1 caractere
            var valor_final = "0,0" + valor; // coloca o 0,0 na frente
        } else { // qualquer outro valor ganha a mesma formatação
            var valor_final = valor.substring(0, valor.length -2) + "," + valor.substring(valor.length -2, valor.length);
        }

        return valor_final;
    }

    CalculaData(input) {
        var vencimento = input.slice(input.length-14, input.length-10);
        var venc = (vencimento * 24 * 60 * 60 * 1000);
        var dataBoleto = new Date('10/07/1997');

        dataBoleto.setTime(dataBoleto.getTime() + venc);

        var dia = (dataBoleto.getDate() < 10 ? '0'+dataBoleto.getDate() : dataBoleto.getDate());
        var mes = ((dataBoleto.getMonth() + 1) > 9 ? (dataBoleto.getMonth()+1) : ('0' + (dataBoleto.getMonth()+1)));
        var ano = dataBoleto.getFullYear(); 

        var venc_final = (dia +'/'+ mes +'/'+ ano).toString();

        return venc_final;
    }

    CalculaCodBarras(input) {
        if (input.length != 47) {
            return;
        }

        var campo1 = input.substring(0,4);
        var dv = input.substring(input.length - 15, input.length -14);
        var campo2 = input.substring(input.length - 14, input.length);
        var campo3 = input.substring(4,9);
        var campo4 = input.substring(10,20);
        var campo5 = input.substring(21,31);

        

        var codBarras = ''+campo1.toString() +''+ dv.toString() +''+ campo2.toString() +''+ campo3.toString() +''+ campo4.toString() +''+ campo5.toString();
        return codBarras;
    }

    InstituicaoFinanceira(input, callback) {
        if (input.length != 47) {
            return;
        }

        var retorno;
        var instFin = input.slice(0,3);

        var data = fs.readFileSync("./bancos.json", "utf-8");
        
        var json = JSON.parse(data);

        for (let i = 0; i < json.length; i++) {
            const elem = json[i];

            if (elem.code == instFin) {
                return elem.name.toString();
            }
            
        }

        return "Indisponivel";
    }
}