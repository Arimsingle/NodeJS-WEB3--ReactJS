const Migrations = artifacts.require("Migrations");
const H_Coin = artifacts.require("H_Coin");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(H_Coin);
};
