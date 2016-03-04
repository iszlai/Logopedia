//Aliases
var Container = PIXI.Container,
autoDetectRenderer = PIXI.autoDetectRenderer,
loader = PIXI.loader,
resources = PIXI.loader.resources,
TextureCache = PIXI.utils.TextureCache,
Texture = PIXI.Texture,
Sprite = PIXI.Sprite;
CARDA_PNG="imgs/card2.png";
CARDB_PNG="imgs/card5.png";
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
.add(CARDA_PNG)
.add(CARDB_PNG)
.load(setup);

//Define variables that might be used in more
//than one function

var cardA,cardB,sprite_animation,plier,card_to_filp;



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

  flip(card_to_filp)
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
  var card=new Sprite(resources[CARDA_PNG].texture);
  card.otherside=resources[CARDB_PNG].texture;
  card.isFlipped=false;
  var res= side ? getLEFTXY(card.width,card.height): getRightXY(card.width,card.height);
  card.x=res.x;
  card.y=res.y;
  card.interactive = true;
  var cal=partial(onButtonDown,card)
  card.on('mousedown',cal);
  card.on('touchstart', cal);
  console.log(card.scale.x)
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

function onButtonDown(p){

if(!p.isFlipped){
  sprite_animation=true;
  plier=-1;
  card_to_filp=p;
  p.isFlipped=true;
} else {
  charm.scale(p,p.scale.x,scaleBy(p.scale.y,0.5),60);

  charm.walkPath( p,  getWaypoints(p),  100,  "smoothstep",   false,  false,  200 );
}
}

function scaleBy(current,factor){
  return current*factor;
}

function getWaypoints(p){
  return [[p.x,p.y],[p.x,0],[SCREEN_W-p.width+80,0],[SCREEN_W-p.width+80,SCREEN_H-p.y-80]];
}


function flip(sprite){


  if(sprite_animation){

    if(plier > 0 && sprite.scale.x >0.83){
      sprite_animation=false;
    }

    if(sprite.scale.x<0){
      plier=1;
      sprite.texture=sprite.otherside ;
    }

    sprite.scale.x+=plier*0.1;
    //  sprite.y-=0.5;

  }

}
function partial(func /*, 0..n args */) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    var allArguments = args.concat(Array.prototype.slice.call(arguments));
    return func.apply(this, allArguments);
  };
}
