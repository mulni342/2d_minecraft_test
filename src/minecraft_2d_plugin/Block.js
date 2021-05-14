class Block {
    constructor(block_texture, id, name, sprite) {
        this.texture = block_texture;
        this.id = id;
        this.name = name;
        this.sprite = sprite;
    }
}

module.exports = { Block }