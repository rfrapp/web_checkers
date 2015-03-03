
var Match = function(x, y, w, h, canvas_element, player1_ip, player2_ip)
{
	this.game = new CheckersGame();
	this.board = new Board(this, BOARD_ROWS, BOARD_COLS, 
	                       this.game.turn_values, null);
	this.board.init();
	this.piece_tile_assocs = [];

	var turn_chars = this.game.turn_values;

	this.simple_init_state = [
	  [turn_chars[0], ' ', turn_chars[0], ' ', turn_chars[0], ' ', turn_chars[0], ' '],
	  [' ', turn_chars[0], ' ', turn_chars[0], ' ', turn_chars[0], ' ', turn_chars[0]],
	  [turn_chars[0], ' ', turn_chars[0], ' ', turn_chars[0], ' ', turn_chars[0], ' '],

	  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],

	  [' ', turn_chars[1], ' ', turn_chars[1], ' ', turn_chars[1], ' ', turn_chars[1]],
	  [turn_chars[1], ' ', turn_chars[1], ' ', turn_chars[1], ' ', turn_chars[1], ' '],
	  [' ', turn_chars[1], ' ', turn_chars[1], ' ', turn_chars[1], ' ', turn_chars[1]],
	];

	this.turn = 1;
	this.view = new CheckersView(this, x, y, w, h, canvas_element);

	// 0 = no piece selected
	// 1 = piece selected
	this.state = 0;
	this.pos0 = null;
	this.pos1 = null;

	this.init();
};

Match.prototype.is_piece_on_tile = function(tile, turn)
{
	for (i = 0; i < this.piece_tile_assocs.length; i++)
	{
		if (this.piece_tile_assocs[i].tile == tile && 
			this.piece_tile_assocs[i].piece.value == turn)
		{
			return true; 
		}
	}
	return false;
};

Match.prototype.get_assoc_for_tile = function(tile)
{
	for (k = 0; k < this.piece_tile_assocs.length; k++)
	{
		if (this.piece_tile_assocs[k].tile == tile)
			return this.piece_tile_assocs[k];
	}
}

Match.prototype.init = function()
{
	// Place the pieces in their initial positions 
	for (i = 0; i < this.board.rows; i++)
	{
		for (j = 0; j < this.board.cols; j++)
		{
			if (this.simple_init_state[i][j] != ' ')
			{
				var p = new CheckersPiece(this.simple_init_state[i][j]);
				var t = this.board.arr[i][j];
				this.piece_tile_assocs.push(new PieceTileAssociation(p, t));
			}
		}
	}
};

Match.prototype.get_notification = function(pos)
{
	if (this.state == 0)
	{
		this.pos0 = pos;
		this.state = 1;
	}
	else
	{
		this.pos1 = pos;

		console.log("(" + this.pos0.r + ", " + this.pos0.c + ")" + " " +
					"(" + this.pos1.r + ", " + this.pos1.c + ")")

		var move = this.game.can_move(this.board, this.piece_tile_assocs, this.pos0.r, this.pos0.c, this.pos1.r, this.pos1.c, 
				   					  this.game.turn_values[this.turn]);
		// if requested move is valid
		if (move[0])
		{
			// get the association for the clicked tile
			var a = this.get_assoc_for_tile(this.board.arr[this.pos0.r][this.pos0.c]);

			// Move source piece to destination 
			a.tile = this.board.arr[this.pos1.r][this.pos1.c];
			
			// The move was a jump
			if (move[1] == "jump")
			{
				var r = (this.pos0.r + this.pos1.r) / 2;
				var c = (this.pos0.c + this.pos1.c) / 2;
				var tile = this.board.arr[r][c];
				var a = this.get_assoc_for_tile(tile);
				this.piece_tile_assocs.remove(a);
			}

			// switch the turn 
			this.turn = (this.turn == 1) ? 0 : 1;
		}

		this.state = 0;
	}
}

Match.prototype.play = function()
{
	this.view.draw();
}
