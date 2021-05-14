var { Box } = require("./geometries");
var color_filter = require("./color_filter");
const { Vector } = require("./Vector");


class Ctx {
    constructor(canvas, objects) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;
        this.objects = objects;
    }

    createBox(x, y, w, h, color) {
        let box = new Box(x, y, w, h, color_filter(color), this.ctx);
        this.objects.push(box);
        return box;
    }

    clearRect(x, y, w, h) {
        this.ctx.clearRect(x, y, w, h);
    }

    reset() {
        this.ctx = this.canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;
        this.objects.forEach((obj) => { obj.setCtx(this.ctx); });
    }
    translate(x, y) {
        this.ctx.translate(x, y);
    }
}

class Canvas {
    constructor(width, height) {
        this.canvas = document.createElement("canvas");
        this.outline();
        document.body.appendChild(this.canvas);
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = width;
        this.height = height;

        this.objects = [];
        this.ctx = new Ctx(this.canvas, this.objects);
        this.controller = undefined;
        this.player = undefined;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    outline() {
        this.canvas.style.outline = "1px solid black";
    }
    
    resize(w, h) {
        this.canvas.width = w;
        this.canvas.height = h;
        this.width = w;
        this.height = h;
        this.ctx.reset();
    }

    drawAll() {
        this.objects.forEach((obj) => { obj.draw(); });
    }

    setController(Constroller) {
        this.controller = Constroller;
        this.controller.canvas = this;
        this.controller.objects = this.objects;
    }

    setCamera(camera) {
        this.camera = camera;
        this.camera.setCanvas(this);
        this.camera.objects = this.objects;
    }

    setPlayer(playerGeometry) {
        this.player = playerGeometry;
    }

}

module.exports = { Canvas }