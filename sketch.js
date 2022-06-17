/*
** Wave Function Collapse
* Cristian Rojas Cardenas, April 2022
* https://discourse.processing.org/t/wave-collapse-function-algorithm-in-processing/12983/3
*/


let settings = { 
    Generate: function(){ init(); },    
}

function gui(){
    // Adding the GUI menu
    var gui = new dat.GUI();
    gui.width = 150;
    gui.add(settings,'Generate');
}

function setup(){
    gui();
    createCanvas(720, 400);
    init();
}

async function init(){
    background(0);
    dir = "samples/Summer/";
    grid = await Grid.build(dir);
    grid.compute();
    grid.render();
}

function draw(){
    
}

