
// row = int 
// col = int 
// turn_chars = Array(chars)
var Board = function(rows, cols, turn_chars)
{
  this.rows = rows;
  this.cols = cols;
  this.arr = [];
  this.turn_index = 0;
  this.turn_chars = turn_chars;
};

Board.prototype.init = function()
{
	var rows = [];
	for (i = 0; i < this.rows; i++)
	{
	  var row = [];
	  for (j = 0; j < this.cols; j++)
	  {
	    var t = new Tile(i, j);
	
	    row.push(t);
	  }
	  rows.push(row);
	}
	
	this.arr = rows;
};

