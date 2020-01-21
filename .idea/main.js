var canvas = document.createElement("canvas");
var canContext = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.height = 720;
canvas.width = 480;
canvas.style.margin = "auto"
canvas.style.position = "absolute"
canvas.style.top = "0"
canvas.style.left = "0"
canvas.style.right = "0"
canvas.style.zIndex = "80"
canvas.style.display = "block"
canvas.style.border = "1px solid #555"
canvas.style.bottom = "0"

class Draw {
    Draw() {
    }

    vHitbox(lHitbox) {
        canContext.clearRect(0, 0, canvas.width, canvas.height); //löscht den canvas
        canContext.beginPath();
        canContext.rect(lHitbox.x, lHitbox.y, lHitbox.width, lHitbox.height);
        canContext.stroke();

        for(var i = 0; i < projectiles.length; i++ ){
            canContext.beginPath();
            canContext.rect(lHitboxes[i].x, lHitboxes[i].y, lHitboxes[i].width, lHitboxes[i].height);
            canContext.stroke();
        }

        canContext.beginPath();
        canContext.rect(225, 645, 30, 10);
        canContext.stroke();

        try {
            canContext.beginPath();
            canContext.moveTo(Maths.getClosest().pos.x + (Maths.getClosest().size.x / 2), Maths.getClosest().pos.y + (Maths.getClosest().size.y / 2));
            canContext.lineTo(player.x, player.y);
            canContext.stroke();
        }
        catch(err) {
        }

    }

    update(lHitbox) {
        this.vHitbox(lHitbox);
    }
}

function filterList(){
    var c = 0
    for (var i = 5; i < ig.game.entities.length; i++){
        if(ig.game.entities[i].hasOwnProperty("image") == true){
            if (ig.game.entities[i].image.path == ["media/sprites/pbullet.png"] || ig.game.entities[i].image.path == ["media/sprites/bullet.png"]) {
                projectiles[c] = ig.game.entities[i];
                c++
            }
        }
    }
}


class Maths {
    static getClosest() {
        var closest = ig.game.heart;
        for (var i = 1; i < projectiles.length; i++) {
            if(ig.game.entities[i].pos.y < player.y +2)
                if (ig.game.player.distanceTo(closest) > ig.game.player.distanceTo(ig.game.entities[i])) {
                    closest = ig.game.entities[i];
                }
        }
        return closest;
    }
}

class Player {
    constructor() {
        this.x;
        this.y;
        this.width;
        this.height;
        this.pHitbox = new lHitbox(this.x, this.y, 65, 65);
    }

    update() {
        this.x = ig.game.player.pos.x;
        this.y = ig.game.player.pos.y;
        this.width = ig.game.player.size.x;
        this.height = ig.game.player.size.y;
        this.pHitbox.update(this);
    }

    shoot() {
        ig.game.player.shoot();
    }

    dodge()
    {
        if(Maths.getClosest().pos.x > this.pHitbox.x && Maths.getClosest().pos.x < this.pHitbox.x + this.pHitbox.width && Maths.getClosest().pos.y > this.pHitbox.y && Maths.getClosest().pos.y < this.pHitbox.y + this.pHitbox.height)
        {
            if(Maths.getClosest().pos.x < this.x)
            {
                ig.game.player.pos.x = this.x + 1
            } else {
                ig.game.player.pos.x = this.x - 1
            }
        } else {
            if(this.x > 480/2 + 15 )
            {
                ig.game.player.pos.x = this.x - 0.5;
            }
            else if(this.x < 480/2 - 15)
            {
                ig.game.player.pos.x = this.x + 0.5;
            }
        }
    }
}

function aimbot() {
    if(Maths.getClosest().image.path == ["media/sprites/bullet.png"] && ig.game.player.distanceTo(Maths.getClosest()) < 50){
        ig.input.mouse.x = Maths.getClosest().pos.x + (Maths.getClosest().size.x /2);
        ig.input.mouse.y = Maths.getClosest().pos.y + (Maths.getClosest().size.y /2);
    } else {
        ig.input.mouse.x = ig.game.heart.last.x + (ig.game.heart.size.x /2);
        ig.input.mouse.y = ig.game.heart.last.y + (ig.game.heart.size.y /2);
    }
}

function autoclick() {
    player.shoot();
}

class lHitbox {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.draw = new Draw();
    }

    update(player) {
        this.x = player.x - (this.width / 2) + player.width;
        this.y = player.y - (this.height / 2) + player.height;

        this.draw.update(this);
    }
}

function setup(){
    for (var i = 0; i < projectiles.length; i++){
        var x = projectiles[i].pos.x;
        var y = projectiles[i].pos.y;
        var width = projectiles[i].size.x;
        var height = projectiles[i].size.y;
        lHitboxes[i] = new lHitbox(x, y, width, height);
    }
}


function main() {
    filterList();
    setup();
    player.update();
    player.dodge();
    aimbot();
}

let projectiles = []
let lHitboxes = []
let player = new Player();

//var aClickCall = setInterval(autoclick, 50);
var mCall = setInterval(main, 10);

ig.music.volume = 0
ig.Sound.enabled = false