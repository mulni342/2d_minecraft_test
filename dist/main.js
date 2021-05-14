/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/canvas/Camera.js":
/*!******************************!*\
  !*** ./src/canvas/Camera.js ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var { Vector } = __webpack_require__(/*! ./Vector */ \"./src/canvas/Vector.js\");\r\n\r\n\r\nclass Camera {\r\n    constructor(player) {\r\n        this.player = player;\r\n        this.canvas;\r\n        this.objects;\r\n        this.velocity = new Vector(0, 0);\r\n        this.position = new Vector(0, 0);\r\n        this.offset = new Vector(0, 0);\r\n        this.acceleration_multiplicator = 0.02;\r\n    }\r\n\r\n    setCanvas(canvas) {\r\n        this.canvas = canvas;\r\n        this.updatePosition();\r\n    }\r\n\r\n    updatePosition() {\r\n        this.position.x = (this.canvas.width / 2) - this.player.size.x / 2;\r\n        this.position.y = (this.canvas.height / 2) - this.player.size.y / 2;\r\n    }\r\n\r\n    update(ctime) {\r\n        this.updatePosition();\r\n        \r\n        var acceleration = Vector.subtract(this.player.position, this.position);\r\n        acceleration.multiply(this.acceleration_multiplicator);\r\n\r\n        this.offset.subtract(acceleration);\r\n\r\n        this.objects.forEach(obj => {\r\n            obj.position.subtract(acceleration);\r\n        });\r\n\r\n        this.acceleration_multiplicator = 0.02;\r\n    }\r\n}\r\n\r\nmodule.exports = { Camera }\n\n//# sourceURL=webpack://2d_minecraft_test/./src/canvas/Camera.js?");

/***/ }),

/***/ "./src/canvas/Canvas.js":
/*!******************************!*\
  !*** ./src/canvas/Canvas.js ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var { Box } = __webpack_require__(/*! ./geometries */ \"./src/canvas/geometries.js\");\r\nvar color_filter = __webpack_require__(/*! ./color_filter */ \"./src/canvas/color_filter.js\");\r\nconst { Vector } = __webpack_require__(/*! ./Vector */ \"./src/canvas/Vector.js\");\r\n\r\n\r\nclass Ctx {\r\n    constructor(canvas, objects) {\r\n        this.canvas = canvas;\r\n        this.ctx = this.canvas.getContext(\"2d\");\r\n        this.ctx.imageSmoothingEnabled = false;\r\n        this.objects = objects;\r\n    }\r\n\r\n    createBox(x, y, w, h, color) {\r\n        let box = new Box(x, y, w, h, color_filter(color), this.ctx);\r\n        this.objects.push(box);\r\n        return box;\r\n    }\r\n\r\n    clearRect(x, y, w, h) {\r\n        this.ctx.clearRect(x, y, w, h);\r\n    }\r\n\r\n    reset() {\r\n        this.ctx = this.canvas.getContext(\"2d\");\r\n        this.ctx.imageSmoothingEnabled = false;\r\n        this.objects.forEach((obj) => { obj.setCtx(this.ctx); });\r\n    }\r\n    translate(x, y) {\r\n        this.ctx.translate(x, y);\r\n    }\r\n}\r\n\r\nclass Canvas {\r\n    constructor(width, height) {\r\n        this.canvas = document.createElement(\"canvas\");\r\n        this.outline();\r\n        document.body.appendChild(this.canvas);\r\n        this.canvas.width = width;\r\n        this.canvas.height = height;\r\n        this.width = width;\r\n        this.height = height;\r\n\r\n        this.objects = [];\r\n        this.ctx = new Ctx(this.canvas, this.objects);\r\n        this.controller = undefined;\r\n        this.player = undefined;\r\n    }\r\n\r\n    clear() {\r\n        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);\r\n    }\r\n\r\n    outline() {\r\n        this.canvas.style.outline = \"1px solid black\";\r\n    }\r\n    \r\n    resize(w, h) {\r\n        this.canvas.width = w;\r\n        this.canvas.height = h;\r\n        this.width = w;\r\n        this.height = h;\r\n        this.ctx.reset();\r\n    }\r\n\r\n    drawAll() {\r\n        this.objects.forEach((obj) => { obj.draw(); });\r\n    }\r\n\r\n    setController(Constroller) {\r\n        this.controller = Constroller;\r\n        this.controller.canvas = this;\r\n        this.controller.objects = this.objects;\r\n    }\r\n\r\n    setCamera(camera) {\r\n        this.camera = camera;\r\n        this.camera.setCanvas(this);\r\n        this.camera.objects = this.objects;\r\n    }\r\n\r\n    setPlayer(playerGeometry) {\r\n        this.player = playerGeometry;\r\n    }\r\n\r\n}\r\n\r\nmodule.exports = { Canvas }\n\n//# sourceURL=webpack://2d_minecraft_test/./src/canvas/Canvas.js?");

/***/ }),

/***/ "./src/canvas/Controller.js":
/*!**********************************!*\
  !*** ./src/canvas/Controller.js ***!
  \**********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var { Vector } = __webpack_require__(/*! ./Vector */ \"./src/canvas/Vector.js\");\r\n\r\nclass Constroller {\r\n    constructor(geometry) {\r\n        this.player = geometry;\r\n        this.objects;\r\n        this.canvas;\r\n        this.keys = {};\r\n        this.aspeed = 0.4;\r\n        this.velocity = new Vector(0, 0);\r\n        this.acceleration = new Vector(0, 0);\r\n        this.acceleration.limit = 0.5;\r\n        this.velocity.limit = 15;\r\n        this.canJump = false;\r\n\r\n        window.addEventListener(\"keydown\", (e) => { this.keys[e.code] = true });\r\n        window.addEventListener(\"keyup\", (e) => { this.keys[e.code] = false });\r\n    }\r\n\r\n    gravity(ctime) {\r\n\r\n        this.acceleration.add(new Vector(0, 0.3 * ctime));\r\n\r\n        this.objects.forEach(obj => {\r\n            if (obj != this.player) {\r\n                if ((this.player.position.y + this.player.size.y >= obj.position.y && this.player.position.y < obj.position.y + obj.size.y) &&    \r\n                    (this.player.position.x + this.player.size.x >= obj.position.x && this.player.position.x < obj.position.x + obj.size.x ) ) {\r\n                    this.player.position.y = obj.position.y - this.player.size.y;\r\n                    this.canJump = true;\r\n                }\r\n            }\r\n        });\r\n    }\r\n\r\n    update(ctime) {\r\n        this.velocity.add(this.acceleration);\r\n        this.player.position.add(this.velocity);\r\n        this.gravity(ctime);\r\n\r\n        if (this.keys.KeyD) {\r\n            this.player.position.x += this.aspeed * ctime;\r\n        }\r\n\r\n        if (this.keys.KeyA) {\r\n            this.player.position.x -= this.aspeed * ctime;\r\n        }\r\n\r\n        if (this.keys.Space) {\r\n            if (this.canJump) {\r\n                this.velocity.y = -10;\r\n                this.canJump = false;\r\n            } \r\n        }       \r\n    }\r\n}\r\n\r\n\r\nmodule.exports = { Constroller }\r\n\r\n\n\n//# sourceURL=webpack://2d_minecraft_test/./src/canvas/Controller.js?");

/***/ }),

/***/ "./src/canvas/Vector.js":
/*!******************************!*\
  !*** ./src/canvas/Vector.js ***!
  \******************************/
/***/ ((module) => {

eval("/*\r\nSimple 2D JavaScript Vector Class\r\nHacked from evanw's lightgl.js\r\nhttps://github.com/evanw/lightgl.js/blob/master/src/vector.js\r\n*/\r\n\r\nfunction Vector(x, y) {\r\n\tthis.x = x || 0;\r\n\tthis.y = y || 0;\r\n\tthis.limit = undefined;\r\n}\r\n\r\n/* INSTANCE METHODS */\r\n\r\nVector.prototype = {\r\n\tnegative: function() {\r\n\t\tthis.x = -this.x;\r\n\t\tthis.y = -this.y;\r\n\t\tthis.limit = undefined;\r\n\t\treturn this;\r\n\t},\r\n\tadd: function(v) {\r\n\t\tif (v instanceof Vector) {\r\n\t\t\tthis.x += v.x;\r\n\t\t\tthis.y += v.y;\r\n\t\t} else {\r\n\t\t\tthis.x += v;\r\n\t\t\tthis.y += v;\r\n\t\t}\t\r\n\r\n\t\tif (this.limit != undefined) \r\n\t\t\tthis.setLimit();\r\n\t\t\r\n\t\treturn this;\r\n\t},\r\n\tsubtract: function(v) {\r\n\t\tif (v instanceof Vector) {\r\n\t\t\tthis.x -= v.x;\r\n\t\t\tthis.y -= v.y;\r\n\t\t} else {\r\n\t\t\tthis.x -= v;\r\n\t\t\tthis.y -= v;\r\n\t\t}\r\n\t\t\r\n\t\tif (this.limit != undefined) \r\n\t\t\tthis.setLimit();\r\n\t\t\r\n\t\treturn this;\r\n\t},\r\n\tmultiply: function(v) {\r\n\t\tif (v instanceof Vector) {\r\n\t\t\tthis.x *= v.x;\r\n\t\t\tthis.y *= v.y;\r\n\t\t} else {\r\n\t\t\tthis.x *= v;\r\n\t\t\tthis.y *= v;\r\n\t\t}\r\n\r\n\t\tif (this.limit != undefined) \r\n\t\t\tthis.setLimit();\r\n\r\n\t\treturn this;\r\n\t},\r\n\tdivide: function(v) {\r\n\t\tif (v instanceof Vector) {\r\n\t\t\tif(v.x != 0) this.x /= v.x;\r\n\t\t\tif(v.y != 0) this.y /= v.y;\r\n\t\t} else {\r\n\t\t\tif(v != 0) {\r\n\t\t\t\tthis.x /= v;\r\n\t\t\t\tthis.y /= v;\r\n\t\t\t}\r\n\t\t}\r\n\r\n\t\tif (this.limit != undefined) \r\n\t\t\tthis.setLimit();\r\n\r\n\t\treturn this;\r\n\t},\r\n\tsetLimit: function (limit) {\r\n\r\n\t\tif (this.x > this.limit) \r\n\t\t\tthis.x = this.limit;\r\n\t\t\r\n\t\tif (this.y > this.limit) \r\n\t\t\tthis.y = this.limit\r\n\r\n\t\tif (this.x < -this.limit)\r\n\t\t\tthis.x = -this.limit\r\n\r\n\t\tif (this.y < -this.limit) \r\n\t\t\tthis.y = -this.limit;\r\n\r\n\t},\r\n\tequals: function(v) {\r\n\t\treturn this.x == v.x && this.y == v.y;\r\n\t},\r\n\tdot: function(v) {\r\n\t\treturn this.x * v.x + this.y * v.y;\r\n\t},\r\n\tcross: function(v) {\r\n\t\treturn this.x * v.y - this.y * v.x\r\n\t},\r\n\tlength: function() {\r\n\t\treturn Math.sqrt(this.dot(this));\r\n\t},\r\n\tnormalize: function() {\r\n\t\treturn this.divide(this.length());\r\n\t},\r\n\tmin: function() {\r\n\t\treturn Math.min(this.x, this.y);\r\n\t},\r\n\tmax: function() {\r\n\t\treturn Math.max(this.x, this.y);\r\n\t},\r\n\ttoAngles: function() {\r\n\t\treturn -Math.atan2(-this.y, this.x);\r\n\t},\r\n\tangleTo: function(a) {\r\n\t\treturn Math.acos(this.dot(a) / (this.length() * a.length()));\r\n\t},\r\n\ttoArray: function(n) {\r\n\t\treturn [this.x, this.y].slice(0, n || 2);\r\n\t},\r\n\tclone: function() {\r\n\t\treturn new Vector(this.x, this.y);\r\n\t},\r\n\tset: function(x, y) {\r\n\t\tthis.x = x; this.y = y;\r\n\t\treturn this;\r\n\t}\r\n};\r\n\r\n/* STATIC METHODS */\r\nVector.negative = function(v) {\r\n\treturn new Vector(-v.x, -v.y);\r\n};\r\nVector.add = function(a, b) {\r\n\tif (b instanceof Vector) return new Vector(a.x + b.x, a.y + b.y);\r\n\telse return new Vector(a.x + b, a.y + b);\r\n};\r\nVector.subtract = function(a, b) {\r\n\tif (b instanceof Vector) return new Vector(a.x - b.x, a.y - b.y);\r\n\telse return new Vector(a.x - b, a.y - b);\r\n};\r\nVector.multiply = function(a, b) {\r\n\tif (b instanceof Vector) return new Vector(a.x * b.x, a.y * b.y);\r\n\telse return new Vector(a.x * b, a.y * b);\r\n};\r\nVector.divide = function(a, b) {\r\n\tif (b instanceof Vector) return new Vector(a.x / b.x, a.y / b.y);\r\n\telse return new Vector(a.x / b, a.y / b);\r\n};\r\nVector.equals = function(a, b) {\r\n\treturn a.x == b.x && a.y == b.y;\r\n};\r\nVector.dot = function(a, b) {\r\n\treturn a.x * b.x + a.y * b.y;\r\n};\r\nVector.cross = function(a, b) {\r\n\treturn a.x * b.y - a.y * b.x;\r\n};\r\n\r\nmodule.exports = { Vector };\n\n//# sourceURL=webpack://2d_minecraft_test/./src/canvas/Vector.js?");

/***/ }),

/***/ "./src/canvas/color_filter.js":
/*!************************************!*\
  !*** ./src/canvas/color_filter.js ***!
  \************************************/
/***/ ((module) => {

eval("function color_filter(color) {\r\n    switch (color) {\r\n        case \"red\":\r\n            return \"#ff0000\";\r\n        \r\n        case \"green\": \r\n            return \"#00ff00\";\r\n\r\n        case \"blue\": \r\n            return \"#0000ff\";\r\n\r\n        default:\r\n            return color;\r\n    }\r\n}\r\n\r\nmodule.exports = color_filter;\n\n//# sourceURL=webpack://2d_minecraft_test/./src/canvas/color_filter.js?");

/***/ }),

/***/ "./src/canvas/geometries.js":
/*!**********************************!*\
  !*** ./src/canvas/geometries.js ***!
  \**********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var { Vector } = __webpack_require__(/*! ./Vector */ \"./src/canvas/Vector.js\");\r\n\r\nclass Box {\r\n    constructor(x, y, w, h, color, ctx) {\r\n        this.position = new Vector(x, y);\r\n        this.size = new Vector(w, h);\r\n        this.velocity = new Vector(0, 0);\r\n        this.acceleration = new Vector(0, 0);\r\n        this.uuid = Math.random();\r\n        this.img;\r\n        this.color;\r\n        if (!color.includes(\"/\")) {\r\n            this.color = color;\r\n        } else {\r\n            let img = document.createElement(\"img\"); img.src = color;\r\n            this.img = img;\r\n        }\r\n        this.ctx = ctx;\r\n    }\r\n\r\n    draw() {\r\n        if (this.img == undefined) {\r\n            this.ctx.fillStyle = this.color;\r\n            this.ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y); \r\n        } else {\r\n            this.ctx.drawImage(this.img, this.position.x, this.position.y, this.size.x, this.size.y);\r\n        }\r\n\r\n    }\r\n    \r\n    setImage(img) {\r\n        this.img = img; \r\n    }\r\n\r\n    setImageSrc(img1) {\r\n        let img = document.createElement(\"img\"); img.src = img1;\r\n        this.img = img;\r\n    }\r\n\r\n    setCtx(ctx) {\r\n        this.ctx = ctx;\r\n    }\r\n\r\n\r\n}\r\n\r\n\r\nmodule.exports = { Box };\n\n//# sourceURL=webpack://2d_minecraft_test/./src/canvas/geometries.js?");

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _canvas_Canvas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./canvas/Canvas */ \"./src/canvas/Canvas.js\");\n/* harmony import */ var _canvas_Canvas__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_canvas_Canvas__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _canvas_Controller__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./canvas/Controller */ \"./src/canvas/Controller.js\");\n/* harmony import */ var _canvas_Controller__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_canvas_Controller__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _canvas_Camera__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./canvas/Camera */ \"./src/canvas/Camera.js\");\n/* harmony import */ var _canvas_Camera__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_canvas_Camera__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _minecraft_2d_plugin_minecraft_2d__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./minecraft_2d_plugin/minecraft_2d */ \"./src/minecraft_2d_plugin/minecraft_2d.js\");\n/* harmony import */ var _minecraft_2d_plugin_minecraft_2d__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_minecraft_2d_plugin_minecraft_2d__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _world_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./world.json */ \"./src/world.json\");\n\r\n\r\n\r\n\r\n\r\n\r\nvar canvas = new _canvas_Canvas__WEBPACK_IMPORTED_MODULE_0__.Canvas(window.innerWidth, window.innerHeight);\r\nvar ctx = canvas.ctx;\r\n\r\nvar world = new _minecraft_2d_plugin_minecraft_2d__WEBPACK_IMPORTED_MODULE_3__.World(50, canvas, ctx);\r\n\r\nvar player = world.Player(0, 0);\r\nvar controller = new _canvas_Controller__WEBPACK_IMPORTED_MODULE_1__.Constroller(player);\r\nvar camera = new _canvas_Camera__WEBPACK_IMPORTED_MODULE_2__.Camera(player);\r\ncanvas.setCamera(camera);\r\ncanvas.setController(controller);\r\ncamera.acceleration_multiplicator = 1;\r\n\r\nwindow.world = world;\r\n\r\nworld.generateFromArray(_world_json__WEBPACK_IMPORTED_MODULE_4__);\r\n\r\n\r\nfunction create_block() {\r\n    var x = document.querySelector(\"#x\").value;\r\n    var y = document.querySelector(\"#y\").value;\r\n    var id = document.querySelector(\"#id\").value;\r\n\r\n    world.createBlock(x, y, id);\r\n}\r\n\r\nwindow.create_block = create_block;\r\n\r\nlet ltime = 0, ctime = 0;\r\nupdate();\r\nfunction update(stime) {\r\n    canvas.clear();\r\n\r\n    ctime = stime - ltime;\r\n    ltime = stime; \r\n\r\n    if (String(ctime) === \"NaN\") { ltime = 0; ctime = 0; }\r\n\r\n    setTimeout(() => { requestAnimationFrame(update); }, 1000/100);\r\n\r\n    canvas.drawAll();\r\n    canvas.controller.update(ctime);\r\n    canvas.camera.update(ctime);\r\n}\r\n\r\n// resize \r\nwindow.addEventListener(\"resize\", () => { canvas.resize(window.innerWidth, window.innerHeight); });\r\n\r\n\r\n\n\n//# sourceURL=webpack://2d_minecraft_test/./src/main.js?");

/***/ }),

/***/ "./src/minecraft_2d_plugin/Block.js":
/*!******************************************!*\
  !*** ./src/minecraft_2d_plugin/Block.js ***!
  \******************************************/
/***/ ((module) => {

eval("class Block {\r\n    constructor(block_texture, id, name, sprite) {\r\n        this.texture = block_texture;\r\n        this.id = id;\r\n        this.name = name;\r\n        this.sprite = sprite;\r\n    }\r\n}\r\n\r\nmodule.exports = { Block }\n\n//# sourceURL=webpack://2d_minecraft_test/./src/minecraft_2d_plugin/Block.js?");

/***/ }),

/***/ "./src/minecraft_2d_plugin/Blocks.json":
/*!*********************************************!*\
  !*** ./src/minecraft_2d_plugin/Blocks.json ***!
  \*********************************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('{\"1\":{\"name\":\"Grass\",\"sprite\":\"./img/grass.png\"},\"2\":{\"name\":\"Dirt\",\"sprite\":\"./img/dirt.png\"},\"3\":{\"name\":\"Stone\",\"sprite\":\"./img/stone.png\"}}');\n\n//# sourceURL=webpack://2d_minecraft_test/./src/minecraft_2d_plugin/Blocks.json?");

/***/ }),

/***/ "./src/minecraft_2d_plugin/minecraft_2d.js":
/*!*************************************************!*\
  !*** ./src/minecraft_2d_plugin/minecraft_2d.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var { Block } = __webpack_require__(/*! ./Block */ \"./src/minecraft_2d_plugin/Block.js\");\r\nvar Blocks = __webpack_require__(/*! ./Blocks.json */ \"./src/minecraft_2d_plugin/Blocks.json\");\r\n\r\nclass World {\r\n    constructor(worldSize, canvas, ctx) {\r\n        this.worldSize = worldSize;\r\n        this.canvas = canvas;\r\n        this.ctx = ctx;\r\n        this.blocks = [];\r\n    }\r\n\r\n    Player(coordX, coordY) {\r\n        return this.ctx.createBox(coordX*this.worldSize, coordY*this.worldSize, this.worldSize, this.worldSize*2, \"red\");\r\n    }\r\n\r\n    createBlock(coordX, coordY, id) {\r\n        let block = Blocks[id];\r\n        let x = (coordX * this.worldSize) + this.canvas.camera.offset.x;\r\n        let y = (coordY * this.worldSize) + this.canvas.camera.offset.y;\r\n\r\n        let block_texture = this.ctx.createBox(x, y, this.worldSize, this.worldSize, block.sprite);\r\n        let block_obj = new Block(block_texture, id, block.name, block.sprite);\r\n\r\n        this.blocks.push(block_obj);\r\n    }\r\n\r\n    generateFromArray(worldArray) {\r\n        worldArray.forEach(block => {\r\n            this.createBlock(block.x, block.y, block.id);\r\n        })\r\n    }\r\n\r\n\r\n\r\n}\r\n\r\nmodule.exports = { World };\n\n//# sourceURL=webpack://2d_minecraft_test/./src/minecraft_2d_plugin/minecraft_2d.js?");

/***/ }),

/***/ "./src/world.json":
/*!************************!*\
  !*** ./src/world.json ***!
  \************************/
/***/ ((module) => {

"use strict";
eval("module.exports = JSON.parse('[{\"x\":0,\"y\":0,\"id\":\"1\"},{\"x\":1,\"y\":0,\"id\":\"1\"},{\"x\":-1,\"y\":0,\"id\":\"1\"},{\"x\":0,\"y\":1,\"id\":\"2\"},{\"x\":1,\"y\":1,\"id\":\"2\"},{\"x\":-1,\"y\":1,\"id\":\"2\"},{\"x\":0,\"y\":2,\"id\":\"3\"},{\"x\":1,\"y\":2,\"id\":\"3\"},{\"x\":-1,\"y\":2,\"id\":\"3\"}]');\n\n//# sourceURL=webpack://2d_minecraft_test/./src/world.json?");

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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.js");
/******/ 	
/******/ })()
;