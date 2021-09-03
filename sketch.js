var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloud, cloudImage, cloudsGroup;
var obstacle, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6, obstaclesGroup;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");

  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  
  restartImg = loadImage("restart.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(600, 200);
  
  //Declaramos una variable dentro de la funcion setup
  var message = "This is a message";
  //La imprimimos en la consola. ¿Cuantas veces se imprime?
  console.log(message)

  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.6;

  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;

  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  
  //Creamos sprite para game over
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  
  //Creamos sprite para restart
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  restart.visible = false;
  
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  trex.setCollider("circle",0,0,40);
  trex.debug = true;
  
  score = 0;
}

function draw() {
  background("rgb(163,222,216)");
  text("Score: "+ score, 500,50);
  
  if(gameState == PLAY) {
    //Agregamos velocidad al suelo conforme suman puntos
    ground.velocityX = -(6 + score/100);
    
  score = score + Math.round(frameCount/60);
  //Agregamos sonido cada 100 puntos
  if(score > 100 && score%100 === 0) {
    checkPointSound.play();
  }

  if (ground.x < 0) {
    ground.x = ground.width / 2;
  }

  if (keyDown("space") && trex.y>150) {
    trex.velocityY = -10;
    //Asignamos sonido cuando el trex brinca
    jumpSound.play();
  }

  trex.velocityY = trex.velocityY + 0.5

  spawnClouds();
  spawnObstacles();
    
    if(trex.isTouching(obstaclesGroup)) {
      dieSound.play();
      gameState = END;
    }
  }
  else if(gameState == END) {
    gameOver.visible = true;
    restart.visible = true;
    
    ground.velocityX = 0;

    trex.velocityY = 0;
    
    trex.changeAnimation("collided", trex_collided);
    
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
  }
  
  trex.collide(invisibleGround);
  
  //Damos instruccion al programa de que reinicie al dar clic sobre el sprite de restart, siempre que el estado de juego sea FIN
  if(mousePressedOver(restart) && gameState === END){
    //Imprimimos un msg cuando se da clic
    console.log("Reinicia el juego")
    //Funcion para indicarle al programa que reinicie
    reset();
  }
   
  drawSprites();
}

function spawnObstacles(){
  if(frameCount % 60 === 0){
    obstacle = createSprite(600,165,10,40);
    //Incrementamos la velocidad de los obstaculos conforme avanza el programa
    obstacle.velocityX = -(6 + score/100);
    
    var rand = Math.round(random(1,6));
    switch(rand){
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
    
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    
    obstaclesGroup.add(obstacle);
  }
}

function spawnClouds(){
  if(frameCount % 60 === 0){
    cloud = createSprite(600,80,40,20);
    cloud.addImage("cloud", cloudImage);
    cloud.scale = 0.65;
    cloud.y = Math.round(random(20,100))
    cloud.velocityX = -3;
    
    cloud.lifetime = 200;

    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    cloudsGroup.add(cloud);
  }    
}  

//Definimos el codigo para la funcion de reset
function reset() {
  //El estado de juego vuelve a JUGAR
  gameState = PLAY;
  //Desaparecen las imagenes de game over y restart
  gameOver.visible = false;
  restart.visible = false;
  //Destruimos los obstaculos y nubes al reiniciar
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  //Cambiamos la animacion del Trex de nuevo a running
  trex.changeAnimation("running", trex_running);
  //Reiniciamos el marcador, que aumenta cada 60 cuadros
  score = 0;
  score = score + Math.round(getFrameRate()/60);
}