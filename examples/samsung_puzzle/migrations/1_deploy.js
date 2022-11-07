const Puzzle = artifacts.require('Puzzle');

module.exports = function (deployer) {
  deployer.deploy(Puzzle);
};
