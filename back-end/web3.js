const Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:9545');
module.exports = web3;