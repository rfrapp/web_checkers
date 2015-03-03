
// At the moment, this Tile object does not
// fully represent a generic Tile, but rather, one 
// for a Checkers game with possibilities to generalize.
// This will have to be discussed in greater detail later.

// board = Board obj reference 
var Tile = function(board, row, col)
{
    this.board = board;
    this.row = row;
    this.col = col; 
    // this.piece = null;
};

// Tile.prototype.add_piece = function(piece)
// {
//     this.piece = piece; 
// };

// Tile.prototype.remove_piece = function(piece)
// {
//     var p = this.piece;
//     this.piece = null;
//     return p;
// };

