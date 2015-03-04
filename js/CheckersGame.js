
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

CheckersGame.prototype.tile_piece = function(tile, assocs, turn)
{
    for (i = 0; i < assocs.length; i++)
    {
        if (assocs[i].tile == tile)
        {
            return assocs[i].piece;
        }
    }
    return false;
};

CheckersGame.prototype.is_jump = function(board, assocs, r0, c0, r1, c1, turn)
{
    var tile0 = board.arr[r0][c0];
    var tile1 = board.arr[r1][c1];
    var is_jump = false; 
    var a = assocs[r0.toString() + "," + c0.toString()];
    var a1 = assocs[r1.toString() + "," + c1.toString()];

    // No piece on source tile 
    if (!a.piece) return false;

    // Not a jump 
    if (Math.abs(r1 - r0) != 2)
        return false;

    // Check if piece is the one on the top of
    // the board. If so, the difference between 
    // r1 and r0 should be 2
    if (a.piece.value == this.turn_values[0])
    {
        var c = (c1 + c0) / 2, r = (r1 + r0) / 2;
        var middle_tile = board.arr[r][c];
        var middle_val = assocs[r.toString() + "," + c.toString()].piece.value;

        is_jump = (r1 - r0 == 2 || (r1 - r0 == -2 && piece.is_king)) &&
                  (Math.abs(c1 - c0) == 2) && middle_val == this.other_turn_char(turn) && !a1;
    }
    else if (a.piece.value == this.turn_values[1])
    {
        var c = (c1 + c0) / 2, r = (r1 + r0) / 2;
        var middle_tile = board.arr[r][c];
        var middle_val = assocs[r.toString() + "," + c.toString()].piece.value;

        is_jump = (r1 - r0 == -2 || (r1 - r0 == 2 && piece.is_king)) &&
                  (Math.abs(c1 - c0) == 2) && middle_val == this.other_turn_char(turn) && !a1;
    }

    return is_jump; 
};

CheckersGame.prototype.is_move = function(board, assocs, r0, c0, r1, c1, turn)
{
    var tile0 = board.arr[r0][c0];
    var tile1 = board.arr[r1][c1];
    var is_move = false;
    var a = assocs[rcstr(r0, c0)];
    var a1 = assocs[rcstr(r1, c1)];

    // Check if piece is the one on the top of
    // the board. If so, the difference between 
    // r1 and r0 should be 1
    if (a.piece.value == this.turn_values[0])
    {
        is_move = (r1 - r0 == 1 || (r1 - r0 == -1 && a.piece.is_king)) && 
                  (Math.abs(c1 - c0) == 1) && !a1;
    }
    else if (a.piece.value == this.turn_values[1])
    {
        is_move = (r1 - r0 == -1 || (r1 - r0 == 1 && a.piece.is_king)) && 
                  (Math.abs(c1 - c0) == 1) && !a1;
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
    
    tile0_pass = assocs[r0.toString() + "," + c0.toString()].piece.value == turn;
    
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


