var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameOver
var gameOverImage
var restart
var restartImage
var bird , crowsGroup
var dino1
var check
var die
var jump

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImage = loadImage("gameOver.png")
  restartImage = loadImage("restart.png")
  
  bird = loadImage("Bird.png");
  dino1 = loadAnimation("Dino 1.png");
  
  check= loadSound("checkPoint.mp3")
  die = loadSound("die.mp3")
  jump = loadSound("jump.mp3")
  
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.addAnimation("Ducking", dino1)
  trex.scale = 0.5;
  //trex.debug=true;
  trex.setCollider("circle",0,0,35)
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  // create Obstacles and Cloud groups
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  crowsGroup = new Group();
  
  //console.log("Hello" + 5);
  
  score = 0;
  
  gameOver = createSprite(300,60)
  gameOver.addImage(gameOverImage)
  gameOver.scale=0.7
  gameOver.visible=false;
  
  restart = createSprite(300,110)
  restart.addImage(restartImage)
  restart.scale=0.7
  restart.visible=false;
}

function draw() {
  background(180);
  fill(0)
  text("Score: "+ score, 500,50);
  
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -4;
    
    score = score + Math.round(getFrameRate()/50);
    
     if(keyDown("space")&& trex.y >= 100) {
    trex.velocityY = -13;
       jump.play();
  }
    if(keyWentDown("down")){
      trex.changeAnimation("Ducking", dino1)
      trex.scale=0.15    }
    
    if(keyWentUp("down")){
      trex.changeAnimation("running", trex_running)
      trex.scale=0.5
    }
  
  trex.velocityY = trex.velocityY + 0.8
  
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
    
    //spawn the clouds
  spawnClouds();
  
  //spawn obstacles on the ground
    if (score> 0 && score% 700> 0 && score% 700 < 400){
      spawnObstacles();
    }
    
    if (score> 0 && score% 700< 700 && score% 700> 400 ){
      spawnCrows();
    }
    if(obstaclesGroup.isTouching(trex)|| crowsGroup.isTouching(trex)){
      gameState = END; 
      die.play();
    }
   if (score> 0 && score% 100 === 0){
     check.play();
   } 
  }
  else if(gameState === END){
    //stop the ground
    ground.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    crowsGroup.setVelocityXEach(0);
    crowsGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    obstaclesGroup.setLifetimeEach(-1);
    trex.changeAnimation("collided", trex_collided)
    gameOver.visible=true;
    restart.visible=true;
    
    if (mousePressedOver(restart)){
      reset();
    }
  }
  
 //console.log(getFrameRate())
  
  trex.collide(invisibleGround);
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,170   ,10,40);
   obstacle.velocityX = -(6+(score/100));

   
    // //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //adding obstacles to the group
   obstaclesGroup.add(obstacle);
 }
}




function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 134;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
  }
  
}

function spawnCrows(){
  
  if (frameCount % 70 === 0){
    var crow= createSprite (600,Math.round(random(100,170)))
    crow.addImage(bird)
    crow.velocityX=-(5+(score/200))
    crow.lifetime=150
    crow.scale=0.15
    crowsGroup.add(crow)
  }
}

function reset(){
  gameState = PLAY
  trex.changeAnimation("running" ,trex_running)
  gameOver.visible=false;
  restart.visible=false;
  obstaclesGroup.destroyEach(); 
  cloudsGroup.destroyEach();
  crowsGroup.destroyEach();
  score= 0;
}