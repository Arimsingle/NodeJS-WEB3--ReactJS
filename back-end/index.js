const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const cors = require('cors');
const app = express();
const web3 = require('./web3');
const { abi, Contract_address } = require('./abi')
const contract = new web3.eth.Contract(abi, Contract_address);
app.use(cors());
const account = "0x579Fbd470fd5485aBB4d211E8195F4Adb4Bc8057";

let FunctionCoin = {
    'totalSupply': 'totalSupply()',
    'balanceOf': 'balanceOf(adress tokenOwner)',
    'transfer': 'transfer(adress receiver,adress numTokens)',
    'approve': 'approve(adress delegate,uint numTokens)',
    'allowance': 'allowance(adress owner,adress delegate)',
    'transferFrom': 'transferFrom(adress from, adress to,uint tokens)',
};

let name = "";
let symbol = "";
let balances = 0;
let allowed = 0;
let total = 0;
let bool = false;

async function getName() {
    const _name = await contract.methods.name().call();
    name = _name;
}

async function getSymbol() {
    const _symbol = await contract.methods.symbol().call();
    symbol = _symbol;
}

async function totalSupply() {
    const _totalSupply = await contract.methods.totalSupply().call();
    total = _totalSupply;
}

async function balanceOf(tokenOwner) {
    const gas = await contract.methods.balanceOf(tokenOwner).estimateGas();
    await contract.methods.balanceOf(tokenOwner).send({ from: account, gas: gas });
    const balance = await contract.methods.balanceOf(tokenOwner).call();
    balances = balance;
}

async function transfer(receiver, numTokens) {
    const gas = await contract.methods.transfer(receiver, numTokens).estimateGas();
    await contract.methods.transfer(receiver, numTokens).send({ from: account, gas: gas });
    const _bool = await contract.methods.transfer(receiver, numTokens).call();
    bool = _bool;
}

async function approve(delegate, numTokens) {
    const gas = await contract.methods.approve(delegate, numTokens).estimateGas();
    await contract.methods.approve(delegate, numTokens).send({ from: account, gas: gas });
    const _bool = await contract.methods.approve(delegate, numTokens).call();
    bool = _bool;
}

async function allowance(owner, delegate) {
    const gas = await contract.methods.allowance(owner, delegate).estimateGas();
    await contract.methods.allowance(owner, delegate).send({ from: owner, gas: gas });
    const allowance = await contract.methods.allowance(owner, delegate).call();
    allowed = allowance;

}

async function transferFrom(from, to, tokens) {
    const gas = await contract.methods.allowance(from, to, tokens).estimateGas();
    await contract.methods.allowance(from, to, tokens).send({ from: account, gas: gas });
    const transferFrom = await contract.methods.allowance(from, to, tokens).call();
    bool = transferFrom;
}

app.use('/api', bodyParser.json(), router);
app.use('/api', bodyParser.urlencoded({ extended: false }), router);

router.route('/FunctionCoin')
    .get((req, res) => {
        res.json({ FunctionCoin: FunctionCoin });
    });

router.route('/name')
    .get((req, res) => {
        getName();
        res.json({ name: name });
    });
router.route('/symbol')
    .get((req, res) => {
        getSymbol();
        res.json({ symbol: symbol });
    });

router.route('/totalSupply')
    .get((req, res) => {
        totalSupply();
        res.json({ totalSupply: total });
    })

router.route('/balanceOf')
    .get((req, res) => {
        res.json({ balances: balances });
    })
    .put((req, res) => {
        balanceOf(req.body.tokenOwner);
        res.json({ message: 'balanceOf Update!' })
    })

router.route('/transfer')
    .get((req, res) => {
        res.json({ status: bool });
    })
    .put((req, res) => {
        transfer(req.body.receiver, req.body.numTokens)
        res.json({ message: 'transfer Success!' })
    })

router.route('/approve')
    .get((req, res) => {
        res.json({ status: bool });
    })
    .put((req, res) => {
        approve(req.body.delegate, req.body.numTokens)
        res.json({ message: 'approve Success!' })
    })

router.route('/allowance')
    .get((req, res) => {
        res.json({ allowed: allowed });
    })
    .put((req, res) => {
        allowance(req.body.owner, req.body.delegate)
        res.json({ message: 'allowance Success!' })
    })

router.route('/transferFrom')
    .get((req, res) => {
        res.json({ status: bool });
    })
    .put((req, res) => {
        transferFrom(req.body.from, req.body.to, req.body.tokens)
        res.json({ message: 'Games Update!' })
    })

app.use("*", (req, res) => res.status(404).send('404 Not found'));
app.listen(8000, () => console.log("Server is running"));







