import { Canvas } from "./canvas/Canvas";
import { Constroller } from "./canvas/Controller";
import { Camera } from "./canvas/Camera";
import { World } from "./minecraft_2d_plugin/minecraft_2d";
import world_gen from "./world.json";

var canvas = new Canvas(window.innerWidth, window.innerHeight);
var ctx = canvas.ctx;

var world = new World(50, canvas, ctx);

var player = world.Player(0, 0);
var controller = new Constroller(player);
var camera = new Camera(player);
canvas.setCamera(camera);
canvas.setController(controller);
camera.acceleration_multiplicator = 1;

window.world = world;

world.generateFromArray(world_gen);


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


