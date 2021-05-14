var { Vector } = require("./Vector");


class Camera {
    constructor(player) {
        this.player = player;
        this.canvas;
        this.objects;
        this.velocity = new Vector(0, 0);
        this.position = new Vector(0, 0);
        this.offset = new Vector(0, 0);
        this.acceleration_multiplicator = 0.02;
    }

    setCanvas(canvas) {
        this.canvas = canvas;
        this.updatePosition();
    }

    updatePosition() {
        this.position.x = (this.canvas.width / 2) - this.player.size.x / 2;
        this.position.y = (this.canvas.height / 2) - this.player.size.y / 2;
    }

    update(ctime) {
        this.updatePosition();
        
        var acceleration = Vector.subtract(this.player.position, this.position);
        acceleration.multiply(this.acceleration_multiplicator);

        this.offset.subtract(acceleration);

        this.objects.forEach(obj => {
            obj.position.subtract(acceleration);
        });

        this.acceleration_multiplicator = 0.02;
    }
}

module.exports = { Camera }