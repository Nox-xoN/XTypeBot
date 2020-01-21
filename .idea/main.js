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

var gameObjs = new Array(2500);
var bulletObjs = new Array(500);
//

class ContainerHlpr {
    getBulletObjects() {
        ArrHlpr.clearArr(bulletObjs);
        for (var i = 0; i < gameObjs.length; i++) {
            try {
                if (gameObjs[i].image != undefined) {
                    if (gameObjs[i].size.x == 8 && gameObjs[i].size.y == 8) {
                        bulletObjs[i] = new Bullet(ig.game.entities[i].pos.x, ig.game.entities[i].pos.y, ig.game.entities[i].size.x, ig.game.entities[i].size.y);
                    } else if (gameObjs[i].size.x == 16 && gameObjs[i].size.y == 16) {
                        bulletObjs[i] = new Bullet(ig.game.entities[i].pos.x, ig.game.entities[i].pos.y, ig.game.entities[i].size.x, ig.game.entities[i].size.y);
                    }
                }
            } catch (err) {
            }
        }
        //ArrHlpr.tidyupArr(bulletObjs);
    }

    refreshGameObjects() {
        ArrHlpr.clearArr(gameObjs);
        //var gameObjects = new Array(ig.game.entities.length);
        for (var i = 0; i < ig.game.entities.length; i++) {
            gameObjs[i] = ig.game.entities[i];
        }
        this.getBulletObjects()
    }
}

class ArrHlpr {
    static clearArr(arr) {
        for (var i = 0; i < arr.length; i++) {
            arr[i] = null;
        }
        return arr;
    }

    static addElement(arr, el) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == null) {
                arr[i] = el;
            }
        }
        return arr;
    }

    static removeElement(arr, el) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == el) {
                null;
            }
        }
        return arr;
    }

    static getFreeElements(arr) {
        var empty = 0;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == null) {
                empty++;
            }
        }
        return empty;
    }

    static getFullElements(arr) {
        var Full = 0;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] != null) {
                Full++;
            }
        }
        return Full;
    }

    static tidyupArr(arr) {
        for (var i = 0; i < arr.length; i++) {
            var lastEmpty = 0;
            var nextFull = 0;
            if (arr[i] == null) {
                lastEmpty = i;
                for (var j = i; j < arr.length; j++) {
                    if (arr[j] != null) {
                        nextFull = j;
                        break;
                    }
                }
                if (lastEmpty != nextFull)
                    arr[lastEmpty] == arr[nextFull];
                arr[j] = null;
            }
        }
        return arr;
    }
}

class Draw {
    vHitbox(lHitbox) {
        canContext.clearRect(0, 0, canvas.width, canvas.height); //löscht den canvas
        canContext.beginPath();
        canContext.rect(lHitbox.x, lHitbox.y, lHitbox.width, lHitbox.height);
        canContext.stroke();

        canContext.beginPath();
        canContext.moveTo(Maths.getClosest().pos.x, Maths.getClosest().pos.y);
        canContext.lineTo(player.x, player.y);
        canContext.stroke();
    }

    update(lHitbox) {
        this.vHitbox(lHitbox);
    }
}

class Maths {
    static getClosest() {
        var closest = ig.game.heart;
        for (var i = 1; i < ig.game.entities.length; i++) {
            if (ig.game.entities[i].image != undefined) {
                if (ig.game.entities[i].image.path == ["media/sprites/pbullet.png"] || ig.game.entities[i].image.path == ["media/sprites/bullet.png"]) {
                    if (ig.game.player.distanceTo(closest) > ig.game.player.distanceTo(ig.game.entities[i])) {
                        closest = ig.game.entities[i];
                    }
                }
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
        this.pHitbox = new lHitbox(this.x, this.y, 75, 75);
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

    dodge() {
        if (Maths.getClosest().pos.x > this.pHitbox.x && Maths.getClosest().pos.x < this.pHitbox.x + this.pHitbox.width && Maths.getClosest().pos.y > this.pHitbox.y && Maths.getClosest().pos.y < this.pHitbox.y + this.pHitbox.height) {
            if (Maths.getClosest().pos.x < this.x) {
                ig.game.player.pos.x = this.x + 1
            } else {
                ig.game.player.pos.x = this.x - 1
            }
        } else {
            if (this.x > 480 / 2 + 5) {
                ig.game.player.pos.x = this.x - 1;
            } else if (this.x < 480 / 2 - 5) {
                ig.game.player.pos.x = this.x + 1;
            }
        }
    }
}

class Bullet {
    Bullet(x,y,width,height) {
        this.height;
        this.width;
        this.x;
        this.y;
        this.bHitbox = new lHitbox();
    }

    draw() {
        try {
            this.bHitbox.update(this);
        } catch (err) {
        }
    }
}

class lHitbox {
    constructor() {
        this.height;
        this.width;
        this.x;
        this.y;
        this.draw = new Draw();
    }

    update(obj) {
        this.x = obj.x - (this.width / 2) + obj.width;
        this.y = obj.y - (this.height / 2) + obj.height;

        this.draw.update(this);
    }
}

function autoclick() {
    player.shoot();
}

var aClickCall = setInterval(autoclick, 50);

function aimbot() {
    ig.input.mouse.x = ig.game.heart.last.x + 34;
    ig.input.mouse.y = ig.game.heart.last.y + 44;
}


var player = new Player();
var cHlpr = new ContainerHlpr();

function main() {
    cHlpr.refreshGameObjects();
    player.update();

    for (var i = 0; i < bulletObjs.length; i++) {
        try {
            if (bulletObjs[i] != undefined)
                bulletObjs[i].draw();
        } catch (err) {

        }

    }

    aimbot();
    player.dodge();
}

var mCall = setInterval(main, 10);


