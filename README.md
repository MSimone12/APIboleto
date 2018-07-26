Olá,

Esta API tem um funcionamento bem simples,

para rodá-la é necessário apenas escrever "npm start" no console, lembrando que o diretorio tem que ser o da aplicação,

usando o POSTMAN é só fazer um request com o metódo POST para a url : localhost:4000/api
com o body tendo o campo boleto,
assim, a aplicação retornará um json com: 
{
    "instituição": ...,
    "valor": ...,
    "vencimento": ...,
    "cod": ..., // sendo esse o código de barras
}

feito isso, estamos prontos!