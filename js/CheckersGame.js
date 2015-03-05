
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

// 
// Check for Jump logic
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

        // no middle tile association existed 
        if (!assocs[rcstr(r, c)]) return false;

        var middle_val = assocs[r.toString() + "," + c.toString()].piece.value;

        is_jump = (r1 - r0 == 2 || (r1 - r0 == -2 && piece.is_king)) &&
                  (Math.abs(c1 - c0) == 2) && middle_val == this.other_turn_char(turn) && !a1;
    }
    else if (a.piece.value == this.turn_values[1])
    {
        var c = (c1 + c0) / 2, r = (r1 + r0) / 2;
        var middle_tile = board.arr[r][c];

        if (!assocs[rcstr(r, c)]) return false;

        var middle_val = assocs[rcstr(r, c)].piece.value;

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

CheckersGame.prototype.move_piece = function(board, assocs, r0, c0, r1, c1)
{
    var a0 = assocs[rcstr(r0, c0)];
    a0.tile = board.arr[r1][c1];

    delete assocs[rcstr(r0, c0)];
    assocs[rcstr(r1, c1)] = a0;
};

CheckersGame.prototype.remove_piece = function(board, assocs, r, c)
{
    delete assocs[rcstr(r, c)];
};

CheckersGame.prototype.possible_jumps = function(board, assocs, turn)
{
    var possible_moves = [];

    for (key in assocs)
    {
        if (assocs.hasOwnProperty(key) && assocs[key].tile &&
            assocs[key].piece.value == turn)
        {
            var t = assocs[key].tile;
            var rdiff = (assocs[key].piece.value == this.turn_values[1]) ? -2 : 2;
            var r = t.row + rdiff;
            var c0 = t.col - 2;
            var c1 = t.col + 2;

            if (this.can_move(board, assocs, t.row, t.col, r, c0, turn, false)[0])
                possible_moves.push({ src: {r: t.row, c: t.col}, dst: {r: r, c: c0}});

            if (this.can_move(board, assocs, t.row, t.col, r, c1, turn, false)[0])
                possible_moves.push({ src: {r: t.row, c: t.col}, dst: {r: r, c: c1}});

            if (assocs[key].piece.is_king)
            {
                r = t.row - rdiff;

                if (this.can_move(board, assocs, t.row, t.col, r, c0, turn, false)[0])
                    possible_moves.push({ src: {r: t.row, c: t.col}, dst: {r: r, c: c0}});

                if (this.can_move(board, assocs, t.row, t.col, r, c1, turn, false)[0])
                    possible_moves.push({ src: {r: t.row, c: t.col}, dst: {r: r, c: c1}});                
            }
        }
    }

    return possible_moves;
};

CheckersGame.prototype.possible_forward_moves = function(board, assocs, turn)
{
    var possible_moves = [];

    // Get moves that are not jumps
    for (key in assocs)
    {
        if (assocs.hasOwnProperty(key) && assocs[key].tile
            && assocs[key] !== null)
        {
            var t = assocs[key].tile;
            var rdiff = (assocs[key].piece.value == this.turn_values[1]) ? -1 : 1;
            var r = t.row + rdiff;
            var c0 = t.col - 1;
            var c1 = t.col + 1;

            if (this.can_move(board, assocs, t.row, t.col, r, c0, turn, false)[0])
                possible_moves.push({ src: {r: t.row, c: t.col}, dst: {r: r, c: c0}});

            if (this.can_move(board, assocs, t.row, t.col, r, c1, turn, false)[0])
                possible_moves.push({ src: {r: t.row, c: t.col}, dst: {r: r, c: c1}});

            if (assocs[key].piece.is_king)
            {
                r = t.row - rdiff;

                if (this.can_move(board, assocs, t.row, t.col, r, c0, turn, false)[0])
                    possible_moves.push({ src: {r: t.row, c: t.col}, dst: {r: r, c: c0}});

                if (this.can_move(board, assocs, t.row, t.col, r, c1, turn, false)[0])
                    possible_moves.push({ src: {r: t.row, c: t.col}, dst: {r: r, c: c1}});                
            }
        }
    }

    return possible_moves;
};

CheckersGame.prototype.possible_moves = function(board, assocs, turn)
{
    var possible_moves = {};

    possible_moves.jumps = this.possible_jumps(board, assocs, turn);
    possible_moves.forward = this.possible_forward_moves(board, assocs, turn);

    return possible_moves;
};

CheckersGame.prototype.enforce_jumps = function(board, assocs, turn, switch_turn)
{
    var jumps = this.possible_jumps(board, assocs, turn);
    var i = 0;

    console.log("jumps: ");
    console.log(jumps);

    // 1 jump available, force it to happen
    if (jumps.length == 1)
    {
        console.log(jumps[0]);
        var from = jumps[0].src, to = jumps[0].dst;
        this.move_piece(board, assocs, from.r, from.c, to.r, to.c);
        this.remove_piece(board, assocs, (from.r + to.r) / 2, (from.c + to.c) / 2);

        // swap turn
        // console.log('move forced');
    }
    else if (switch_turn)
    {
        // console.log("turn was " + turn);
        turn = (turn == this.turn_values[0]) ? this.turn_values[1] : this.turn_values[0];
        // console.log("turn is now " + turn);
    }

    return turn;
};

// Validates whether or not moving the piece
// in the tile at (r0, c0) to the tile at 
// (r1, c1) can be done
CheckersGame.prototype.can_move = function(board, assocs, r0, c0, r1, c1, turn, enforce)
{

    // check if input is correct
    if (r0 < 0 || r0 >= board.rows) return [false, ""];
    else if (c0 < 0 || c0 >= board.cols) return [false, ""];

    if (r1 < 0 || r1 >= board.rows) return [false, ""];
    else if (c1 < 0 || c1 >= board.cols) return [false, ""];

    var new_board = (owl.deepCopy(board));
    var new_assocs = (owl.deepCopy(assocs));
    var tile0 = board.arr[r0][c0];
    var tile1 = board.arr[r1][c1];
    var tile0_pass = false;
    var tile1_pass = false;

    tile0_pass = assocs[rcstr(r0, c0)].piece.value == turn;
    
    var is_move = this.is_move(board, assocs, r0, c0, r1, c1, turn);
    var is_jump = this.is_jump(board, assocs, r0, c0, r1, c1, turn);
    
    tile1_pass = is_move || is_jump;

    if (is_jump)
    {
        // get r,c for piece to remove
        var mr = (r0 + r1) / 2, mc = (c0 + c1) / 2;
        
        // move turn piece
        this.move_piece(new_board, new_assocs, r0, c0, r1, c1);
        
        // remove jumped piece
        this.remove_piece(new_board, new_assocs, mr, mc);
        
        if (enforce)
        {
            // enforce double/triple/etc jumps 
            turn = this.enforce_jumps(new_board, new_assocs, turn, false);

            // switch turn
            turn = (turn == this.turn_values[0]) ? this.turn_values[1] : this.turn_values[0];

            // enforce jump 
            turn = this.enforce_jumps(new_board, new_assocs, turn, true);
        }

        var ret = [true, new_board, new_assocs, turn];
    }
    else if (is_move)
    {
        this.move_piece(new_board, new_assocs, r0, c0, r1, c1);

        if (enforce)
        {
            // switch turn
            turn = (turn == this.turn_values[0]) ? this.turn_values[1] : this.turn_values[0];

            // console.log("checking jumps for " + turn);

            // enforce jump 
            turn = this.enforce_jumps(new_board, new_assocs, turn, true);
        }

        var ret = [true, new_board, new_assocs, turn];
    }
    else 
        var ret = [false, "", turn];

    // check to king a piece 
    if (tile1_pass)
    {
        var a = new_assocs[rcstr(r1, c1)];
        // console.log("a:" + a);
        if (a !== undefined)
        {
            // If a piece reached the opponents side
            if (a.tile.row == 0 && a.piece.value == this.turn_values[1] ||
                a.tile.row == board.arr.length - 1 && 
                a.piece.value == this.turn_values[0])
            {
                // console.log("kinged");
                a.piece.king();
            }
        }
    }

    return ret;
};


