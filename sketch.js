const width = 400;
const height = 600;
const ground_height = 102;

let bgimg;
let groundimg;
let ground;
let pipes = [];
let gameState = 'wait';
let score = 0;

function preload(){
    bgimg = loadImage("assets/flappy-bg.png");
    groundimg = loadImage("assets/flappy-ground.png");

    font = loadFont("assets/Pixelfy.ttf");

    pipeup_img = loadImage("assets/pipe-upward.png");
    pipedown_img = loadImage("assets/pipe-downward.png");
    birdsheet = loadImage("assets/flappy-birdsprite.png");
}

function setup() {
    createCanvas(width, height);

    textFont(font);
    ground = new Ground();
    bird = new Bird();
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
        }

        if(pipe.birdCollided(bird)){
            //gameState = 'end';
            console.log("collide");
        }
    })
}

function mousePressed() {
    bird.flap();
}

function draw() {
    background(bgimg);

    if(gameState == 'wait'){
        fill(255);
        textSize(40);
        text('FLAPPY BIRD', 80, 250);
        textSize(15);
        text('Press to start...', width/2 - 20, height/2);
        if(mouseIsPressed){
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
    }
    else if(gameState == 'end'){
        ground.stop();
        textSize(30);
        text("GAME OVER", 120, 200);
        textSize(20);
        text("Final Score: " + score, 125, 250);
        textSize(15);
        text("Press to try again...", 120, 300);
        if(mouseIsPressed){
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
        this.gap = 50;
        this.x = width;
        this.y = random(180, 320);

        this.passCount = false;

        this.scaledWidth = this.SCALE * pipeup_img.width;
        this.scaledHeight = this.SCALE * (pipeup_img.height - 150);

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
    getPipeUpBottom(){
        return this.y + this.scaledHeight;
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
/*        let cx = bird.x + (bird.scaledHeight/2);
        let cy = bird.y + (bird.scaledHeight/2);
        let dia = bird.scaledHeight * 1.5;

        let collidePipeTop = collideRectCircle(this.x, this.topPos, this.scaledWidth, this.scaledHeight, cx, cy, dia);
        let collidePipeBottom = collideRectCircle(this.x, this.y, this.scaledWidth, this.scaledHeight, cx, cy, dia);

        return collidePipeTop || collidePipeBottom;
*/
        if((bird.y < this.getPipeDownBottom()) || (bird.y > this.y)){
            if((bird.x > this.x) && (bird.x < this.x + this.scaledWidth)){
                return true;
            }
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
        this.flap_strength = 15;
        this.scaledHeight = this.scale * birdsheet.height;
    }

    getX(){
        return this.x;
    }

    getY(){
        return this.y;
    }

    flap(){
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
        this.jump_velocity *= 0.9;

        this.y += this.jump_velocity;
        if(this.y + this.scaledHeight > height - ground_height){
            this.y = height - ground_height - this.scaledHeight / 2;
            gameState = 'end';
        }
        else if( this.y < 0)
        {
            this.y = 0;
            gameState = 'end';
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

collideRectCircle = function (rx, ry, rw, rh, cx, cy, diameter) {
    //2d
    // temporary variables to set edges for testing
    let testX = cx;
    let testY = cy;
   // which edge is closest?
    if (cx < rx) {
    testX = rx; // left edge
    } else if (cx > rx + rw) {
    testX = rx + rw;
    } // right edge
   if (cy < ry) {
    testY = ry; // top edge
    } else if (cy > ry + rh) {
    testY = ry + rh;
    } // bottom edge
   // // get distance from closest edges
    var distance = this.dist(cx, cy, testX, testY);
    console.log("dist:" + distance + ',' + "dia: " + diameter);
   // if the distance is less than the radius, collision!
    if (distance <= diameter) {
    return true;
    }
    return false;
   };