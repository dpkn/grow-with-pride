import * as Vec2 from 'vec2';
import Network from '../core/Network';
import { getGridOfAttractors } from '../core/AttractorPatterns';
import Node from '../core/Node';
import Path from '../core/Path';
import { random } from '../core/Utilities';
import SolvusClient from '@solvus/client';

let client = new SolvusClient('main','https://localhost:8843',false);

let canvas, ctx, gl;
let network;
let audio = new Audio('../media/soundtrack.mp3');
let video = document.getElementById('ShadowVideo');
video.addEventListener('canplay', function () {
  video.play();
});

let obstacles;

let setup = () => {

  canvas = document.getElementById('sketch');
  ctx = canvas.getContext('2d');
  gl = canvas.getContext('webgl');

  canvas.width = 1920;
  canvas.height = 1080;
  // scaleCanvas(canvas, ctx, 1920, 1080);

  // Initialize simulation object
  network = new Network(ctx);
  generateObstacles();
  resetNetwork();

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

let generateObstacles = () => {
  obstacles = [];
  let obstacleCorrections = {
    0:{
      x:-10,
      y:-20,
      width:-40,
      height:-10
    }

  }

  let amountOfRows = 4;
  let amountOfColumns = 6;
  let buildingPaddingX = 100;
  let buildingPaddingY = 50;
  let boxMarginX = 90;
  let boxMarginY = 50;
  let boxWidth =
    (canvas.clientWidth - (buildingPaddingX * 2) - (boxMarginX * 2 * amountOfColumns)) / amountOfColumns;
  let boxHeight =
    (canvas.clientHeight - (buildingPaddingY * 2) - (boxMarginY * 2 * amountOfRows)) / amountOfRows;

  for (let row = 0; row < amountOfRows; row++) {
    for (let column = 0; column < amountOfColumns; column++) {
      let correction = obstacleCorrections[row * amountOfRows + column];
      let correctionX = correction?.x || 0;
      let correctionY = correction?.y || 0;
      let correctionWidth = correction?.width || 0;
      let correctionHeight = correction?.height || 0;
      
      // Define topleft and bottomright corner of box
      let x0 = buildingPaddingX + (boxWidth + boxMarginX *2) * column + correctionX;
      let y0 = buildingPaddingY + (boxHeight + boxMarginY*2) * row + correctionY; 
      let x1 = x0 + boxWidth + correctionWidth;
      let y1 = y0 + boxHeight + correctionHeight;

      let obstaclePath = new Path(
        [
          [x0, y0], // top left corner
          [x0 + boxWidth +correctionWidth, y0], // top right corner
          [x1, y1], // bottom right corner
          [x1 - boxWidth - correctionWidth, y1], // bottom left corner
        ],
        'Obstacle',
        ctx
      );

      obstacles.push(obstaclePath);
    }
  }
}

let addBounds = () => {
  network.bounds = [
    new Path(
      [
        [0, 0], // top left corner
        [canvas.width, 0], // top right corner
        [canvas.width, canvas.height], // bottom right corner
        [0, canvas.height], // bottom left corner
      ],
      'Bounds',
      ctx
    ),
  ];
};

let addObstacles = () => {
  network.obstacles = obstacles;
};

let addAttractors = () => {
  let gridAttractors = getGridOfAttractors(180,150, ctx, 10, network.bounds, network.obstacles);
   network.attractors = gridAttractors;
};

let addRootNodes = () => {
  
  let rootPoints = [[290,980],[662,987],[1600,1010]]

  for(let point of rootPoints) {
    network.addNode(
      new Node(
        null,
        new Vec2(
          point[0],
          point[1]
        ),
        true,
        ctx
      )
    );
  }

  setTimeout(()=>{
   network.addNode( new Node(null, new Vec2(1147, 230), true, ctx));
  },3000)
};

// Main program loop
let update = (timestamp) => {

  network.update();
  network.draw();

  if(network.settings.IsPaused){
   // drawStartNodes();
  }

 // ctx.drawImage(video, 0, 0);

  requestAnimationFrame(update);
};

// Kick off the application
setup();


// solvus event listeners
client.onStageEvent('start',(e)=>{
  resetNetwork();
  network.togglePause();
  audio.play();
});

client.onStageEvent('reset', (e) => {
  network.togglePause();
  network.nodes = [];
  network.drawBackground();
  audio.pause();
  audio.currentTime  = 0;
});

client.onStageEvent('outlines', (e) => {
  network.toggleBounds();
  network.toggleObstacles();
});


// Log mouse coordiantes for determining location
window.addEventListener('mousemove', (e) => {
  console.log(e.offsetX, e.offsetY);
});