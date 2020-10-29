import Images from "./Images.js";
import Player from "./Player.js";
import Pipe from "./Pipe.js";



var canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
var players = [];
var pipes = [];
var playerSelected;
var frame = 0;
var gravity = 0.4;
var friction = 0.2;
var jumpPower = 5;
var speedGame = 0;
var speedGameOn = 3;
var speedGameOff = 0;
var xBack = 0;
var xFloor = 0;
var playersAlive = 0;
var spaceBetweenPipes = 110;

var lineGapPipeY = 0;
var lineGapPipeX = 0;

var numPlayers = 200;
var autoMove = false;

document
  .querySelector("#startGame")
  .addEventListener("click", createControlPlayer);
  document.querySelector('#startPopulation').addEventListener("click",createPlayers);
  //document.querySelector('#addPipe').addEventListener('click', createPipe);
document.addEventListener("keydown", sendCommandToPlayer);

//images
const { ImgBackground, ImgBase } = Images;

function init() {
  animate();
}

function startGame(){
  players = [];
  pipes = [];
}

function createControlPlayer() {
  startGame();
  playerSelected = createPlayer();
}

function sendCommandToPlayer(e) {
  if (playerSelected && playerSelected.alive) {
    const key = e.code;
    const keysAccepted = ["ArrowUp", "KeyW"];
    const command = keysAccepted[keysAccepted.indexOf(key)];
    if (command) {
      const execution = {
        ArrowUp() {
          playerSelected.jump(jumpPower);
        },
        KeyW() {
          playerSelected.jump(jumpPower);
        },
      };
      execution[command]();
    }
  }
}

function createPlayer() {
  const p = new Player();
  players.push(p);
  console.log(JSON.stringify(p.brain));
  return p;
}
function createPlayers(){
  startGame();
  autoMove = true;
  for(let x= 0; x<numPlayers;x++){
    createPlayer();
  }
}


function createPipe() {
  let p = new Pipe();
  pipes.push(p);

  //add mirror tp up
  let p2 = new Pipe();
  p2.x = p.x;
  p2.y = p.y;
  p2.mirror = true;
  p2.y -= (p.h + spaceBetweenPipes);
  pipes.push(p2);

}

function drawBackground() {
  ctx.beginPath();
  for (let x = 0; x < 3 + (xBack / 288) * -1; x++) {
    ctx.drawImage(ImgBackground, xBack + 288 * x, 0, 288, 512);
  }

  ctx.closePath();
  //console.log(xBack / 288 * -1);
  xBack -= speedGame / 3;
}

function drawFloor() {
  ctx.beginPath();
  for (let x = 0; x < 3 + (xFloor / 336) * -1; x++) {
    ctx.drawImage(ImgBase, xFloor + 336 * x, canvas.height - 112, 336, 112);
  }
  ctx.closePath();
  xFloor -= speedGame;
}

function activateGravity() {
  for (const p of players) {
    if (p.y + p.h + p.dy > canvas.height - 112) {
      p.dy = -p.dy;
      p.dy = p.dy * friction;
    } else {
      p.dy += gravity;
    }
    p.y += p.dy;
  }
}

function drawPlayers() {
  // console.log(players.length);
  for (const i in players) {
    const p = players[i];
    if(p.alive){
      p.distance += speedGame;
    }

    //animate Wings
    if (frame % 6 === 0 && p.alive) {
      if (p.spriteActive + 1 > p.sprites[p.spriteSelected].length - 1) {
        p.spriteActive = 0;
      } else {
        p.spriteActive++;
      }
    }
    const img = p.sprites[p.spriteSelected][p.spriteActive];

    ctx.beginPath();
    ctx.drawImage(img, p.x, p.y, p.w, p.h);
    ctx.closePath();

    //remove players
    if (!p.alive) {
      p.x -= speedGame;
      if (p.x + p.w < -10) {
        players.splice(i, 1);
      }
    }
  }
}

function drawPipes() {
  for (const i in pipes){
    let p =  pipes[i];
    p.x -= speedGame;
    const img = p.sprites[p.spriteActive];
    ctx.beginPath();
    if(p.mirror){
      ctx.save();
      ctx.scale(1, -1);
      ctx.drawImage(img, p.x,(p.y* -1)  -p.h, p.w, p.h);
      ctx.restore();
    }else {
      ctx.drawImage(img, p.x, p.y, p.w, p.h);
    }
   
    ctx.closePath();
  }
}

function verifyCollisions() {
  playersAlive = 0;
  for (const p of players) {
    if (p.alive) {
      playersAlive++;
      if (p.y + p.h >( canvas.height - 112)) {
       p.alive = false;
        console.log(p.distance);
      }else{
        const pipe = getNextPipe(p);
        if(pipe){
          const cPipe0 = collisionPipe(p, pipe[0]);
          const cPipe1 = collisionPipe(p, pipe[1]);
          if(cPipe0 || cPipe1){
            p.alive = false;
            console.log(p.distance);

          }
        }
      }
    }
  }
}

function collisionPipe(player , pipe){
    const {x,y,w,h} = player;
    if(y < 0){
      return true;
    }
    const px = pipe.x;
    const py = pipe.y;
    const pw = pipe.w;
    const ph = pipe.h;

    const instersectX = intersect(x+w, px, (px + pw)) || intersect(x, px, (px+pw));
    const instersectY = intersect(y+h, py, (py + ph)) || intersect (y, py,(py+ph));

    if (instersectX && instersectY){
      return true;
    }
     return false;
}

function intersect(num, start, end){
  return (num>=start && num <= end);
}

function getNextPipe(player){
  let pipeReturn = null;
  let index = null;
  for(const i in pipes){
    let p = pipes[i];
    if(!p.mirror){
      if((player.x < (p.x + p.w))){
        if (!pipeReturn){
          pipeReturn = p;
          index = i;
        }
        if ( ( (p.x + p.w) < (pipeReturn.x + pipeReturn.w) ) ){
            pipeReturn = pipeReturn;
            index = i;

        }
      }
    }
  }
  if(pipeReturn){
    return [pipeReturn, pipes [parseInt(index)+1]];
  }
  return null;
}

function isRunning() {
  //console.log(playersAlive);
  if (playersAlive > 0) {
    speedGame = speedGameOn;
    if(frame % 70 === 0){
      createPipe();
    }
  } else {
    speedGame = speedGameOff;
  }
}

function calculatePlayersPositions() {
  for(const i in players){
    let p = players[i];
    let pipe = getNextPipe(p);
    if(pipe){
      let gap = (pipe[0].y - (pipe[1].y + pipe[1].h));
      let targetY = pipe[0].y - ((gap/2) -10) - (p.h /2);
      let targetX = pipe[0].x - (pipe [0].w/2) + (p.w);
      lineGapPipeY = targetY;
      lineGapPipeX = targetX;
      p.sensor.x = Math.ceil(p.x - targetX);
      p.sensor.y = Math.ceil(p.y - targetY);
      //console.log(p.sensor);
      
    }
  }
}
function drawLine(){
  ctx.beginPath();
  ctx.fillStyle = "#f00"
  ctx.fillRect(0,lineGapPipeY,288,2);
  ctx.fillRect(lineGapPipeX,9,2,512)
  ctx.closePath();

}

function autoMovePlayers() {
  for (const i in players) {
    let p = players[i];
    if(p.alive){
      let input = [p.sensor.x, p.sensor.y];
      let resultNN = p.brain.predict(input,'sigmoid');
      // console.log(resultNN);
      if(resultNN[0]> 0 ){
        p.jump(jumpPower);  
      }
    }
  }
}
function animate() {
  requestAnimationFrame(() => {
    // const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    activateGravity();
    calculatePlayersPositions();
    autoMovePlayers();
    verifyCollisions();
    drawBackground();
    drawPipes();
    drawFloor();
    drawPlayers();
    isRunning();
    drawLine();

    //loop
    frame++;
    animate();
  });
}

init();
