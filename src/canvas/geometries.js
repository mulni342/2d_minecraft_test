var { Vector } = require("./Vector");

class Box {
    constructor(x, y, w, h, color, ctx) {
        this.position = new Vector(x, y);
        this.size = new Vector(w, h);
        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);
        this.uuid = Math.random();
        this.img;
        this.color;
        if (!color.includes("/")) {
            this.color = color;
        } else {
            let img = document.createElement("img"); img.src = color;
            this.img = img;
        }
        this.ctx = ctx;
    }

    draw() {
        if (this.img == undefined) {
            this.ctx.fillStyle = this.color;
            this.ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y); 
        } else {
            this.ctx.drawImage(this.img, this.position.x, this.position.y, this.size.x, this.size.y);
        }

    }
    
    setImage(img) {
        this.img = img; 
    }

    setImageSrc(img1) {
        let img = document.createElement("img"); img.src = img1;
        this.img = img;
    }

    setCtx(ctx) {
        this.ctx = ctx;
    }


}


module.exports = { Box };