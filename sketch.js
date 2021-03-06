//https://youtube.com/shorts/lrZNcRkdIEE?feature=share
//Sleepy Bird - A Flappy Bird remake
//Gameplay using Arduino push button. Game ends whenever bird hit pipes or top and bottom edge of the canvas.
let serialPDM;
let portName = "COM3";
let sensor;

const width = 400;
const height = 600;
const ground_height = 102;

let bgimg;
let groundimg;
let ground;
let pipes = [];
let gameState = 'wait';
let score = 0;

let buffer = new Tone.Buffer("/assets/sfx_die.mp3");
let dieSound = new Tone.Player(buffer).toDestination();
let flapEffect = new Tone.Distortion({
    "wet": 0.2,
    "distortion": 0.08
});
let flapSound = new Tone.NoiseSynth({
    noise: {
        type: "pink",
        playbackRate: 0.1,
        volume: -30,
    },
    envelope: {
        attack: 0.2,
        decay: 0,
        sustain: 0,
        release: 2.5
    }
}
).connect(flapEffect).toDestination();

let scoreEffect = new Tone.Chorus({
    "frequency": 0.2,
    "delayTime": 10,
    "type": "sine",
    "depth": 1,
    "feedback": 0.45,
    "spread": 180,
    "wet": 0.5
});
let scoreSound = new Tone.FMSynth({
    "harmonicity":8,
    "volume": -20,
    "modulationIndex": 2,
    "oscillator" : {
        "type": "sine"
    },
    "envelope": {
        "attack": 0.001,
        "decay": 2,
        "sustain": 0.1,
        "release": 2
    },
    "modulation" : {
        "type" : "square"
    },
    "modulationEnvelope" : {
        "attack": 0.002,
        "decay": 0.2,
        "sustain": 0,
        "release": 0.1
    }
}).connect(scoreEffect).toDestination();

let sound = [{"time": 0, "note": "E6"},
            {"time": 0.2, "note": "F6"}];
let part = new Tone.Part(function(time, note){
    scoreSound.triggerAttackRelease(note, "8n", time);
}, [[0, "E6"], [0.2, "F6"]]).start(0);

function preload(){
    bgimg = loadImage("assets/flappy-bg.png");
    groundimg = loadImage("assets/flappy-ground.png");

    font = loadFont("assets/Pixelfy.ttf");

    pipeup_img = loadImage("assets/pipe-upward.png");
    pipedown_img = loadImage("assets/pipe-downward.png");
    birdsheet = loadImage("assets/flappy-birdsprite.png");
}

function setup() {
    serialPDM = new PDMSerial(portName);
    sensor = serialPDM.sensorData;

    createCanvas(width, height);

    textFont(font);
    ground = new Ground();
    bird = new Bird();
}

function mousePressed(){
    Tone.start();
}
function pipesCreate(){
    if(frameCount % 60 === 0){
        pipe = new Pipes();
        pipes.push(pipe);
    }

    pipes.forEach((pipe, i) => {
        pipe.move();
        if(pipe.off()){
            pipes.splice(i, 1);
        }
        
        if(pipe.birdPassed(bird) && !pipe.passCount){
            score++;
            pipe.passCount = true;
            Tone.Transport.start(Tone.now() + 0.1);
            Tone.Transport.stop(Tone.now()+ 0.8);
        }

        if(pipe.birdCollided(bird) && !pipe.collided){
            gameState = 'end';
            console.log("collide");
            pipe.collided = true;
            serialPDM.transmit("hit", 1);
            dieSound.start();
        }
    })
}

function joyPressed() {
        bird.flap();
}

function draw() {
    background(bgimg);
    let pressed = 0;
    if(sensor.state == 1){
        pressed = sensor.state;
        flapSound.triggerAttackRelease("16n", Tone.now());
    }
    else
    {
        pressed = 0;
    }


    console.log(sensor.state, pressed);

    if(gameState == 'wait'){
        fill('#b16e4b');
        textSize(40);
        text('SLEEPY BIRD', 80, 250);
        textSize(15);
        text('Press to start...', width/2 - 20, height/2);
        if(pressed == 1){
            gameState = 'playing';
        }
    }
    else if(gameState == 'playing'){
        bird.show();
        pipesCreate();
        for(i = 0; i< pipes.length; i++){
            pipes[i].show();
        }
        textSize(20);
        text('Score: ' + score, 20, 20);

        if(pressed == 1){
            joyPressed();
        }

    }
    else if(gameState == 'end'){
        ground.stop();
        textSize(30);
        text("GAME OVER", 120, 200);
        textSize(20);
        text("Final Score: " + score, 125, 250);
        textSize(15);
        text("Press to try again...", 120, 300);
        if(pressed == 1){
            gameState = 'playing';
            score = 0;
            pipes = [];
            bird = new Bird();
        }
    }

    ground.move();
    ground.show();

}

class Ground{
constructor(){
    this.velocity = 4;
    this.x1 = 0;
    this.x2 = width;
    this.y = height - ground_height;
}

stop(){
    this.velocity = 0;
};

move(){
    this.x1 -= this.velocity;
    this.x2 -= this.velocity;
    if(this.x1 <= -width){
        this.x1 = width;
    }
    if(this.x2 <= -width) {
        this.x2 = width;
    }
}

show(){
    image(groundimg, this.x1, this.y, width, groundimg.height);
    image(groundimg, this.x2, this.y, width, groundimg.height);
}
}

class Pipes{
    constructor(){
        this.SCALE = 0.75;
        this.velocity = 4;
        this.gap = 200;
        this.x = width;
        this.y = random(230, 400);

        this.passCount = false;
        this.collided = false;

        this.scaledWidth = this.SCALE * pipeup_img.width;
        this.scaledHeight = this.SCALE * pipeup_img.height;

        this.topPos = this.y - this.scaledHeight - this.gap;
    }

    getLeftCorner(){
        return this.x;
    }
    getPipeDownBottom(){
        return this.topPos + this.scaledHeight;
    }

    getRightCorner(){
        return this.x + this.scaledWidth;
    }

    show(){
        image(pipeup_img, this.x, this.y, this.scaledWidth, this.scaledHeight);
        image(pipedown_img, this.x, this.topPos, this.scaledWidth, this.scaledHeight);
    }

    move(){
        this.x -= this.velocity;
    }

    off(){
        return this.x < -this.scaledWidth;
    }

    birdPassed(bird){
        return bird.x > this.x + Math.floor(this.scaledWidth / 2);
    }

    birdCollided(bird){
        if(bird.y < this.getPipeDownBottom() || bird.y > this.y){
            if((bird.x > this.x) && (bird.x < this.x + this.scaledWidth)){
                return true;
            }
            else
                return false;
        }
        else
            return false;
    }
}

class Bird{
    constructor(){
        this.scale = 0.9;
        this.x = width/3;
        this.y = height/2;
        this.gravity = 0.9;
        this.jump_velocity = 0;
        this.rotation = 0;
        this.flap_strength = 3;
        this.scaledHeight = this.scale * birdsheet.height;
        this.flapstate = 0;
    }

    getFlapState(){
        return this.flapstate;
    }

    getX(){
        return this.x;
    }

    getY(){
        return this.y;
    }

    flap(){
        this.flapstate = 1;
        this.jump_velocity += -this.flap_strength;
    }

    show(){
        let sx = bird.animate();
        push();
        imageMode(CENTER);
        translate(this.x, this.y);
        rotate(this.rotation);
        image(birdsheet, 0, 0, this.scaledHeight, this.scaledHeight, 60 * sx, 0, 60, 60);
        pop();
    }

    animate(){
        this.jump_velocity += this.gravity;
        this.flapstate = 0;
        this.jump_velocity *= 0.9;

        this.y += this.jump_velocity;
        if(this.y + this.scaledHeight > height - ground_height){
            this.y = height - ground_height - this.scaledHeight / 2;
            gameState = 'end';
            serialPDM.transmit("hit", 1);
            dieSound.start(Tone.now() + 0.2);
        }
        else if( this.y < 0)
        {
            this.y = 0;
            gameState = 'end';
            serialPDM.transmit("hit", 1);
            dieSound.start(Tone.now() + 0.2);
        }

        this.rotation = map(this.jump_velocity, -10, 20, -0.7, 0.7);
        if(this.jump_velocity == 0){
            this.rotation = 0;
        }
        let sx;
        if(this.rotation > 0){
            sx = 2;
        }
        else if(this.rotation < 0){
            sx = 0;
        }
        else sx = 1;
        return sx;
    }
}