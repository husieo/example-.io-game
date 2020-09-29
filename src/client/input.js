// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#6-client-input-%EF%B8%8F
import { updateDirection, processClick } from './networking';

function onMouseInput(e) {
  handleInput(e.clientX, e.clientY);
}

function onTouchInput(e) {
  const touch = e.touches[0];
  handleInput(touch.clientX, touch.clientY);
}

function handleInput(x, y) {
  const dir = Math.atan2(x - window.innerWidth / 2, window.innerHeight / 2 - y);
  updateDirection(dir);
}

function handleClick(x, y) {
  processClick(x,y);
}

export function startCapturingInput() {
  window.addEventListener('click', onMouseInput);
  window.addEventListener('touchstart', onTouchInput);
  window.addEventListener('touchmove', onTouchInput);

  var canvas = document.getElementById('game-canvas'),
    elemLeft = canvas.offsetLeft + canvas.clientLeft,
    elemTop = canvas.offsetTop + canvas.clientTop,
    context = canvas.getContext('2d'),
    elements = [];

// Add event listener for `click` events.
canvas.addEventListener('click', function(event) {
    var x = event.pageX - elemLeft,
        y = event.pageY - elemTop;

    console.log(`clicked an element ${x},${y}:` );
    var canvas = document.getElementById('game-canvas');
    const canvasX = canvas.width / 3;
    const canvasY = canvas.height / 3;
    handleClick(x-canvasX,y-canvasY);

    // Collision detection between clicked offset and element.
    // elements.forEach(function(element) {
    //     if (y > element.top && y < element.top + element.height 
    //         && x > element.left && x < element.left + element.width) {
    //         console.log('clicked an element');
    //     }
    // });

}, false);
}

export function stopCapturingInput() {
  window.removeEventListener('click', onMouseInput);
  window.removeEventListener('touchstart', onTouchInput);
  window.removeEventListener('touchmove', onTouchInput);
}


