
var Match = function(player1_ip, player2_ip)
{
	this.game  = new CheckersGame();
	this.board = new Board(BOARD_ROWS, BOARD_COLS, 
	                       this.game.turn_values, null);
	this.board.init();
	this.piece_tile_assocs = {};

	var turn_chars = this.game.turn_values;

	this.move_history = [];
	this.possible_moves = [];

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

	// Test init state to show kinging
	this.simple_init_state = [
	  [' ', ' ', ' ', ' ', turn_chars[0], ' ', turn_chars[0], ' '],
	  [' ', turn_chars[1], ' ', turn_chars[0], ' ', turn_chars[0], ' ', turn_chars[0]],
	  [turn_chars[0], ' ', ' ', ' ', ' ', ' ', ' ', ' '],

	  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],

	  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	  [' ', ' ', turn_chars[0], ' ', turn_chars[1], ' ', turn_chars[1], ' '],
	  [' ', turn_chars[1], ' ', ' ', ' ', turn_chars[1], ' ', turn_chars[1]],
	];

	this.turn = 0;

	// 0 = no piece selected
	// 1 = piece selected
	this.state = 0;
	this.pos0 = null;
	this.pos1 = null;

	this.init();
};

Match.prototype.is_possible_src = function(r, c)
{
	var i = 0;
	for (i = 0; i < this.possible_moves.length; i++)
	{
		if (this.possible_moves[i].src.r == r &&
			this.possible_moves[i].src.c == c)
			return true;
	}
	return false;
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

	this.possible_moves = this.game.possible_moves(this.board, this.piece_tile_assocs,
												   this.game.turn_values[this.turn]);
};

Match.prototype.get_notification = function(pos)
{
	if (this.state == 0)
	{
		this.pos0 = pos;
		this.state = 1;
		this.possible_moves = this.game.possible_moves(this.board, this.piece_tile_assocs,
													   this.game.turn_values[this.turn]);
	}
	else if (this.state == 1)
	{
		if (this.piece_tile_assocs[rcstr(pos.r, pos.c)] !== undefined)
		{
			this.pos0 = pos;
			this.state = 1;
			this.possible_moves = this.game.possible_moves(this.board, this.piece_tile_assocs,
														   this.game.turn_values[this.turn]);
			
			console.log("found piece");
			return;
		}

		this.pos1 = pos;

		// console.log("(" + this.pos0.r + ", " + this.pos0.c + ")" + " " +
		// 			"(" + this.pos1.r + ", " + this.pos1.c + ")")

		var move = this.game.is_valid_move(this.board, this.piece_tile_assocs, this.pos0.r, this.pos0.c, this.pos1.r, this.pos1.c, 
				   					  	   this.game.turn_values[this.turn], true);
		
		// if requested move is valid
		if (move)
		{
			// tell board to make the move
			var m = this.board.make_move(this.piece_tile_assocs, this.pos0.r, this.pos0.c,
								 		 this.pos1.r, this.pos1.c);

			// record move sequence 
			this.move_history.push({ src: { r: this.pos0.r, c: this.pos0.c }, 
									 dst: { r: this.pos1.r, c: this.pos1.c } });
		
			var pjumps = this.game.possible_jumps(this.board, 
										 this.piece_tile_assocs, 
										 this.game.turn_values[this.turn]);

			console.log(m);

			if (m == "jump")
			{
				console.log("jump made");
				if (pjumps.length == 0)
				{
					console.log("switched turn");
					// switch the turn
					this.turn = (this.turn == 1) ? 0 : 1;
				}
				else 
				{
					var filtered = pjumps;
					var i = 0;

					for (i = 0; i < pjumps.length; i++)
					{
						if (pjumps[i].src != this.pos1)
							filtered.remove(filtered[i]);
					}

					this.possible_moves = filtered;
				}
			}
			else if (m == "move")
			{
				// switch the turn
				this.turn = (this.turn == 1) ? 0 : 1;
			}
		}

		this.state = 0;
	}
}
