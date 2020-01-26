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
        canContext.font = "15px Arial";
        canContext.fillText("Level:" + ig.game.level.level, 10, 690);
        canContext.fillText("Lives:" + ig.game.lives, 10, 705);

        canContext.beginPath();
        canContext.rect(lHitbox.x, lHitbox.y, lHitbox.width, lHitbox.height);
        canContext.stroke();

        for(var i = 0; i < projectiles.length; i++ ){
            canContext.beginPath();
            canContext.rect(lHitboxes[i].x, lHitboxes[i].y, lHitboxes[i].width, lHitboxes[i].height);
            canContext.font = "11px Arial";
            canContext.fillText((Maths.distanceTo(projectiles[i]).toFixed(1) ), lHitboxes[i].x + 20, lHitboxes[i].y  +9);
            canContext.stroke();
        }

        try {
            canContext.beginPath();
            canContext.moveTo(Maths.getClosestProjectile().pos.x + (Maths.getClosestProjectile().size.x / 2), Maths.getClosestProjectile().pos.y + (Maths.getClosestProjectile().size.y / 2));
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
    var c = 0;
    var d = 0;
    for (var i = 0; i < ig.game.entities.length; i++){
        if(ig.game.entities[i].hasOwnProperty("image") == true){
            if (ig.game.entities[i].image.path == ["media/sprites/pbullet.png"] || ig.game.entities[i].image.path == ["media/sprites/bullet.png"]) {
                projectiles[c] = ig.game.entities[i];
                c++;
            }
            if (ig.game.entities[i].image.path == ["media/sprites/heart.png"] || ig.game.entities[i].image.path == ["media/sprites/plasmabox.png"]) {
                bossParts[d] = ig.game.entities[i];
                d++;
            }
        }
    }
}

class Maths {
    static getClosestProjectile(){
        var closestProjectile = dummy[0];
        for(var i = 0; i < projectiles.length; i++){
            if(projectiles[i].pos.y < player.y +2)
                if(Maths.distanceTo(closestProjectile) > Maths.distanceTo(projectiles[i])){
                    closestProjectile = projectiles[i];
                }
        }
        return closestProjectile;
    }
    static getClosestBossPart(){
        var closestBossPart = dummy[0];
        for(var i = 0; i < bossParts.length; i++){
            if(Maths.distanceTo(closestBossPart) > Maths.distanceTo(bossParts[i])){
                closestBossPart = bossParts[i];
            }
        }
        return closestBossPart;
    }
    static distanceTo (other){
    var xd = (player.x + player.width / 2) - (other.pos.x + other.size.x / 2);
    var yd = (player.y + player.height / 2) - (other.pos.y + other.size.y / 2);
    return Math.sqrt(xd * xd + yd * yd);
    }
}

function projectilesClenup(){
    for(var i = 0; i < projectiles.length; i++){
        if(projectiles[i].pos.x <= 0 || projectiles[i].pos.x >= 480 || projectiles[i].pos.y <= 0 || projectiles[i].pos.y >= 720){
            projectiles.splice([i],1);
            //console.log("Projectile Clenup");
        }
    }
}

function bossClenup(){
    for(var i = 0; i < bossParts.length; i++){
        if(bossParts[i]._killed){
            bossParts.splice([i],1);
            //console.log("Boss Clenup");
        }
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
        if(Maths.getClosestProjectile().pos.x + (Maths.getClosestProjectile().size.x / 2) > this.pHitbox.x && Maths.getClosestProjectile().pos.x + (Maths.getClosestProjectile().size.x / 2) < this.pHitbox.x + this.pHitbox.width && Maths.getClosestProjectile().pos.y + (Maths.getClosestProjectile().size.y / 2) > this.pHitbox.y && Maths.getClosestProjectile().pos.y + (Maths.getClosestProjectile().size.y / 2) < this.pHitbox.y + this.pHitbox.height)
        {
            if(Maths.getClosestProjectile().pos.x < this.x)
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
    if(Maths.getClosestProjectile().image.path == ["media/sprites/bullet.png"] && Maths.distanceTo(Maths.getClosestProjectile()) < 50){
        ig.input.mouse.x = Maths.getClosestProjectile().pos.x + (Maths.getClosestProjectile().size.x /2);
        ig.input.mouse.y = Maths.getClosestProjectile().pos.y + (Maths.getClosestProjectile().size.y /2);
    } else {
        ig.input.mouse.x = Maths.getClosestBossPart().pos.x + (Maths.getClosestBossPart().size.x /2);
        ig.input.mouse.y = Maths.getClosestBossPart().pos.y + (Maths.getClosestBossPart().size.y /2);
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

class Dummy {
    constructor(pos,size, image) {
        this.pos = {x:240,y:0};
        this.size = {x:1,y:1};
        this.image = {path:"media/sprites/pbullet.png"};
    }
}

function bHitbox(){
    for (var i = 0; i < projectiles.length; i++){
        var x = projectiles[i].pos.x;
        var y = projectiles[i].pos.y;
        var width = projectiles[i].size.x;
        var height = projectiles[i].size.y;
        lHitboxes[i] = new lHitbox(x, y, width, height);
    }
}

function main() {
    //Reinfolge esenziell wichtig NICHT ändern
    projectilesClenup();
    bossClenup();
    filterList();
    bHitbox();
    player.update();
    player.dodge();
    aimbot();
}

let projectiles = [];
let bossParts= [];
let dummy = [];
let lHitboxes = [];
let player = new Player();
dummy[0] = new Dummy();

var aClickCall = setInterval(autoclick, 50);
var mCall = setInterval(main, 10);

ig.music.volume = 0;
ig.Sound.enabled = false;