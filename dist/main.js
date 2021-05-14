/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/canvas/Camera.js":
/*!******************************!*\
  !*** ./src/canvas/Camera.js ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var { Vector } = __webpack_require__(/*! ./Vector */ "./src/canvas/Vector.js");


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

/***/ }),

/***/ "./src/canvas/Canvas.js":
/*!******************************!*\
  !*** ./src/canvas/Canvas.js ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var { Box } = __webpack_require__(/*! ./geometries */ "./src/canvas/geometries.js");
var color_filter = __webpack_require__(/*! ./color_filter */ "./src/canvas/color_filter.js");
const { Vector } = __webpack_require__(/*! ./Vector */ "./src/canvas/Vector.js");


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

/***/ }),

/***/ "./src/canvas/Controller.js":
/*!**********************************!*\
  !*** ./src/canvas/Controller.js ***!
  \**********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var { Vector } = __webpack_require__(/*! ./Vector */ "./src/canvas/Vector.js");

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



/***/ }),

/***/ "./src/canvas/Vector.js":
/*!******************************!*\
  !*** ./src/canvas/Vector.js ***!
  \******************************/
/***/ ((module) => {

/*
Simple 2D JavaScript Vector Class
Hacked from evanw's lightgl.js
https://github.com/evanw/lightgl.js/blob/master/src/vector.js
*/

function Vector(x, y) {
	this.x = x || 0;
	this.y = y || 0;
	this.limit = undefined;
}

/* INSTANCE METHODS */

Vector.prototype = {
	negative: function() {
		this.x = -this.x;
		this.y = -this.y;
		this.limit = undefined;
		return this;
	},
	add: function(v) {
		if (v instanceof Vector) {
			this.x += v.x;
			this.y += v.y;
		} else {
			this.x += v;
			this.y += v;
		}	

		if (this.limit != undefined) 
			this.setLimit();
		
		return this;
	},
	subtract: function(v) {
		if (v instanceof Vector) {
			this.x -= v.x;
			this.y -= v.y;
		} else {
			this.x -= v;
			this.y -= v;
		}
		
		if (this.limit != undefined) 
			this.setLimit();
		
		return this;
	},
	multiply: function(v) {
		if (v instanceof Vector) {
			this.x *= v.x;
			this.y *= v.y;
		} else {
			this.x *= v;
			this.y *= v;
		}

		if (this.limit != undefined) 
			this.setLimit();

		return this;
	},
	divide: function(v) {
		if (v instanceof Vector) {
			if(v.x != 0) this.x /= v.x;
			if(v.y != 0) this.y /= v.y;
		} else {
			if(v != 0) {
				this.x /= v;
				this.y /= v;
			}
		}

		if (this.limit != undefined) 
			this.setLimit();

		return this;
	},
	setLimit: function (limit) {

		if (this.x > this.limit) 
			this.x = this.limit;
		
		if (this.y > this.limit) 
			this.y = this.limit

		if (this.x < -this.limit)
			this.x = -this.limit

		if (this.y < -this.limit) 
			this.y = -this.limit;

	},
	equals: function(v) {
		return this.x == v.x && this.y == v.y;
	},
	dot: function(v) {
		return this.x * v.x + this.y * v.y;
	},
	cross: function(v) {
		return this.x * v.y - this.y * v.x
	},
	length: function() {
		return Math.sqrt(this.dot(this));
	},
	normalize: function() {
		return this.divide(this.length());
	},
	min: function() {
		return Math.min(this.x, this.y);
	},
	max: function() {
		return Math.max(this.x, this.y);
	},
	toAngles: function() {
		return -Math.atan2(-this.y, this.x);
	},
	angleTo: function(a) {
		return Math.acos(this.dot(a) / (this.length() * a.length()));
	},
	toArray: function(n) {
		return [this.x, this.y].slice(0, n || 2);
	},
	clone: function() {
		return new Vector(this.x, this.y);
	},
	set: function(x, y) {
		this.x = x; this.y = y;
		return this;
	}
};

/* STATIC METHODS */
Vector.negative = function(v) {
	return new Vector(-v.x, -v.y);
};
Vector.add = function(a, b) {
	if (b instanceof Vector) return new Vector(a.x + b.x, a.y + b.y);
	else return new Vector(a.x + b, a.y + b);
};
Vector.subtract = function(a, b) {
	if (b instanceof Vector) return new Vector(a.x - b.x, a.y - b.y);
	else return new Vector(a.x - b, a.y - b);
};
Vector.multiply = function(a, b) {
	if (b instanceof Vector) return new Vector(a.x * b.x, a.y * b.y);
	else return new Vector(a.x * b, a.y * b);
};
Vector.divide = function(a, b) {
	if (b instanceof Vector) return new Vector(a.x / b.x, a.y / b.y);
	else return new Vector(a.x / b, a.y / b);
};
Vector.equals = function(a, b) {
	return a.x == b.x && a.y == b.y;
};
Vector.dot = function(a, b) {
	return a.x * b.x + a.y * b.y;
};
Vector.cross = function(a, b) {
	return a.x * b.y - a.y * b.x;
};

module.exports = { Vector };

/***/ }),

/***/ "./src/canvas/color_filter.js":
/*!************************************!*\
  !*** ./src/canvas/color_filter.js ***!
  \************************************/
/***/ ((module) => {

function color_filter(color) {
    switch (color) {
        case "red":
            return "#ff0000";
        
        case "green": 
            return "#00ff00";

        case "blue": 
            return "#0000ff";

        default:
            return color;
    }
}

module.exports = color_filter;

/***/ }),

/***/ "./src/canvas/geometries.js":
/*!**********************************!*\
  !*** ./src/canvas/geometries.js ***!
  \**********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var { Vector } = __webpack_require__(/*! ./Vector */ "./src/canvas/Vector.js");

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

/***/ }),

/***/ "./src/minecraft_2d_plugin/Block.js":
/*!******************************************!*\
  !*** ./src/minecraft_2d_plugin/Block.js ***!
  \******************************************/
/***/ ((module) => {

class Block {
    constructor(block_texture, id, name, sprite) {
        this.texture = block_texture;
        this.id = id;
        this.name = name;
        this.sprite = sprite;
    }
}

module.exports = { Block }

/***/ }),

/***/ "./src/minecraft_2d_plugin/Blocks.json":
/*!*********************************************!*\
  !*** ./src/minecraft_2d_plugin/Blocks.json ***!
  \*********************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"1":{"name":"Grass","sprite":"./img/grass.png"},"2":{"name":"Dirt","sprite":"./img/dirt.png"},"3":{"name":"Stone","sprite":"./img/stone.png"}}');

/***/ }),

/***/ "./src/minecraft_2d_plugin/minecraft_2d.js":
/*!*************************************************!*\
  !*** ./src/minecraft_2d_plugin/minecraft_2d.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var { Block } = __webpack_require__(/*! ./Block */ "./src/minecraft_2d_plugin/Block.js");
var Blocks = __webpack_require__(/*! ./Blocks.json */ "./src/minecraft_2d_plugin/Blocks.json");

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

/***/ }),

/***/ "./src/world.json":
/*!************************!*\
  !*** ./src/world.json ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('[{"x":0,"y":0,"id":"1"},{"x":1,"y":0,"id":"1"},{"x":-1,"y":0,"id":"1"},{"x":0,"y":1,"id":"2"},{"x":1,"y":1,"id":"2"},{"x":-1,"y":1,"id":"2"},{"x":0,"y":2,"id":"3"},{"x":1,"y":2,"id":"3"},{"x":-1,"y":2,"id":"3"}]');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _canvas_Canvas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./canvas/Canvas */ "./src/canvas/Canvas.js");
/* harmony import */ var _canvas_Canvas__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_canvas_Canvas__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _canvas_Controller__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./canvas/Controller */ "./src/canvas/Controller.js");
/* harmony import */ var _canvas_Controller__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_canvas_Controller__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _canvas_Camera__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./canvas/Camera */ "./src/canvas/Camera.js");
/* harmony import */ var _canvas_Camera__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_canvas_Camera__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _minecraft_2d_plugin_minecraft_2d__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./minecraft_2d_plugin/minecraft_2d */ "./src/minecraft_2d_plugin/minecraft_2d.js");
/* harmony import */ var _minecraft_2d_plugin_minecraft_2d__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_minecraft_2d_plugin_minecraft_2d__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _world_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./world.json */ "./src/world.json");






var canvas = new _canvas_Canvas__WEBPACK_IMPORTED_MODULE_0__.Canvas(window.innerWidth, window.innerHeight);
var ctx = canvas.ctx;

var world = new _minecraft_2d_plugin_minecraft_2d__WEBPACK_IMPORTED_MODULE_3__.World(50, canvas, ctx);

var player = world.Player(0, 0);
var controller = new _canvas_Controller__WEBPACK_IMPORTED_MODULE_1__.Constroller(player);
var camera = new _canvas_Camera__WEBPACK_IMPORTED_MODULE_2__.Camera(player);
canvas.setCamera(camera);
canvas.setController(controller);
camera.acceleration_multiplicator = 1;

window.world = world;

world.generateFromArray(_world_json__WEBPACK_IMPORTED_MODULE_4__);


function create_block() {
    var x = document.querySelector("#x").value;
    var y = document.querySelector("#y").value;
    var id = document.querySelector("#id").value;

    world.createBlock(x, y, id);
}

window.create_block = create_block;

let ltime = 0, ctime = 0;
update();
function update(stime) {
    canvas.clear();

    ctime = stime - ltime;
    ltime = stime; 

    if (String(ctime) === "NaN") { ltime = 0; ctime = 0; }

    setTimeout(() => { requestAnimationFrame(update); }, 1000/100);

    canvas.drawAll();
    canvas.controller.update(ctime);
    canvas.camera.update(ctime);
}

// resize 
window.addEventListener("resize", () => { canvas.resize(window.innerWidth, window.innerHeight); });



})();

/******/ })()
;
//# sourceMappingURL=main.js.map