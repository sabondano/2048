const assert = require('assert');
const Renderer = require('../lib/renderer');
const Board = require('../lib/board');
const $ = require('jquery');

describe('Renderer', function () {
  it('should exist', function () {
    let renderer = new Renderer();

    assert(renderer);
  });

  it('has a board object', function () {
    let board = new Board();
    let renderer = new Renderer(board);
    
    assert(Board.prototype.isPrototypeOf(renderer.board));
  });

  describe('renderBoard', function () {

    it('should have a renderBoard method', function () {
      let board = new Board();
      let renderer = new Renderer(board);      

      assert(renderer.renderBoard);
    });

    it('should a render with a class of board', function () {
      let board = new Board();
      let renderer = new Renderer(board);      
      let renderedBoard = renderer.renderBoard();

      assert.equal(renderedBoard.length, 1);
      assert.equal(renderedBoard[0].className, 'board');
    });
  });

  describe('renderBoardAndAppendTo', function () {

    beforeEach(function () {
      this.container = $('<div></div>').addClass('container');
    });

    it('should have a renderBoardAndAppendTo', function () {
      let board = new Board();
      let renderer = new Renderer(board);      
      
      assert(renderer.renderBoardAndAppendTo);
    });

    it('should renderBoardAndAppendTo a target', function () {
      let board = new Board();
      let renderer = new Renderer(board);      
      let container = this.container;
      renderer.renderBoardAndAppendTo(container);

      assert.equal(container.find('.board').length, 1);
    });

  });

});