
var CheckersView = function(parent, x, y, w, h, canvas_element)
{
	this.parent = parent;
	this.rect = new Rect(x, y, w, h);
	this.canvas_element = canvas_element;
	this.context = canvas_element.getContext("2d");
	this.turn_chars = parent.game.turn_values;
	this.turn_colors = ["black", "#B8022C"];
	this.tile_rects = [];
	this.king_image = new Image();
	this.king_image.src = "images/crown-small.png";
	this.king_img_loaded = false;
	this.selected_piece_r = -1;
	this.selected_piece_c = -1;
	this.selected_tile_color = "#76A2F5";
	this.possible_moves = null;

	this.init();
	this.wire_events();
};

CheckersView.prototype.wire_events = function()
{
	this.canvas_element.addEventListener('click', this.handle_input.bind(this));
}

CheckersView.prototype.init = function()
{
	var board = this.parent.board;
	var drawx = this.rect.x, drawy = this.rect.y;

	for (i = 0; i < board.rows; i++)
	{
		var row = [];
		drawx = this.rect.x; 
		for (j = 0; j < board.cols; j++)
		{
			var x = drawx, y = drawy;
			var w = TILE_WIDTH, h = TILE_HEIGHT;

			row.push(new Rect(x, y, w, h));
			drawx += TILE_WIDTH;
		}
		drawy += TILE_HEIGHT;
		this.tile_rects.push(row);
	}
}

CheckersView.prototype.handle_input = function(event)
{
	var r = -1, c = -1;
	var board = this.parent.board;
	var mouse_pos = getMousePos(this.canvas_element, event);
	var rects = this.tile_rects;
	var i = 0, j = 0;

	var assocs = this.parent.piece_tile_assocs;

	for (i = 0; i < board.rows; i++)
	{
	    for (j = 0; j < board.cols; j++)
	    {
	    	if (this.parent.state == 0)
	    	{
	    		var a = assocs[i.toString() + "," + j.toString()];

	    		if (!a) continue;

		        if (rects[i][j].collide_point(mouse_pos.x, mouse_pos.y) &&
		        	a.piece.value == this.parent.game.turn_values[this.parent.turn])
		        {
		            r = i;
		            c = j;

		            this.selected_piece_r = r;
		            this.selected_piece_c = j;
		            break;
		        }
		    }
		    else
		    {
		    	if (rects[i][j].collide_point(mouse_pos.x, mouse_pos.y))
		    	{
		    	    r = i;
		    	    c = j;
		    	    this.selected_piece_r = -1;
		    	    this.selected_piece_c = -1;
		    	    break;
		    	}
		    }
	    }
	}

	if (r != -1 && c != -1)
	{
		console.log("here");
		this.parent.get_notification({r: r, c: c});

		if (this.parent.state == 1)
		{
			var g = this.parent.game;
			var b = this.parent.board;
			this.possible_moves = g.possible_moves(b, assocs, g.turn_values[this.parent.turn]);
		}
	}
};

CheckersView.prototype.draw = function()
{
	var board = this.parent.board;
	var color_counter = 0;

	// Draw the tile rects
	for (i = 0; i < board.rows; i++)
	{
		for (j = 0; j < board.cols; j++)
		{
			var rect = this.tile_rects[i][j];
			var color = this.turn_colors[color_counter % this.turn_colors.length];

			draw_rectangle(this.context, {x: rect.x, y: rect.y}, rect.w, rect.h, color);
			color_counter++;
		}
		color_counter++;
	}

	var assocs = this.parent.piece_tile_assocs;
	var possible = null;

	if (this.selected_piece_r != -1 && this.selected_piece_c != -1)
	{
		possible = this.possible_moves;

		var k = 0;
		for (k = 0; k < possible.jumps.length; k++)
		{
			var move = possible.jumps[k];

			if (move.src.r == this.selected_piece_r && 
				move.src.c == this.selected_piece_c)
			{
				var rect = this.tile_rects[move.dst.r][move.dst.c];
				var color = this.selected_tile_color;
				draw_rectangle(this.context, {x: rect.x, y: rect.y}, rect.w, rect.h, color);
			}
		}

		var k = 0;
		for (k = 0; k < possible.forward.length; k++)
		{
			var move = possible.forward[k];

			if (move.src.r == this.selected_piece_r && 
				move.src.c == this.selected_piece_c)
			{
				var rect = this.tile_rects[move.dst.r][move.dst.c];
				var color = this.selected_tile_color;
				draw_rectangle(this.context, {x: rect.x, y: rect.y}, rect.w, rect.h, color);
			}
		}
	}

	// for (i = 0; i < assocs.length; i++)
	for (key in assocs)
	{
		if (assocs.hasOwnProperty(key))
		{
			var a = assocs[key];
			var cx = a.tile.col * TILE_WIDTH + TILE_WIDTH / 2;
			var cy = a.tile.row * TILE_HEIGHT + TILE_HEIGHT / 2;
			var color = (a.piece.value == "B") ? this.turn_colors[0] : this.turn_colors[1];

			draw_filled_circle(this.context, {x: cx, y: cy}, 
							   (TILE_WIDTH - 10) / 2, color, 1, "#ffff66");

			if (a.piece.is_king)
			{
				var x = a.tile.col * TILE_WIDTH + this.king_image.width / 2;
				var y = a.tile.row * TILE_HEIGHT + this.king_image.height / 2;
				this.context.drawImage(this.king_image, x, y);
			}
		}
	}
	
};
