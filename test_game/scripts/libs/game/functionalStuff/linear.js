/** Variables to use for degrees/radians conversions
 */
var toDegrees = 180/Math.PI;
var toRadians = Math.PI/180;

/** An object that represents a point.
 *     It holds a hashtable with values called 'x' and 'y'.
 *  'x' is a variable that should be a number.
 *  'y' is a variable that should be a number.
 */
function Point(x,y){
	return {x:x,y:y};
}

/** An object that represents a linear equation.
 *      It provides properties of itself by using a linear equation.
 *  'pointA' is a Point object for the first point of the line.
 *  'PointB' is a Point object for the second point of the line.
 */
function Line(pointA, pointB){
	var line = {},
		x2 = pointB.x,
		x1 = pointA.x,
		y2 = pointB.y,
		y1 = pointA.y,
		deltaY = y2-y1,
		deltaX = x2-x1,
		m = deltaY/deltaX,
		b = y1 - (m*x1);

	line.getX = function(y){return (y-b)/m;};
	line.getY = function(x){return (m*x)+b;};
	line.getDistance = function(){return Math.sqrt(Math.pow(deltaX,2) + Math.pow(deltaY,2));};
	line.deltaY = deltaY;
	line.deltaX = deltaX;
	line.m = m;
	line.b = b;

	line.x1 = x1;
	line.y1 = y1;
	line.x2 = x2;
	line.y2 = y2;

	return line;
}