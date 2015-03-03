
var CheckersView = function(parent, x, y, w, h, canvas_element)
{
	this.parent = parent;
	this.rect = new Rect(x, y, w, h);
	this.canvas_element = canvas_element;
	this.context = canvas_element.getContext("2d");
	this.turn_chars = parent.game.turn_values;
	this.turn_colors = ["black", "#B8022C"];
	this.tile_rects = [];

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
	for (i = 0; i < board.rows; i++)
	{
	    for (j = 0; j < board.cols; j++)
	    {
	    	if (this.parent.state == 0)
	    	{
		        if (rects[i][j].collide_point(mouse_pos.x, mouse_pos.y) &&
		        	this.parent.is_piece_on_tile(board.arr[i][j], 
		        	this.parent.game.turn_values[this.parent.turn]))
		        {
		            r = i;
		            c = j;
		            break;
		        }
		    }
		    else
		    {
		    	if (rects[i][j].collide_point(mouse_pos.x, mouse_pos.y))
		    	{
		    	    r = i;
		    	    c = j;
		    	    break;
		    	}
		    }
	    }
	}

	if (r != -1 && c != -1)
	{
		this.parent.get_notification({r: r, c: c});
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

	for (i = 0; i < assocs.length; i++)
	{
		var cx = assocs[i].tile.col * TILE_WIDTH + TILE_WIDTH / 2;
		var cy = assocs[i].tile.row * TILE_HEIGHT + TILE_HEIGHT / 2;
		var color = (assocs[i].piece.value == "B") ? this.turn_colors[0] : this.turn_colors[1];

		draw_filled_circle(this.context, {x: cx, y: cy}, 
						   (TILE_WIDTH - 10) / 2, color, 1, "#ffff66");
	}
	
};
