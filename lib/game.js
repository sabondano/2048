const Board = require('./board');
const _ = require('lodash');

function Game () {
  this.score = 0;
  this.board = new Board(this);

  this.board.addTwoTiles();
}

Game.prototype.updateScore = function (points) {
  this.score += points;
};

Game.prototype.isGameWon = function () {
  var tiles = this.collectAllTiles();
  var has2048 =  _.find(tiles, function (tile) {
    return tile.value === 2048;
  });

  return has2048 ? true : false;
};

Game.prototype.isGameOver = function () {
  return !this.board.checkForPossibleCombinations();
};

Game.prototype.collectAllTiles = function () {
  return this.board.collectAllTiles();
};

module.exports = Game;
