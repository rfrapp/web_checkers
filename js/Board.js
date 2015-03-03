
// row = int 
// col = int 
// turn_chars = Array(chars)
var Board = function(match, rows, cols, turn_chars)
{
  this.match = match; 
  this.rows = rows;
  this.cols = cols;
  this.arr = [];
  this.turn_index = 0;
  this.turn_chars = turn_chars;

  // this.simple_init_state = [
  //   [turn_chars[0], ' ', turn_chars[0], ' ', turn_chars[0], ' ', turn_chars[0], ' '],
  //   [' ', turn_chars[0], ' ', turn_chars[0], ' ', turn_chars[0], ' ', turn_chars[0]],
  //   [turn_chars[0], ' ', turn_chars[0], ' ', turn_chars[0], ' ', turn_chars[0], ' '],

  //   [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  //   [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],

  //   [' ', turn_chars[1], ' ', turn_chars[1], ' ', turn_chars[1], ' ', turn_chars[1]],
  //   [turn_chars[1], ' ', turn_chars[1], ' ', turn_chars[1], ' ', turn_chars[1], ' '],
  //   [' ', turn_chars[1], ' ', turn_chars[1], ' ', turn_chars[1], ' ', turn_chars[1]],
  // ];
};

Board.prototype.init = function()
{
	var rows = [];
	for (i = 0; i < this.rows; i++)
	{
	  var row = [];
	  for (j = 0; j < this.cols; j++)
	  {
	    var t = new Tile(this, i, j);
	    // var p = new CheckersPiece(t, this.simple_init_state[i][j]);
	
	    // if (this.simple_init_state[i][j] != ' ')
	    //   t.add_piece(p);
	
	    row.push(t);
	  }
	  rows.push(row);
	}
	
	this.arr = rows;
};

