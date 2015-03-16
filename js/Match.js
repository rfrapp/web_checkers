
var Match = function(player1_ip, player2_ip)
{
	this.game  = new CheckersGame();
	this.board = new Board(BOARD_ROWS, BOARD_COLS, 
	                       this.game.turn_values, null);
	this.board.init();
	this.piece_tile_assocs = {};

	this.game_over = false;
	this.winner = 0;

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

	// test move history: shows branching double jump choice
	// (2,0) -> (3,1)
	// (7,1) -> (5,3)
	// (3,1) -> (4,0)
	// (5,3) -> (4,4)
	// (4,0) -> (5,1)
	// (6,4) -> (5,3)
	// (5,1) -> (6,2)
	// (5,3) -> (4,2)
	// (6,2) -> (7,3)
	// (1,1) -> (0,2)
	// (7,3) -> (6,4)
	// (7,5) -> (5,3)
	// (0,2) -> (2,4)
	// (1,5) -> (3,3)
	// (3,3) -> (5,1)
	// (5,3) -> (4,2)
	// (5,1) -> (6,2)
	// (4,4) -> (3,3)
	// (6,2) -> (7,3)
	// (4,2) -> (3,1)

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

Match.prototype.is_over = function()
{
	var p1count = 0, p2count = 0;

	for (key in this.piece_tile_assocs)
	{
		if (this.piece_tile_assocs.hasOwnProperty(key))
		{
			if (this.piece_tile_assocs[key].piece.value == this.game.turn_values[0])
				p1count++;
			else if (this.piece_tile_assocs[key].piece.value == this.game.turn_values[1])
				p2count++;
		}
	}

	console.log("p1: " + p1count.toString());
	console.log("p2: " + p2count.toString());

	return p1count == 0 || p2count == 0;
};

Match.prototype.get_notification = function(pos)
{
	if (this.game_over)
		return;

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
			
			// console.log("found piece");
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

			// console.log(m);

			if (m == "jump")
			{
				console.log("jump made");
				if (pjumps.length == 0)
				{
					console.log("switched turn");
					
					this.game_over = this.is_over();

					if (this.game_over)
						this.winner = this.game.turn_values[this.turn];

					// switch the turn
					this.turn = (this.turn == 1) ? 0 : 1;
				}
				else 
				{
					var filtered = pjumps;
					var i = 0;

					for (i = 0; i < pjumps.length; i++)
					{
						if (pjumps[i].src.r != this.pos1.r && 
							pjumps[i].src.c != this.pos1.c)
						{
							console.log("removing...");
							console.log(pjumps[i].src);
							console.log(this.pos1);
							filtered.remove(filtered[i]);
						}
					}

					this.possible_moves = filtered;

					if (this.possible_moves.length == 0)
					{
						console.log("turn switched after jump");
						this.turn = (this.turn == 1) ? 0 : 1; 
					}
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
