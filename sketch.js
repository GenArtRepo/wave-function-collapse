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
    // init();
    var tile =  loadImage("samples/summer-2.png");
    image(tile, 0, 0);
}

// async function init(){
//     background(0);    
//     dir = "samples/Castle/";
//     grid = await Grid.build(dir);
//     // console.log(grid.tiles);
//     // var tile = grid.cells[0][0].possible_tiles[0].img;
//     // var tile = await loadImage("samples/summer-2.png");
//     var tile = await loadImage('samples/summer-2.png', img => {
//         console.log(img);
//         // image(img, 0, 0);
//         return img;
//       });
//     console.log(tile);
//     image(tile, 0, 0);
//     // grid.render();
// }

function draw(){
    
}

