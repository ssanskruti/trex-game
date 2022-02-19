var trex ,trex_running;
var score=0
var gameState=1


function preload(){
  trex_running=loadAnimation("trex1.png","trex3.png","trex4.png")

  groundimg=loadImage("ground2.png")

  cloudImage=loadImage("cloud.png")

  obstacle1=loadImage("obstacle1.png")
  obstacle2=loadImage("obstacle2.png")
  obstacle3=loadImage("obstacle3.png")
  obstacle4=loadImage("obstacle4.png")
  obstacle5=loadImage("obstacle5.png")
  obstacle6=loadImage("obstacle6.png")

  restartImg=loadImage("restart.png");
  gameOverimg=loadImage("gameOver.png");

  trexCollided=loadAnimation("trex_collided.png");

  jumpSound=loadSound("jump.mp3")
  dieSound=loadSound("die.mp3")
  checkpointSound=loadSound("checkpoint.mp3")
}

function setup(){
  createCanvas(windowWidth,windowHeight);
  
  //create a trex sprite
 trex=createSprite(50,height-200,20,80);
 trex.addAnimation("trex",trex_running)
 trex.addAnimation("collided",trexCollided);
 trex.scale=0.7
 trex.debug=false
 trex.setCollider("rectangle",0,0,40,trex.height )

 ground=createSprite(width/2,height-150,600,10)
 ground.addImage(groundimg)

 invisibleground=createSprite(300,height-140,width,10);
 invisibleground.visible=false 

 var rand=Math.round(random(1,100));
 console.log(rand);

 obstaclesGroup=new Group();
 cloudsGroup=new Group();

 gameOver=createSprite(width/2,height/2);
 gameOver.addImage(gameOverimg);
 gameOver.scale=0.8;

 restart=createSprite(width/2,height/2+80);
 restart.addImage(restartImg);
 restart.scale=0.6
}

function draw(){
  background("yellow")
  console.log(frameRate());
 
  fill("red")
  text("score="+score,width-100,50);
 
  trex.collide(invisibleground); 

  if(gameState===1){
    score=score+Math.round(frameRate()/60);

    if(touches.length>0||keyDown("space")&&trex.y>148){
      trex.velocityY=-13 
      jumpSound.play();
      touches=[];
    }
       
    trex.velocityY+=0.8
    ground.velocityX=-(2+score/100)

        
    if(ground.x<0){
      ground.x=ground.width/2
    }
    spawnClouds();
    spawnObstacles();

    if(obstaclesGroup.isTouching(trex)){
      gameState=2;
      dieSound.play();
     //trex.velocityY=-14
    }
    gameOver.visible=false;
    restart.visible=false;

    if(score%300===0 && score>0){
     checkpointSound.play();
    }
  }

  else if(gameState===2){
    ground.velocityX=0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    gameOver.visible=true;
    restart.visible=true;
    cloudsGroup.setLifetimeEach(-1);
    obstaclesGroup.setLifetimeEach(-1);
    trex.changeAnimation("collided");
    trex.velocityY=0;
    if(mousePressedOver(restart)||touches.length>0){
      reset();
    }
  }

  drawSprites();
}

function spawnClouds(){
  if(frameCount%60===0){
    cloud=createSprite(width,100,40,10);
    cloud.velocityX=-3
    cloud.addImage(cloudImage);
    cloud.scale=0.6
    cloud.y=random(100,250);
    cloud.depth=trex.depth
    trex.depth+=1
    cloud.lifetime=width/3
    cloudsGroup.add(cloud);
  }

}
function spawnObstacles(){
  if(frameCount%80===0){
    obstacle=createSprite(width,height-165,10,40);
    obstacle.velocityX=-(5+score/150);
    obstacle.scale=0.5
    obstacle.lifetime=width/5
    var rand=Math.round(random(1,6));
    switch(rand){
      case 1:obstacle.addImage(obstacle1)
      break
      case 2:obstacle.addImage(obstacle2)
      break
      case 3:obstacle.addImage(obstacle3)
      break
      case 4:obstacle.addImage(obstacle4)
      break
      case 5:obstacle.addImage(obstacle5)
      break
      case 6:obstacle.addImage(obstacle6)
      break
      default:break
    }
    obstaclesGroup.add(obstacle);
  }
}
function reset(){
  gameState=1;
  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();
  trex.changeAnimation("trex");
  score=0;
}