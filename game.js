//config

var levels=[ {
  'front':'s_imgs/card2.png',
  'backA':'s_imgs/tyuk.png',
  'backB':'s_imgs/konty.png',
},
{
'front':'s_imgs/card2.png',
  'backA':'s_imgs/pityo.png',
  'backB':'s_imgs/csengo.png',
},
{
'front':'s_imgs/card2.png',
  'backA':'s_imgs/kigyo.png',
  'backB':'s_imgs/gyufa.png',
},
{
'front':'s_imgs/card2.png',
  'backA':'s_imgs/gyongy.png',
  'backB':'s_imgs/kagylo.png',
},
{
'front':'s_imgs/card5.png',
  'backA':'s_imgs/kutya.png',
  'backB':'s_imgs/tolgy.png',
},
{
'front':'s_imgs/card5.png',
  'backA':'s_imgs/pitypang.png',
  'backB':'s_imgs/meggy.png',
},
{
'front':'s_imgs/card5.png',
  'backA':'s_imgs/kesztyu.png',
  'backB':'s_imgs/gyuru.png',
},
{
'front':'s_imgs/card5.png',
  'backA':'s_imgs/mond1.png',
  'backB':'s_imgs/mond2.png',
},
{
'front':'s_imgs/card5.png',
  'backA':'s_imgs/mond3.png',
  'backB':'s_imgs/mond4.png',
}];

function getImgs(){
  return levels.map( function(d){
                return [d.backA,d.backB];})
         .reduce( function (a,b){
                    return [].concat(a).concat(b);
                  });
}



//Aliases
var Container = PIXI.Container,
autoDetectRenderer = PIXI.autoDetectRenderer,
loader = PIXI.loader,
resources = PIXI.loader.resources,
TextureCache = PIXI.utils.TextureCache,
Texture = PIXI.Texture,
Sprite = PIXI.Sprite;
CARD_BASE="s_imgs/card2.png";
CARD_LEVEL="s_imgs/card5.png";
SCREEN_W=1024;
SCREEN_H=768;
charm = new Charm(PIXI);
//Create a Pixi stage and renderer and add the
//renderer.view to the DOM
stage = new Container(),
currentLevel=0;
renderer = autoDetectRenderer(SCREEN_W, SCREEN_H);

renderer.backgroundColor=0xF9FBE7;
document.body.appendChild(renderer.view);

//load a JSON file and run the `setup` function when it's done
loader
.add(CARD_BASE)
.add(CARD_LEVEL)
.add(getImgs())
.load(setup);

//Define variables that might be used in more
//than one function

var cardA,cardB,sprite_animationA,sprite_animationB,plierA,plierB,card_to_filp;



function setup() {
  cardA=getCard(1,0);
  cardB=getCard(0,0);
  stage.addChild(cardA);
  stage.addChild(cardB);
  //Render the stage
  renderer.render(stage);

}

function gameLoop() {

  //Loop this function at 60 frames per second
  requestAnimationFrame(gameLoop);
  flipA(card_to_filp)
  flipB(card_to_filp)
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
  var current=levels[currentLevel];
  var frontTexture=resources[current.front].texture;
  var backTexture=side ? resources[current.backA].texture : resources[current.backB].texture;
  var card=new Sprite(frontTexture);
  card.otherside=backTexture;
  card.isFlipped=false;
  var res= side ? getLEFTXY(card.width,card.height): getRightXY(card.width,card.height);
  card.x=res.x;
  card.y=res.y;
  card.interactive = true;
  var cal=partial(onButtonDown,card)
  card.on('mousedown',cal);
  card.on('touchstart', cal);
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
  setSpriteAnimation(p);
  card_to_filp=p;
  p.isFlipped=true;

} else {

  charm.walkPath( p,  getWaypoints(p),  120,  "smoothstep",   false,  false,  200 )
  p.interactive=false;
  charm.scale(p,p.scale.x,scaleBy(p.scale.y,0.5),120).onComplete=function ()
  {

      p.putaway=true;
      if(cardA.putaway&&cardB.putaway){
        currentLevel++;
        cardA=getCard(1);
        cardB=getCard(0);
        stage.addChild(cardA);
        stage.addChild(cardB);
      }
  }

}
}

function setSpriteAnimation(p){
    if (p==cardA){
      sprite_animationA=true;
      plierA=-1;
    }else {
      sprite_animationB=true;
      plierB=-1;
    }
}

function scaleBy(current,factor){
  return current*factor;
}

function getWaypoints(p){
  return [[p.x,p.y],[p.x,0],[SCREEN_W-p.width+80,0],[SCREEN_W-p.width+80,SCREEN_H-p.y-80]];
}


function flipA(sprite){


  if(sprite_animationA){

    if(plierA > 0 && cardA.scale.x >0.83){
      sprite_animationA=false;
    }

    if(cardA.scale.x<0){
      plierA=1;
      cardA.texture=cardA.otherside ;
    }

    cardA.scale.x+=plierA*0.1;
    //  sprite.y-=0.5;

  }

}



function flipB(sprite){


  if(sprite_animationB){

    if(plierB > 0 && cardB.scale.x >0.83){
      sprite_animationB=false;
    }

    if(cardB.scale.x<0){
      plierB=1;
      cardB.texture=cardB.otherside ;
    }

    cardB.scale.x+=plierB*0.1;
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
