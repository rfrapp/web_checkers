
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

Board.prototype.make_move = function(assocs, r0, c0, r1, c1)
{
	var type = "";
	var a0 = assocs[rcstr(r0, c0)];
    a0.tile = this.arr[r1][c1];

    delete assocs[rcstr(r0, c0)];
    assocs[rcstr(r1, c1)] = a0;

    // move was a jump
    if (Math.abs(r1 - r0) == 2 && Math.abs(c1 - c0) == 2)
    {
    	var mr = (r1 + r0) / 2, mc = (c1 + c0) / 2;
    	delete assocs[rcstr(mr, mc)];
    	type = "jump";
    }
	else    
		type = "move";

	// king a piece
	if ((assocs[rcstr(r1, c1)].piece.value == "B" && 
			assocs[rcstr(r1, c1)].tile.row == this.rows - 1) ||
		(assocs[rcstr(r1, c1)].piece.value == "R" && 
				assocs[rcstr(r1, c1)].tile.row == 0))
	{
		assocs[rcstr(r1, c1)].piece.king();
	}

	return type;
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

