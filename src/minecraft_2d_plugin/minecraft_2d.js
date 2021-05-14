var { Block } = require("./Block");
var Blocks = require("./Blocks.json");

class World {
    constructor(worldSize, canvas, ctx) {
        this.worldSize = worldSize;
        this.canvas = canvas;
        this.ctx = ctx;
        this.blocks = [];
    }

    Player(coordX, coordY) {
        return this.ctx.createBox(coordX*this.worldSize, coordY*this.worldSize, this.worldSize, this.worldSize*2, "red");
    }

    createBlock(coordX, coordY, id) {
        let block = Blocks[id];
        let x = (coordX * this.worldSize) + this.canvas.camera.offset.x;
        let y = (coordY * this.worldSize) + this.canvas.camera.offset.y;

        let block_texture = this.ctx.createBox(x, y, this.worldSize, this.worldSize, block.sprite);
        let block_obj = new Block(block_texture, id, block.name, block.sprite);

        this.blocks.push(block_obj);
    }

    generateFromArray(worldArray) {
        worldArray.forEach(block => {
            this.createBlock(block.x, block.y, block.id);
        })
    }



}

module.exports = { World };