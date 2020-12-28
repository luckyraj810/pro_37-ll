//Create variables here

var dog,dogimg1,dogimg2;
var db;
var foods,foodstock;
var milk;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var changeState,readState;
var bedroom,garden,washroom;

var currenttime
function preload()
{
  //load images here
  dogimg1=loadImage("images/dogImg.png");
  dogimg2=loadImage("images/dogImg1.png");

  milk=loadImage("images/Milk.png");
  bedroom=loadImage("Bed Room.png");
  garden=loadImage("Garden.png");
  
washroom=loadImage("Wash Room.png");

}

function setup() {
  db=firebase.database();
  createCanvas(400, 600);

  foodObj=new Food();

  readState=db.ref("gamestate");
  readState.on("value",function(data){
    gamestate=data.val();
  });

  fedTime=db.ref("FeedTime");
fedTime.on("value",function (data){
  lastFed=data.val();
});
  
  dog=createSprite(800,200,150,150);
  dog.addImage(dogimg1);
  dog.scale=0.15;

  feed=createButton("feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  foodstock=db.ref('Food');
  foodstock.on("value",reads);
  textSize(20);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}


function draw() {  
//background(46, 139, 87);
//foodObj.display();



//fill(255,255,254);
//textSize(15);
//if (lastFed>=12){
  //text("Last Feed : "+lastFed%12+" PM",350,30);

//}
/*else if(lastFed==0){
  text("Last Feed : 12AM",350,30);
}
else{
  text("Last Feed : "+lastFed+" AM",350,30);
}*/

currenttime=hour();
if(currenttime==(lastFed+1)){
  update("playing");
  foodObj.garden();
}else if(currenttime==(lastFed+2)){
  update("sleeping");
  foodObj.bedroom();
}else if(currenttime>(lastFed+2) && currenttime<=(lastFed+4)){
  update("bathing");
  foodObj.washroom();
}else{
  update("hungry");
  foodObj.display();
}

if(gamestate!="hungry"){
  feed.hide();
  addFood.hide();
  dog.remove();
}else{
  feed.show();
  addFood.show();
  dog.addImage(dogimg1);
}
  drawSprites();
 

}

function reads(data){
foods=data.val();
foodObj.updateFoodStock(foods);
}
function feedDog(){
  dog.addImage(dogimg2);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  db.ref("/").update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gamestate:"hungry"
  })
}

function addFoods(){
  foods++;
  db.ref("/").update({
    Food:foods
  })

  
}

function update(State){
  db.ref("/").update({
    gamestate:State
  })
}



