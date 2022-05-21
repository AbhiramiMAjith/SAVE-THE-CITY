
const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

var engine, world

var gamestate = 'start'

var bgImg
var startbtn
var ghost, ghostImg, ghostFell
var door, doorImg
var rope, rope2
var cut_btn1, cut_btn2
var axe, axe2, axe3
var link, link2
var axeImg
var balloon, bubble, bubbleImg
var ground
var winImg
var axeNum = 1

var bgMusic, air
var cutRopeSound, bubbleBurst

function preload ()
{
  bgImg = loadImage ("./assets/image/background.jpg")
  ghostImg = loadImage ("./assets/image/ghost.png")
  ghostFell = loadImage ("./assets/image/ghost fell.png")
  doorImg = loadImage ('./assets/image/door.png')
  axeImg = loadImage ('./assets/image/axe.png')
  bubbleImg = loadImage ('./assets/image/bubble.png')
  bgMusic = loadSound ("./assets/sound/spooky.wav")
  air = loadSound ("./assets/sound/air.wav")
  laughingSound = loadSound ("./assets/sound/background_music_2.mp3")
  cutRopeSound = loadSound ("./assets/sound/rope_cut.mp3")
  bubbleBurst = loadSound ("./assets/sound/bubbleBurst.wav")
  winningSound = loadSound ("./assets/sound/applauding.wav")
}

function setup() {
  createCanvas(1200,800);

  engine = Engine.create();
  world = engine.world;

  startbtn = createImg ("./assets/image/Start.png")
  startbtn.position (340,575)
  startbtn.size  (525,150)
  startbtn.mouseClicked (start)

  ghost = createSprite (1110, 700, 150, 150)
  ghost.scale = 0.4
  ghost.addAnimation ("ghost", ghostImg)
  ghost.addAnimation ("ghostFell", ghostFell)

  door = Bodies.rectangle (50, 650, 175, 275, 
    {
      isStatic : true
    })
  World.add (world, door)

  ground = new Ground (600 ,800, 900, 50)

  rope = new Rope (10, {x : 250, y: 120})
  rope2 = new Rope (11, {x : 950, y: 120})

  cut_btn1 = createImg ('./assets/image/cut button.png')
  cut_btn1.position (-250, -80)
  cut_btn1.size (50, 50)
  cut_btn1.mouseClicked (cutRope1)

  cut_btn2 = createImg ('./assets/image/cut button.png')
  cut_btn2.position (-950, -80)
  cut_btn2.size (50, 50)
  cut_btn2.mouseClicked (cutRope2)

  axe = Bodies.rectangle (620,300,35,35,
    {
      restitution : 0,
    })
  Composite.add (rope.body, axe)
  Composite.add (rope2.body, axe)

  link = new Link (rope, axe)
  link2 = new Link (rope2, axe)

  axe2 = createSprite (300, 420)
  axe2.addImage (axeImg)
  axe2.scale = 0.2
  axe2.visible = false

  axe3 = createSprite (620, 100)
  axe3.addImage (axeImg)
  axe3.scale = 0.2
  axe3.visible = false

  balloon = createImg ('./assets/image/balloon.png')
  balloon.position (-100, -200)
  balloon.size (180, 150)
  balloon.mouseClicked (blow)

  bubble = createSprite (1000, 400)
  bubble.addImage (bubbleImg)
  bubble.scale = 0.17
  bubble.visible = false
}

function draw() 
{
  background(bgImg);
  Engine.update(engine);
  drawSprites ()
  rectMode (CENTER)
  imageMode (CENTER)

  //console.log (engine.world.gravity.y)
  //console.log (axe.position.y)

  fill ("white")
  textSize (30)
  text ("No of Axes : " + axeNum, 50, 75)

  bgMusic.play ()
  bgMusic.setVolume (0.02)

  if (gamestate == "start")
  {
    fill ('#ffe08a')
    textSize (50)
    text("INSTRUCTIONS!!",400,200)

    fill ("white")
    textSize (25)
    text ("YOU HAVE TO KILL THE GHOST IN THE ROOM BEFORE IT REACHES THE DOOR! ",15,300)
    text ("TO DO SO, YOU HAVE TO COLLECT ALL THE 3 AXES AND DROP THEM ON THE GHOST!",15,375)
    text ('PRESS SPACE FOR BLOWING AIR', 15, 450)

    fill ("#ffe08a")
    textSize (35)
    text ("Click on START to begin",400,550)
  }

  if (gamestate == 'play')
  {
    if (collide (axe, ghost, 80) === false)
    {
      ghost.velocityX = -2
    }
    image (doorImg,door.position.x, door.position.y, 300, 350)

    rope.show ()
    rope2.show ()

    cut_btn1.position (250, 70)
    cut_btn2.position (950, 75)

    push ()
    imageMode (CENTER)
    if (axe != null)
    {
      image (axeImg, axe.position.x, axe.position.y, 120, 130)
    }
    pop ()
    axe2.visible = true
    axe3.visible = true

    balloon.position (400, 300)
    bubble.visible = true

    if (collide (axe, ghost, 80) === true)
    {
      if (axeNum == 3)
      {
        World.remove (engine.world, axe)
        axe = null
        ghost.velocityX = 0
        ghost.changeAnimation ("ghostFell")
        ghost.scale = 0.45
        gamestate = 'won'
      }
      else 
      {
        gamestate = "end"
      }
    }

    if (collide (axe, bubble, 40) === true)
    {
      bubble.scale = 0.2
      bubble.position.x = axe.position.x
      bubble.position.y = axe.position.y
      engine.world.gravity.y = -0.1

      setInterval(() => {
        engine.world.gravity.y = 1
        if (bubble != undefined)
        {
          bubble.destroy ()
        }
      }, 3000);
    }

    if (collide (axe, axe2, 50) === true)
    {
      axe2.x = -500
      axeNum += 1
    }

    if (collide (axe, axe3, 50) === true)
    {
      bubble.destroy ()
      bubbleBurst.play ()
      axe3.x = -800
      engine.world.gravity.y = 1
      axeNum += 1
    }

    if (collide (ghost, door, 100) === true)
    {
      gamestate = "end"
    }

    if (axe!= undefined && axe.position.y >= 760)
    {
      gamestate = "end"
    }
  }

  if (gamestate == "end")
  {

    balloon.remove ()
    cut_btn1.remove ()
    cut_btn2.remove ()

    if (axe != undefined)
    {
      World.remove (world, axe)
      axe = null
    }
    if (axe2 != undefined)
    {
      axe2.visible = false
    }
    if (axe3 != undefined)
    {
      axe3.visible = false
    }
    if (bubble != undefined)
    {
      bubble.visible = false
    }
    
    ghost.velocityX = 0
    ghost.scale = 0.7
    ghost.x = 600
    ghost.y = 400
    fill ('black')
    textSize (30)
    text ("OOPS! GHOST WON...", 530, 650)
  }

  if (gamestate == 'won')
  {
    balloon.remove ()
    cut_btn1.remove ()
    cut_btn2.remove ()

    winImg = createImg ('./assets/image/win.png')
    winImg.position (350, 200)
    winImg.size (500, 400)

    fill ('black')
    textSize (30)
    text ('YOU HAVE KILLED THE GHOST AND SAVED THE TOWN!!',200, 600)
    text ('CONGRATULATIONS !!',450, 700)

    bgMusic.stop ()
  }
}

function start ()
{
  gamestate = "play"
  startbtn.remove ()
}

function cutRope1 ()
{
  cutRopeSound.play ()
  rope.break ()
  link.dettach ()
  link = null
}

function cutRope2 ()
{
  cutRopeSound.play ()
  rope2.break ()
  link2.dettach ()
  link2 = null
}

function collide (bodyA, bodyB, distValue)
{
  if (bodyA != null)
  {
    var distance = dist (bodyA.position.x, bodyA.position.y, bodyB.position.x, bodyB.position.y)
    if (distance <= distValue)
    {
      return true
    }
    else
    {
      return false
    }
  }
}

function blow ()
{
  air.play ()
  Body.applyForce (axe, { x : 0, y : 0}, {x : 0.08, y : 0.02})
}

function keyPressed ()
{
  if (keyCode === 32 && gamestate == "play")
  {
    blow ()
  }
}