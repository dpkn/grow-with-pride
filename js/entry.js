import * as Vec2 from 'vec2';
import Network from '../core/Network';
import { getRandomAttractors, getGridOfAttractors } from '../core/AttractorPatterns';
import Node from '../core/Node';
import Path from '../core/Path';
import SVGLoader from '../core/SVGLoader';
import { random, getCircleOfPoints } from '../core/Utilities';
import { setupKeyListeners } from '../core/KeyboardInteractions';
import SolvusClient from '@solvus/client';

let client = new SolvusClient('main','https://localhost:8843',false);

const leaf = require('../svg/leaf.svg');

let canvas, ctx;
let network;

// Create initial conditions for simulation
let setup = () => {
  // Initialize canvas and context
  canvas = document.getElementById('sketch');
  ctx = canvas.getContext('2d');

  canvas.width = 1920;
  canvas.height = 1080;
 //scaleCanvas(canvas, ctx, 1920, 1080);

  // Initialize simulation object
  network = new Network(ctx);

  // Add the bounds, attractors, and root nodes
  resetNetwork();

  // Set up common keyboard interaction listeners
  setupKeyListeners(network);

  // Begin animation loop
  requestAnimationFrame(update);

};

let resetNetwork = () => {
  network.reset();
  addBounds();
  addObstacles();
  addAttractors();
  addRootNodes();
};

let addBounds = () => {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const width = 1920;
  const height = 1080;

  network.bounds = [
    new Path(
      [
        [cx - width / 2, cy - height / 2], // top left corner
        [cx + width / 2, cy - height / 2], // top right corner
        [cx + width / 2, cy + height / 2], // bottom right corner
        [cx - width / 2, cy + height / 2], // bottom left corner
      ],
      'Bounds',
      ctx
    ),
  ];
};

let addObstacles = () => {
  network.obstacles = [];
  let amountOfRows = 4;
  let amountOfColumns = 8;
  let buildingPadding = 10;
  let boxPaddingX = 50;
  let boxPaddingY = 25;
  let boxWidth =
    (window.innerWidth - buildingPadding * 2 - boxPaddingX * 2 * amountOfColumns) / amountOfColumns;
  let boxHeight =
    (window.innerHeight - buildingPadding * 2 - boxPaddingY * 2 * amountOfRows) / amountOfRows;

  for (let row = 0; row < amountOfRows; row++) {
    for (let column = 0; column < amountOfColumns; column++) {
      // Define topleft and bottomright corner of box
      let x0 = buildingPadding + (boxWidth + boxPaddingX * 2) * column;
      let y0 = buildingPadding + (boxHeight + boxPaddingY * 2) * row;
      let x1 = x0 + boxWidth;
      let y1 = y0 + boxHeight;

      let obstaclePath = new Path(
        [
          [x0, y0], // top left corner
          [x0 + boxWidth, y0], // top right corner
          [x1, y1], // bottom right corner
          [x1 - boxWidth, y1], // bottom left corner
        ],
        'Bounds',
        ctx
      );

      network.obstacles.push(obstaclePath);
    }
  }
};

let addAttractors = () => {
  let gridAttractors = getGridOfAttractors(180,150, ctx, 10, network.bounds, network.obstacles);
   network.attractors = gridAttractors;
};

// Create the network with initial conditions
let addRootNodes = () => {
  // // Add a set of random root nodes throughout scene
  for(let i=0; i<15; i++) {
    network.addNode(
      new Node(
        null,
        new Vec2(
          random(window.innerWidth),
          random(window.innerHeight)
        ),
        true,
        ctx
      )
    );
  }
  // const cx = window.innerWidth / 2 + 30;
  // const cy = window.innerHeight / 2 + 30;
  // let cx =random(window.innerWidth)
  // let cy = random(window.innerHeight)
  // network.addNode(new Node(null, new Vec2(cx, cy), true, ctx));
};

// Main program loop
let update = (timestamp) => {
  network.update();
  network.draw();

  requestAnimationFrame(update);
};

// Key commands specific to this sketch
document.addEventListener('keypress', (e) => {
  switch (e.key) {
    // r = reset simulation by reinitializing the network with initial conditions
    case 'r':
      resetNetwork();
      break;
  }
});

function scaleCanvas(canvas, context, width, height) {
  // assume the device pixel ratio is 1 if the browser doesn't specify it
  const devicePixelRatio = window.devicePixelRatio || 1;

  // determine the 'backing store ratio' of the canvas context
  const backingStoreRatio =
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio ||
    1;

  // determine the actual ratio we want to draw at
  const ratio = devicePixelRatio / backingStoreRatio;

  if (devicePixelRatio !== backingStoreRatio) {
    // set the 'real' canvas size to the higher width/height
    canvas.width = width * ratio;
    canvas.height = height * ratio;

    // ...then scale it back down with CSS
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
  } else {
    // this is a normal 1:1 device; just scale it simply
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = '';
    canvas.style.height = '';
  }

  // scale the drawing context so everything will work at the higher ratio
  context.scale(ratio, ratio);
}

// Kick off the application
setup();

client.onStageEvent('start',(e)=>{
  network.togglePause();
});

client.onStageEvent('clear', (e) => {
  network.reset();
});