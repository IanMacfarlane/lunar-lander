/*
 Assignment 3 - Lunar Lander
 Ian Macfarlane
 A02243880
*/

let prevTime = performance.now();

var thrust;// = document.getElementById('thrust');
let left;// = document.getElementById('left');
let right;// = document.getElementById('right');
let container = document.getElementById('container');
let subMenu = document.getElementById('subMenu');
let backgroundImage = document.getElementById('background');
let landerImage = document.getElementById('lander');
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);

// initialize game variables
let lander = {
	xLocation: 250,
	yLocation: 0,
	xVelocity: 0,
	yVelocity: 0,
	angle: 90,// pointing right
	thrusters: false,
	rotateLeft: false,
	rotateRight: false,
	width: 36,
	height: 28,
	fuel: 20,
	speed: 0,
	landed: false,
	crashed: false,
};

let controls = {
	rotateLeft: 37,
	rotateRight: 39,
	thrust: 38,
};
if (localStorage.thrust) {
	controls.thrust = Number(localStorage.thrust);
}
if (localStorage.left) {
	controls.rotateLeft = Number(localStorage.left);
}
if (localStorage.right) {
	controls.rotateRight = Number(localStorage.right);
}

let surface;
let countDown = 3;
let level = 1;
let scored = false;

let changeControl = false;

let newLevel = true;

// generate first level
generateSurface(1);

gameLoop(prevTime);

function gameLoop(timeStamp) {
	elapsedTime = timeStamp - prevTime;
	prevTime = timeStamp;

	processInput();
	update(elapsedTime);
	render();

	requestAnimationFrame(gameLoop);
}

function onKeyDown(e) {
	if (!changeControl) {
		if (e.keyCode === controls.rotateLeft) {
			lander.rotateLeft = true;
		}
		if (e.keyCode === controls.thrust) {
			lander.thrusters = true;
		}
		if (e.keyCode === controls.rotateRight) {
			lander.rotateRight = true;
		}
	}
	else {

		if (changeControl === 'thrust') {
			controls.thrust = e.keyCode;
			localStorage.thrust = e.keyCode;
			let thrust = '<div id=\'control\'><div id=\'white\'>thrust</div><input type=\'button\' value=\'' + controls.thrust + '\' onClick=\'onThrustKeyClick()\'></div>';
			let left = '<div id=\'control\'><div id=\'left\'>rotate left</div><input type=\'button\' value=\'' + controls.rotateLeft + '\' onClick=\'onLeftKeyClick()\'></div>';
			let right = '<div id=\'control\'><div id=\'right\'>rotate right</div><input type=\'button\' value=\'' + controls.rotateRight + '\' onClick=\'onRightKeyClick()\'></div>';
			subMenu.innerHTML = thrust + left + right;
		}
		else if (changeControl === 'left') {
			controls.rotateLeft = e.keyCode;
			localStorage.left = e.keyCode;
			let thrust = '<div id=\'control\'><div id=\'thrust\'>thrust</div><input type=\'button\' value=\'' + controls.thrust + '\' onClick=\'onThrustKeyClick()\'></div>';
			let left = '<div id=\'control\'><div id=\'white\'>rotate left</div><input type=\'button\' value=\'' + controls.rotateLeft + '\' onClick=\'onLeftKeyClick()\'></div>';
			let right = '<div id=\'control\'><div id=\'right\'>rotate right</div><input type=\'button\' value=\'' + controls.rotateRight + '\' onClick=\'onRightKeyClick()\'></div>';
			subMenu.innerHTML = thrust + left + right;
		}
		else if (changeControl === 'right') {
			controls.rotateRight = e.keyCode;
			localStorage.right = e.keyCode;
			let thrust = '<div id=\'control\'><div id=\'thrust\'>thrust</div><input type=\'button\' value=\'' + controls.thrust + '\' onClick=\'onThrustKeyClick()\'></div>';
			let left = '<div id=\'control\'><div id=\'left\'>rotate left</div><input type=\'button\' value=\'' + controls.rotateLeft + '\' onClick=\'onLeftKeyClick()\'></div>';
			let right = '<div id=\'control\'><div id=\'white\'>rotate right</div><input type=\'button\' value=\'' + controls.rotateRight + '\' onClick=\'onRightKeyClick()\'></div>';
			subMenu.innerHTML = thrust + left + right;
		}

		changeControl = false;

	}
}
function onKeyUp(e) {
	if (e.keyCode === controls.rotateLeft) {
		lander.rotateLeft = false;
	}
	if (e.keyCode === controls.thrust) {
		lander.thrusters = false;
	}
	if (e.keyCode === controls.rotateRight) {
		lander.rotateRight = false;
	}
}
function onNewGameClick(e) {
	// onNewGameClick
	container.innerHTML = '<canvas id=\'myCanvas\' width=\'500\' height=\'500\'></canvas>';
	canvas = document.getElementById('myCanvas');
	context = canvas.getContext('2d');

	lander.xLocation = 250;
	lander.yLocation = 0;
	lander.xVelocity = 0;
	lander.yVelocity = 0;
	lander.angle = 90;
	lander.thrusters = false;
	lander.rotateLeft = false;
	lander.rotateRight = false;
	lander.fuel = 20;
	lander.speed = 0;
	lander.landed = false;
	lander.crashed = false;
	newLevel = true;
	level = 1;

	generateSurface(1);
	
}
function onHighScoresClick(e) {
	if (localStorage) {
		let board = JSON.parse(localStorage.score);
		board.sort();
		board.reverse();
		let scoreBoard = '';
		for (let i = 0; i < board.length; i++) {
			scoreBoard += '<div>' + board[i].toFixed(1) + '</div>';
			//console.log(board[i]);
		}
		subMenu.innerHTML = scoreBoard;
	}
	else {
		subMenu.innerHTML = '<div>No Scores</div>';
	}
}
function onControlsClick(e) {
	let thrust = '<div id=\'control\'><div id=\'thrust\'>thrust</div><input type=\'button\' value=\'' + controls.thrust + '\' onClick=\'onThrustKeyClick()\'></div>';
	let left = '<div id=\'control\'><div id=\'left\'>rotate left</div><input type=\'button\' value=\'' + controls.rotateLeft + '\' onClick=\'onLeftKeyClick()\'></div>';
	let right = '<div id=\'control\'><div id=\'right\'>rotate right</div><input type=\'button\' value=\'' + controls.rotateRight + '\' onClick=\'onRightKeyClick()\'></div>';
	subMenu.innerHTML = thrust + left + right;
}
function onCreditsClick(e) {
	subMenu.innerHTML = '<div>Developed by Ian Macfarlane</div>';
}
function onThrustKeyClick() {
	changeControl = 'thrust';
	thrust = document.getElementById('thrust');
	thrust.style.color = 'red';
}
function onLeftKeyClick() {
	changeControl = 'left';
	left = document.getElementById('left');
	left.style.color = 'red';
}
function onRightKeyClick() {
	changeControl = 'right';
	right = document.getElementById('right');
	right.style.color = 'red';
}

function processInput() {
}

function update(elapsedTime) {

	if (!lander.landed && !lander.crashed) {
		// calculate xVelocity and yVelocity given gravity and thrust 
		lander.yVelocity += 1 * (elapsedTime/1000);
		if (lander.thrusters && lander.fuel >= 0) {
			// consume fuel
			lander.fuel -= (elapsedTime/1000);

			lander.yVelocity -= .03 * Math.cos(lander.angle*Math.PI/180);
			lander.xVelocity += .03 * Math.sin(lander.angle*Math.PI/180);
		}

		lander.speed = Math.abs(lander.yVelocity * 10).toFixed(1);

		// calculate new position given last position and velocity
		lander.yLocation += lander.yVelocity;
		lander.xLocation += lander.xVelocity;

		// update angle
		if (lander.rotateRight) {
			lander.angle += 2;
		}
		if (lander.rotateLeft) {
			lander.angle -= 2;
		}

		// land or crash, disable controls, countdown to next level or game over or game won
		for (let i = 0; i < surface.length-1; i++) {
			// if line intercepts lander
			if (surfaceLanderIntersection(surface[i], surface[i+1])) {
				// if line is safe
				if (surface[i].y === surface[i+1].y) {
					// check speed and angle for win
					if (lander.speed <= 2 && lander.angle >= -5 && lander.angle <= 5) {
						lander.landed = true;
					}
					else {
						lander.crashed = true;
					}
				}
				else {
					lander.crashed = true;
				}
			}
		}
	}
	else if (lander.landed) {
		countDown -= elapsedTime / 1000;
		if (countDown <= 0 && level === 1) {

			// calculate score and update score board make persistant
			let board;
			if (localStorage.score) {
				board = JSON.parse(localStorage.score);
			}
			else {
				board = [];
			}
			board.push(lander.fuel*level);
			localStorage.score = JSON.stringify(board);

			// go to next level
			container.innerHTML = '<canvas id=\'myCanvas\' width=\'500\' height=\'500\'></canvas>';
			canvas = document.getElementById('myCanvas');
			context = canvas.getContext('2d');

			lander.xLocation = 250;
			lander.yLocation = 0;
			lander.xVelocity = 0;
			lander.yVelocity = 0;
			lander.angle = 90;
			lander.thrusters = false;
			lander.rotateLeft = false;
			lander.rotateRight = false;
			lander.fuel = 20;
			lander.speed = 0;
			lander.landed = false;
			lander.crashed = false;
			newLevel = true;
			level = 2;

			generateSurface(2);

		}
		else if (level === 2 && !scored) {
			scored = true;
			let board;
			board = JSON.parse(localStorage.score);
			board.push(lander.fuel*level);
			localStorage.score = JSON.stringify(board);
		}
	}

	// TODO Sound effects: landing, thrusters, crash
}

function render() {

	// clear canvas and redraw every pixel every frame
	context.clearRect(0, 0, canvas.width, canvas.height);

	// draw background
	context.drawImage(backgroundImage, 0, 0);

	// draw and rotate lander
	context.save();
	context.translate(lander.xLocation+(lander.width/2), lander.yLocation+(lander.height/2));
	context.rotate(lander.angle*Math.PI/180);
	context.translate(-(lander.xLocation+(lander.width/2)), -(lander.yLocation+(lander.height/2)));
	context.drawImage(landerImage, lander.xLocation, lander.yLocation);
	context.restore();

	// draw and fill surface
	if (newLevel) {
		newLevel = false;
		context.restore();
		context.moveTo(surface[0].x, surface[0].y);
		for (let i = 1; i < surface.length; i++) {
			context.lineTo(surface[i].x, surface[i].y);
		}
		context.lineTo(500, 500);
		context.lineTo(0, 500);
		context.save();
	}
	context.fillStyle = '#222';
	context.fill();
	context.strokeStyle = '#fff';
	context.stroke();

	// draw hud
	context.font = '16px Monospace';
	if (lander.fuel <= 0) {
		context.fillStyle = '#fff';
	}
	else {
		context.fillStyle = '#03af09';
	}
	context.fillText('fuel : ' + Math.abs(lander.fuel.toFixed(1)) + ' s', 350, 20);

	if (lander.speed > 2) {
		context.fillStyle = '#fff';
	}
	else {
		context.fillStyle = '#03af09';
	}
	context.fillText('speed: ' + lander.speed + ' m/s', 350, 40);

	if (lander.angle >= -5 && lander.angle <= 5) {
		context.fillStyle = '#03af09';
	}
	else {
		context.fillStyle = '#fff';
	}
	context.fillText('angle: ' + lander.angle%360 + ' deg', 350, 60);

	// game end
	if (lander.crashed) {
		context.font = '32px Monospace';
		context.fillStyle = '#aa0606';
		context.fillText('Game Over', 200, 250);
	}
	if (lander.landed && level === 1) {
		context.font = '32px Monospace';
		context.fillStyle = '#aa0606';
		context.fillText(Math.floor(countDown)+1, 200, 250);
	}

	// TODO draw particles
	// TODO explosion if lander crashes

}

function generateSurface(level) {
	// random mid-point displacement algorithm
	surface = [];
	let newPoint = [];
	let safe;

	// add safe zones
	if (level === 1) {
		safe = {
			x: Math.floor(Math.random() * 350)+75,
			y: Math.floor(Math.random() * 350)+75,
		};
		surface.push({x:safe.x,y:safe.y});
		surface.push({x:safe.x+70,y:safe.y});

		// add second safe zone x cant be 
		while (safe.x >= surface[0].x-70 && safe.x <= surface[1].x) {
			safe.x = Math.floor(Math.random() * 350)+75;
		}
		safe.y = Math.floor(Math.random() * 350)+75;
		if (safe.x < surface[0].x) {
			surface.unshift({x:safe.x+70,y:safe.y});
			surface.unshift({x:safe.x,y:safe.y});
		}
		else {
			surface.push({x:safe.x,y:safe.y});
			surface.push({x:safe.x+70,y:safe.y});
		}
	}
	else if (level === 2) {
		safe = {
			x: Math.floor(Math.random() * 350)+75,
			y: Math.floor(Math.random() * 350)+75,
		};
		surface.push({x:safe.x,y:safe.y});
		surface.push({x:safe.x+50,y:safe.y});
	}

	// add the two endpoints
	surface.unshift({x:0,y:Math.floor(Math.random() * 500)});
	surface.push({x:500,y:Math.floor(Math.random() * 500)});

	for (let j = 0; j < 5; j++) {
		for (let i = 0; i < surface.length-1; i++) {
			if (surface[i].y !== surface[i+1].y) {
				let midpoint = surface[i].x + ((surface[i+1].x - surface[i].x) / 2);

				let s = 1;
				let g = (Math.random() * 2) - 1;
				let r = s * g * (Math.abs(surface[i+1].x - surface[i].x) / 2);
				let y = ((surface[i].y + surface[i+1].y) / 2) + r;

				newPoint.push({x:midpoint,y:y});
			}
		}

		for (let i = 0; i < surface.length-1; i++) {
			if (surface[i].y !== surface[i+1].y) {
				surface.splice(i+1, 0, newPoint.shift());
				i++;
			}
		}
	}
}

function surfaceLanderIntersection(pt1, pt2) {
	let l = lineLine(pt1.x,pt1.y,pt2.x,pt2.y,lander.xLocation,lander.yLocation,lander.xLocation,lander.yLocation+lander.height);
	let r = lineLine(pt1.x,pt1.y,pt2.x,pt2.y,lander.xLocation+lander.width,lander.yLocation,lander.xLocation+lander.width,lander.yLocation+lander.height);
	let t = lineLine(pt1.x,pt1.y,pt2.x,pt2.y,lander.xLocation,lander.yLocation,lander.xLocation+lander.width,lander.yLocation);
	let b = lineLine(pt1.x,pt1.y,pt2.x,pt2.y,lander.xLocation,lander.yLocation+lander.height,lander.xLocation+lander.width,lander.yLocation+lander.height);

	if (l || r || t || b) {
		return true;
	}
	return false;
}

function lineLine(x1,y1,x2,y2,x3,y3,x4,y4) {
	let uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
	let uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

	if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
		return true;
	}
	return false;
}
