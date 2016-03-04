//Aliases
var Container = PIXI.Container,
autoDetectRenderer = PIXI.autoDetectRenderer,
loader = PIXI.loader,
resources = PIXI.loader.resources,
TextureCache = PIXI.utils.TextureCache,
Texture = PIXI.Texture,
Sprite = PIXI.Sprite;
CARD_PNG="imgs/card.png";
SCREEN_W=1024;
SCREEN_H=768;
charm = new Charm(PIXI);
//Create a Pixi stage and renderer and add the
//renderer.view to the DOM
var stage = new Container(),
renderer = autoDetectRenderer(SCREEN_W, SCREEN_H);
renderer.backgroundColor=0xF9FBE7;
document.body.appendChild(renderer.view);

//load a JSON file and run the `setup` function when it's done
loader
.add(CARD_PNG)
.load(setup);

//Define variables that might be used in more
//than one function
var cardA,cardB;

function setup() {
  cardA=getCard(1);
  cardB=getCard(0);
  stage.addChild(cardA);
  stage.addChild(cardB);
  //Render the stage
  renderer.render(stage);
}

function gameLoop() {

  //Loop this function at 60 frames per second
  requestAnimationFrame(gameLoop);
  charm.update();


  //Render the stage to see the animation
  renderer.render(stage);
}

//Start the game loop
gameLoop();

//The `randomInt` helper function
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function getCard (side){
  var card=new Sprite(resources[CARD_PNG].texture);
  card.width=250;
  card.height=200;
  var res= side ? getLEFTXY(card.width,card.height): getRightXY(card.width,card.height);
  card.x=res.x;
  card.y=res.y;
  card.interactive = true;
  card.on('mousedown',onButtonDown);
  card.on('touchstart', onButtonDown);
  return card;
}

function getLEFTXY(width,height){
  var cx=SCREEN_W/2 -width;
  cy=SCREEN_H/2 -height/2;
  var res ={};
  res.x=cx;
  res.y=cy;
  return res;
}


function getRightXY(width,height){
  var cx=SCREEN_W/2 ;
  cy=SCREEN_H/2 -height/2;
  var res ={};
  res.x=cx;
  res.y=cy;
  return res;
}

function onButtonDown(){

  console.log("onButtonDown");
  charm.breathe(
    this,          //The sprite
    scaleBy(this.scale.x,1.1),          //The final scale x value
    scaleBy(this.scale.x,1.1),          //The final scale y value
    60,             //The duration, in frames
    false,               //Should the tween yoyo?
    0  //Delay, in milliseconds, before yoyoing
  );
  //this.alpha = 0.5;
}

function scaleBy(current,factor){
    return current*factor;
}
