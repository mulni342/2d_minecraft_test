var { Vector } = require("./Vector");

class Constroller {
    constructor(geometry) {
        this.player = geometry;
        this.objects;
        this.canvas;
        this.keys = {};
        this.aspeed = 0.4;
        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);
        this.acceleration.limit = 0.5;
        this.velocity.limit = 15;
        this.canJump = false;

        window.addEventListener("keydown", (e) => { this.keys[e.code] = true });
        window.addEventListener("keyup", (e) => { this.keys[e.code] = false });
    }

    gravity(ctime) {

        this.acceleration.add(new Vector(0, 0.3 * ctime));

        this.objects.forEach(obj => {
            if (obj != this.player) {
                if ((this.player.position.y + this.player.size.y >= obj.position.y && this.player.position.y < obj.position.y + obj.size.y) &&    
                    (this.player.position.x + this.player.size.x >= obj.position.x && this.player.position.x < obj.position.x + obj.size.x ) ) {
                    this.player.position.y = obj.position.y - this.player.size.y;
                    this.canJump = true;
                }
            }
        });
    }

    update(ctime) {
        this.velocity.add(this.acceleration);
        this.player.position.add(this.velocity);
        this.gravity(ctime);

        if (this.keys.KeyD) {
            this.player.position.x += this.aspeed * ctime;
        }

        if (this.keys.KeyA) {
            this.player.position.x -= this.aspeed * ctime;
        }

        if (this.keys.Space) {
            if (this.canJump) {
                this.velocity.y = -10;
                this.canJump = false;
            } 
        }       
    }
}


module.exports = { Constroller }

