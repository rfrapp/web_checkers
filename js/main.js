
window.onload = function()
{
	var canvas = document.getElementById("game_canvas");
	canvas.setAttribute("width", CANVAS_WIDTH);
	canvas.setAttribute("height", CANVAS_HEIGHT);
	
	var match = new Match(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, canvas, 
						  "127.0.0.1", "127.0.0.1");

	setInterval( function() {
		match.play();
	});
};
