
var CheckersGame = function()
{
  // Initialize the super class 
  Game.call(this);

  this.turn_values = ["B", "R"];
};

CheckersGame.prototype.other_turn_char = function(turn_char)
{
    var t_index = this.turn_values.indexOf(turn_char);

    if (t_index == 0) return this.turn_values[1];
    else return this.turn_values[0]; 
};

CheckersGame.prototype.tile_piece_value = function(tile, assocs, turn)
{
    for (i = 0; i < assocs.length; i++)
    {
        if (assocs[i].tile == tile)
        {
            return assocs[i].piece.value;
        }
    }
    return false;
};

CheckersGame.prototype.is_jump = function(board, assocs, r0, c0, r1, c1, turn)
{
    var tile0 = board.arr[r0][c0];
    var tile1 = board.arr[r1][c1];
    var is_jump = false; 
    var t0value = this.tile_piece_value(tile0, assocs, turn);

    // Not a jump 
    if (Math.abs(r1 - r0) != 2)
        return false;

    // Check if piece is the one on the top of
    // the board. If so, the difference between 
    // r1 and r0 should be 2
    if (t0value == this.turn_values[0])
    {
        var c = (c1 + c0) / 2, r = (r1 + r0) / 2;
        var middle_tile = board.arr[r][c];
        var middle_val = this.tile_piece_value(middle_tile, assocs, turn);

        is_jump = (r1 - r0 == 2 || (r1 - r0 == -2 && tile0.piece.is_king())) &&
                  (Math.abs(c1 - c0) == 2) && middle_val == this.other_turn_char(turn) &&
                   !this.tile_piece_value(tile1, assocs, turn);
    }
    else if (t0value == this.turn_values[1])
    {
        var c = (c1 + c0) / 2, r = (r1 + r0) / 2;
        var middle_tile = board.arr[r][c];
        var middle_val = this.tile_piece_value(middle_tile, assocs, turn);

        is_jump = (r1 - r0 == -2 || (r1 - r0 == 2 && tile0.piece.is_king())) &&
                  (Math.abs(c1 - c0) == 2) && middle_val == this.other_turn_char(turn) &&
                  !this.tile_piece_value(tile1, assocs, turn);
    }

    return is_jump; 
};

CheckersGame.prototype.is_move = function(board, assocs, r0, c0, r1, c1, turn)
{
    var tile0 = board.arr[r0][c0];
    var tile1 = board.arr[r1][c1];
    var is_move = false;
    var t0value = this.tile_piece_value(tile0, assocs, turn);

    // Check if piece is the one on the top of
    // the board. If so, the difference between 
    // r1 and r0 should be 1
    if (t0value == this.turn_values[0])
    {
        is_move = (r1 - r0 == 1 || (r1 - r0 == -1 && tile0.piece.is_king())) && 
                  (Math.abs(c1 - c0) == 1) && (!this.tile_piece_value(tile1, assocs, turn));
    }
    else if (t0value == this.turn_values[1])
    {
        is_move = (r1 - r0 == -1 || (r1 - r0 == 1 && tile0.piece.is_king())) && 
                  (Math.abs(c1 - c0) == 1) &&
                  (!this.tile_piece_value(tile1, assocs, turn));
    }

    return is_move; 
};

// Validates whether or not moving the piece
// in the tile at (r0, c0) to the tile at 
// (r1, c1) can be done
CheckersGame.prototype.can_move = function(board, assocs, r0, c0, r1, c1, turn)
{
    var tile0 = board.arr[r0][c0];
    var tile1 = board.arr[r1][c1];
    var tile0_pass = false;
    var tile1_pass = false;
    
    tile0_pass = this.tile_piece_value(tile0, assocs, turn) == turn;
    
    var is_move = this.is_move(board, assocs, r0, c0, r1, c1, turn);
    var is_jump = this.is_jump(board, assocs, r0, c0, r1, c1, turn);
    
    tile1_pass = is_move || is_jump;

    if (is_jump)
        var ret = [tile0_pass && tile1_pass, "jump"];
    else if (is_move)
        var ret = [tile0_pass && tile1_pass, "move"];
    else 
        ret = [false, ""];

    return ret;
};


