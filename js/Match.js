
var Match = function(player1_ip, player2_ip)
{
	this.game = new CheckersGame();
	this.board = new Board(BOARD_ROWS, BOARD_COLS, 
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

	// console.log(this.game.possible_moves(this.board, this.piece_tile_assocs, this.game.turn_values[this.turn]));
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
		if (pos == this.pos0) return; 

		this.pos1 = pos;

		console.log("(" + this.pos0.r + ", " + this.pos0.c + ")" + " " +
					"(" + this.pos1.r + ", " + this.pos1.c + ")")

		var move = this.game.can_move(this.board, this.piece_tile_assocs, this.pos0.r, this.pos0.c, this.pos1.r, this.pos1.c, 
				   					  this.game.turn_values[this.turn]);
		
		// if requested move is valid
		if (move[0])
		{
			// retreive a copy of the board 
			this.board = owl.deepCopy(move[1]);
			this.piece_tile_assocs = owl.deepCopy(move[2]);

			// switch the turn 
			this.turn = (this.turn == 1) ? 0 : 1;
		}

		this.state = 0;
	}
}
