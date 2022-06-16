/*
** Wave Function Collapse
* Cristian Rojas Cardenas, April 2022
* 
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
    dir = "samples/Castle/";
    grid = await Grid.build(dir);
    grid.render();
}

function draw(){
    
}

