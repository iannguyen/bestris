(function() {
  'use strict';
  if (typeof Tetris === "undefined") {
    window.Tetris = {};
  }

  var Board = window.Tetris.Board = function() {
    this.grid = this.initBoard();
  };

  Board.prototype.initBoard = function() {
    var grid = [];
    for (var x = 0; x < ROWS; x++) {
      grid[x] = [];
      for (var y = 0; y < COLUMNS; y++) {
        grid[x].push(0);
      }
    }
    return grid;
  };

  Board.prototype.validMove = function(x, y, state) {
    var valid = true;
    var newxpos = x;
    var newypos = y;

    var width = currentPiece.states[state].length;
    for (var i = 0; i < width; i++) {
      var height = currentPiece.states[state][i].length;
      for (var j = 0; j < height; j++) {
        if (newxpos < 0 || newxpos >= COLUMNS) {
          valid = false;
          i = width;
          j = height;
        }
        if (this.grid[newypos] !== undefined &&
          this.grid[newypos][newxpos] !== 0 &&
          currentPiece.states[state][i] !== undefined && currentPiece.states[state][i][j] !== 0) {
          valid = false;
          i = width;
          j = height;
        }
        newxpos += 1;
      }
      newxpos = x;
      newypos += 1;

      if (newypos > ROWS) {
        valid = false;
        i = width;
      }
    }
    return valid;
  };

  Board.prototype.placePiece = function(piece) {
    var x = piece.gridx;
    var y = piece.gridy;
    var state = piece.currentState;

    var width = piece.states[state].length;
    for (var r = 0; r < width; r++) {
      var height = piece.states[state][r].length;
      for (var c = 0; c < height; c++) {
        if (piece.states[state][r][c] === 1 && y >= 0) {
          this.grid[y][x] = (piece.color + 1);
        }
        x += 1;
      }
      x = piece.gridx;
      y += 1;
    }

    app.game.board.lineCheck();

    if (piece.gridy < 0) {
      gameOver = true;
    }
  };

  Board.prototype.lineCheck = function() {
    var gridWidth = COLUMNS - 1;
    var gridHeight = ROWS - 1;
    var fullRowCount = 0;

    for (var x = gridHeight; x >= 0; x--) {
      var fullRow = true;
      for (var y = gridWidth; y >= 0; y--) {
        if (this.grid[x][y] === 0) {
          fullRow = false;
        }
      }
      if (fullRow) {
        this.clearLine(x);
        fullRowCount++;
        x++;
      }
      fullRow = true;
    }

    app.game.updateScore(fullRowCount);

    if (fullRowCount === 0) {
      $("#combo").text("");
    } else {
      $("#combo").text(fullRowCount + " x COMBO!!!");
    }
  };

  Board.prototype.clearLine = function(rowNumber) {
    var gridWidth = COLUMNS - 1;
    var rowLine = rowNumber;

    while (rowLine > 0) {
      for (var y = gridWidth; y >= 0; y--) {
        this.grid[rowLine][y] = this.grid[rowLine - 1][y];
      }
      rowLine -= 1;
    }
  };
}());
