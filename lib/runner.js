const Game = require('./game');
const Renderer = require('./renderer');
const $ = require('jquery');

var gameRenderer = startGame();

function startGame() {
  var game = new Game();
  var renderer = new Renderer(game);

  var target = $('.container');

  renderer.addTilesTo(target);

  return renderer;
}

function detectUserInput() {

  document.onkeydown = function (e) {
    switch (e.keyCode) {
      case 37:
        gameRenderer.game.board.previousFreeSpaces = _.cloneDeep(currentFreeSpaces());
        gameRenderer.game.board.moveLeft();
        syncBoard();
        break;
      case 38:
        gameRenderer.game.board.previousFreeSpaces = _.cloneDeep(currentFreeSpaces());
        gameRenderer.game.board.moveUp();
        syncBoard();
        break;
      case 39:
        gameRenderer.game.board.previousFreeSpaces = _.cloneDeep(currentFreeSpaces());
        gameRenderer.game.board.moveRight();
        syncBoard();
        break;
      case 40:
        gameRenderer.game.board.previousFreeSpaces = _.cloneDeep(currentFreeSpaces());
        gameRenderer.game.board.moveDown();
        syncBoard();
        break;
    }

    document.onkeyup = function (e) {
      if (gameRenderer.game.isGameWon()) {
        alert('You win!');
        stopListeningToUserInput();
      }
      else if (gameRenderer.game.isGameOver()) {
        alert('Game over!');
        stopListeningToUserInput();
      }
    }
  };

}

function syncBoard() {
  var target = $('.container');

  if (freeSpacesChanged()) {
    gameRenderer.clearAllTileClasses(target)
      .addRandomTile()
      .clearAllValues(target)
      .addTilesTo(target);
  } else {
    gameRenderer.clearAllTileClasses(target)
      .clearAllValues(target)
      .addTilesTo(target);
  }
}

function freeSpacesChanged() {

  var spaceComparison = previousFreeSpaces().map(function (position, index) {
    if (currentFreeSpaces()[index][0] == position[0] &&
      currentFreeSpaces()[index][1] == position[1]) {
      return false;
    } else {
      return true;
    }
  });

  if (_.includes(spaceComparison, true)) {
    return true;
  } else {
    return false;
  }
}

function currentFreeSpaces() {
  return gameRenderer.game.board.freeSpaces();
}

function previousFreeSpaces() {
  return gameRenderer.game.board.previousFreeSpaces;
}

function stopListeningToUserInput() {
  document.onkeydown = function () {
  };
}

detectUserInput();
