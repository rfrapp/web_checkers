
var Match = function(x, y, w, h, canvas_element, player1_ip, player2_ip)
{
	this.game = new CheckersGame();
	this.board = new Board(this, BOARD_ROWS, BOARD_COLS, 
	                       this.game.turn_values, null);
	this.board.init();
	this.piece_tile_assocs = {};

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
				this.piece_tile_assocs[i.toString() + "," + j.toString()] = new PieceTileAssociation(p, t);
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
			var p0r = this.pos0.r;
			var p0c = this.pos0.c;
			var p1r = this.pos1.r;
			var p1c = this.pos1.c;
			var a = this.piece_tile_assocs[rcstr(p0r, p0c)];
			a.tile = this.board.arr[this.pos1.r][this.pos1.c]

			// Move source piece to destination 
			this.piece_tile_assocs[rcstr(p1r, p1c)] = a;
			
			// Remove the old association 
			delete this.piece_tile_assocs[rcstr(p0r, p0c)];

			// If a piece reached the opponents side
			if (a.tile.row == 0 && a.piece.value == this.game.turn_values[1] ||
				a.tile.row == this.board.arr.length - 1 && 
				a.piece.value == this.game.turn_values[0])
			{
				console.log("kinged");
				a.piece.king();
			}

			// The move was a jump
			if (move[1] == "jump")
			{
				// Get the position of the jumped piece
				var r = (this.pos0.r + this.pos1.r) / 2;
				var c = (this.pos0.c + this.pos1.c) / 2;

				// Remove the association from the dictionary 
				delete this.piece_tile_assocs[r.toString() + "," + c.toString()];
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
