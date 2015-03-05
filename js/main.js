
window.onload = function()
{
	var canvas = document.getElementById("game_canvas");
	canvas.setAttribute("width", CANVAS_WIDTH);
	canvas.setAttribute("height", CANVAS_HEIGHT);
	
	var match = new Match("127.0.0.1", "127.0.0.1");

	var view = new CheckersView(match, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, canvas);

	setInterval( function() {
		view.draw();
	});
};
