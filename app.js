const fs = require('fs');

module.exports = class App {
    constructor(){
        
    }

    CalcularDados(input) {

        var inputFinal = input.replace(/[^0-9]/g, "");

        if(inputFinal.length != 47){
            return ({sucesso: false, mensagem: "Boleto não é valido"});
        }
        else
        {
            var verifica = this.VerificaDV(inputFinal);
            console.log(verifica);
            if (verifica) {
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

                return ({sucesso: true, data: json});    
            }else {
                return ({sucesso: false, mensagem: "Digitos não são válidos"});
            }
            
        }

    }

    VerificaDV(input) {
        var fator1 = [2,1,2,1,2,1,2,1,2];
        var fator2 = [1,2,1,2,1,2,1,2,1,2];
        var fator3 = [1,2,1,2,1,2,1,2,1,2];

        var campo1 = input.substring(0,9);
        var campo2 = input.substring(10,20);
        var campo3 = input.substring(21,31);

        var campo11 = campo1.split('');
        var campo21 = campo2.split('');
        var campo31 = campo3.split('');

        var soma1 = 0;
        var soma2 = 0;
        var soma3 = 0;

        for (let i = 0; i < campo11.length; i++) {
            var element = campo11[i];

            if((element * fator1[i]) > 9){
                var mult = (element * fator1[i]).toString();
                var mt = mult.split('');
                soma1 = soma1 + (parseInt(mt[0], '10') + parseInt(mt[1], '10'));                 
            }else{
                soma1 = soma1 + (parseInt(element, '10') * parseInt(fator1[i], '10'));
            }   
        }

        for (let i = 0; i < campo21.length; i++) {
            var element = campo21[i];

            if((element * fator2[i]) > 9){
                var mult = (element * fator2[i]).toString();
                var mt = mult.split('');
                soma2 = soma2 + (parseInt(mt[0], '10') + parseInt(mt[1], '10'));                 
            }else{
                soma2 = soma2 + (parseInt(element, '10') * parseInt(fator2[i], '10'));
            }
        }

        for (let i = 0; i < campo31.length; i++) {
            var element = campo31[i];

            if((element * fator3[i]) > 9){
                var mult = (element * fator3[i]).toString();
                var mt = mult.split('');
                soma3 = soma3 + (parseInt(mt[0], '10') + parseInt(mt[1], '10'));                 
            }else{
                soma3 = soma3 + (parseInt(element, '10') * parseInt(fator3[i], '10'));
            }
        }

        var resto1 = soma1 % 10;
        var resto2 = soma2 % 10;
        var resto3 = soma3 % 10;

        var dv1 = input.substring(9,10);
        var dv2 = input.substring(20,21);
        var dv3 = input.substring(31,32);

        var dv11 = (Math.ceil((soma1 / 10))*10) - resto1;
        var dv21 = (Math.ceil((soma2 / 10))*10) - resto2;
        var dv31 = (Math.ceil((soma3 / 10))*10) - resto3;

        dv11 = dv11.toString().substring(1,2);
        dv21 = dv21.toString().substring(1,2);
        dv31 = dv31.toString().substring(1,2);

        if (dv1 == dv11 && dv2 == dv21 && dv3 == dv31) {
            return true;
        } else {
            return false;
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