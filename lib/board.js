const Tile = require('./tile');
const _ = require('lodash');

function Board(game) {

  this.spaces = [[null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null]];

  this.previousFreeSpaces = [];

  this.game = game;

}

Board.prototype.freeSpaces = function () {
  var freeSpaces = [];

  this.spaces.forEach(function (row, rowIndex) {

    row.forEach(function (space, columnIndex) {
      if (space === null) {

        freeSpaces.push([rowIndex, columnIndex]);
      }
    });
  });
  return freeSpaces;
};

Board.prototype.addTile = function () {
  var possibleValues = [2, 4];
  var tile = new Tile(null, this);
  var freeSpaces = this.freeSpaces();
  var randomFreeSpace = freeSpaces[Math.floor(Math.random() * freeSpaces.length)];

  tile.position = randomFreeSpace;
  tile.value = possibleValues[Math.floor(Math.random() * possibleValues.length)];

  this.insertTile(tile);
  return tile;
};

Board.prototype.insertTile = function (tile) {
  var rowIndex = tile.position[0];
  var columnIndex = tile.position[1];
  this.spaces[rowIndex][columnIndex] = tile;
};

Board.prototype.addTwoTiles = function () {
  this.addTile();
  this.addTile();
};

Board.prototype.clearAllTiles = function () {
  this.spaces = [[null, null, null, null],
  [null, null, null, null],
  [null, null, null, null],
  [null, null, null, null]];
};

Board.prototype.insertTileAt = function (position, tile) {
  var rowIndex = position[0];
  var columnIndex = position[1];
  tile.position = position;
  this.spaces[rowIndex][columnIndex] = tile;
};

Board.prototype.checkSpaceAt = function (rowIndex, columnIndex) {
  var positionValidity = this.isPositionValid(rowIndex, columnIndex);
  if (positionValidity) {
    return this.spaces[rowIndex][columnIndex];
  } else {
    return "No space found.";
  }
};

Board.prototype.isPositionValid = function (rowIndex, columnIndex) {
  return this.isRowValid(rowIndex) && this.isColumnValid(columnIndex);
};

Board.prototype.isRowValid = function (rowIndex) {
  var height = this.spaces.length;

  return (rowIndex >= 0) && (rowIndex < height);
};

Board.prototype.isColumnValid = function (columnIndex) {
  var width = this.spaces[0].length;

  return (columnIndex >= 0) && (columnIndex < width);
};

Board.prototype.shiftLeft = function () {
  this.spaces = this.spaces.map(function (row) {
    return row.sort();
  });
  this.updateTilePositions();
};

Board.prototype.updateTilePositions = function () {
  this.spaces.forEach(function (row, rowIndex) {
    row.forEach(function (space, columnIndex) {
      if (space instanceof Tile) {
        space.position = [rowIndex, columnIndex];
      }
    });
  });
};

Board.prototype.moveLeft = function () {
  this.shiftLeft();
  this.collapse();
  this.shiftLeft();
};

Board.prototype.moveRight = function () {
  this.reverseSpaces();
  this.moveLeft();
  this.reverseSpaces();
  this.updateTilePositions();
};

Board.prototype.moveUp = function () {
  this.spaces = this.transpose(this.spaces);
  this.moveLeft();
  this.spaces = this.transpose(this.spaces);
  this.updateTilePositions();
};

Board.prototype.moveDown = function () {
  this.spaces = this.transpose(this.spaces); 
  this.reverseSpaces(); 
  this.moveLeft();
  this.reverseSpaces();  
  this.spaces = this.transpose(this.spaces);
  this.updateTilePositions();
};

Board.prototype.collapse = function () {
  var self = this;

  this.spaces.forEach(function (row, rowIndex) {
    if (row[0] === null) {
      return row;
    } else {
      row.forEach(function (space, columnIndex) {
        if (space === null ||
            self.rightNeighbor(rowIndex, columnIndex) === null ||
            self.rightNeighbor(rowIndex, columnIndex) === "No space found.") {
          return space;
        }
        if (space.value === self.rightNeighbor(rowIndex, columnIndex).value) {
          space.value *= 2;
          self.game.updateScore(space.value);
          self.spaces[rowIndex][columnIndex + 1] = null;
          return space;
        }
      });
    }
  });
};

Board.prototype.rightNeighbor = function (rowIndex, columnIndex) {
  return this.checkSpaceAt(rowIndex, columnIndex + 1);
};

Board.prototype.bottomNeighbor = function (rowIndex, columnIndex) {
  return this.checkSpaceAt(rowIndex + 1, columnIndex);
};

Board.prototype.transpose = function (spaces) {

  // Calculate the width and height of the Array
  var w = spaces.length ? spaces.length : 0,
  h = spaces[0] instanceof Array ? spaces[0].length : 0;

  // In case it is a zero matrix, no transpose routine needed.
  if (h === 0 || w === 0) {
    return [];
  }

  var i, j, transposedData = [];

  // Loop through every item in the outer array (height)
  for (i = 0; i < h; i++) {
    // Insert a new row (array)
    transposedData[i] = [];

    // Loop through every item per item in outer array (width)
    for (j = 0; j < w; j++) {
      // Save transposed data.
      transposedData[i][j] = spaces[j][i];
    }
  }

  return transposedData;
};

Board.prototype.reverseSpaces = function () {
  this.spaces = this.spaces.map(function (row) {
    return row.reverse();
  });
};

Board.prototype.checkForPossibleCombinations = function () {
  let possibleCombinations = this.checkForLeftRightCombinations() ||
    this.checkForUpDownCombinations();
  return possibleCombinations;
};

Board.prototype.checkForLeftRightCombinations = function () {
  let self = this;

  let combinationPossibilities = this.spaces.map(function (row, rowIndex) {
    if (row[0] === null) {
      return true;
    } else {
      return row.map(function (space, columnIndex) {
        if (self.rightNeighbor(rowIndex, columnIndex) === "No space found.") {
          return false;
        }
        if (space === null ||
            self.rightNeighbor(rowIndex, columnIndex) === null ||
            space.value === self.rightNeighbor(rowIndex, columnIndex).value) {
          return true;
        }
      });
    }
  });

  combinationPossibilities = _.flatten(combinationPossibilities);
  return _.includes(combinationPossibilities, true);
};


Board.prototype.checkForUpDownCombinations = function () {
  let self = this;

  let combinationPossibilities = this.spaces.map(function (row, rowIndex) {
    if (row[0] === null) {
      return true;
    } else {
      return row.map(function (space, columnIndex) {
        if (self.bottomNeighbor(rowIndex, columnIndex) === "No space found.") {
          return false;
        }
        if (space === null ||
            self.bottomNeighbor(rowIndex, columnIndex) === null ||
            space.value === self.bottomNeighbor(rowIndex, columnIndex).value) {
          return true;
        }
      });
    }
  });

  combinationPossibilities = _.flatten(combinationPossibilities);
  return _.includes(combinationPossibilities, true);
};

Board.prototype.collectAllTiles = function () {
  var tiles = _.flatten(this.spaces);

  return _.filter(tiles, function (tile) { return tile != null; });
};

module.exports = Board;
