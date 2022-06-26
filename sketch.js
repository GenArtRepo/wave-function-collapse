/*
** Wave Function Collapse
* Cristian Rojas Cardenas, April 2022
* 
* The algorithm operates over a grid of cells, each cell is initialized with a list 
* of possible values of tiles that it could take. A tile is arranged by the image 
* name and the rotation, it means that for every image we can obtain 4 tiles:
* 					
*                             waterturn 0
* 
* Also, a tile has certain defined rules for the tiles that can be at their side, it 
* can only take a place if all their neighbors are allowed in their lists for each 
* side, which change depending on the rotation. The sides are numerated in the next
* way:
* 
*                                   1
*                                 0| |2
*                                   3
* 
* The algorithm follows the next actions to select which tiles should be used in each 
* cell:
* 
*         1.  The grid is initialized in an unobserved state, all the cells could 
*             take any of the tiles.
*         2.  Repeat:
*             a.	Collapse one of random cell: Choose a random cell and assign a 
*                   random tile from the possible values that it could take.
*             b.	Propagate: Iterate over all the neighbors of the chosen cell and 
*                   update their list of possible tiles, continue until no more cells 
*                   can be updated.
*             c.    Update the entropy list.
*         3.  Render when all the cells are set.
* 
* For deeper information about the wave function collapse algorithm or the load of 
* images please check:
* 
* https://discourse.processing.org/t/wave-collapse-function-algorithm-in-processing/12983/3
*/

let dir;
let data = {
    "Castle": {dir:"samples/Castle/"},
    "Circles": {dir:"samples/Circles/"},
    "Circuit": {dir:"samples/Circuit/"},
    "Floor_Plan": {dir:"samples/FloorPlan/"},
    "Knots": {dir:"samples/Knots/"},
    "Rooms": {dir:"samples/Rooms/"},
    "Summer": {dir:"samples/Summer/"},
};
let grids = {};

let symmetries = {
    X:{
        0:[0, 1, 2, 3],
        1:[0, 1, 2, 3],
        2:[0, 1, 2, 3],
        3:[0, 1, 2, 3]
    },
    T:{
        0:[0, 2],
        1:[1],
        2:[0, 2],
        3:[3]
    },
    L:{
        0:[0, 3],
        1:[1, 2],
        2:[1, 2],
        3:[0, 3]
    },
    I:{
        0:[0, 2],
        1:[1, 3],
        2:[0, 2],
        3:[1, 3]
    },
    F:{
        0:[0, 1],
        1:[0, 1],
        2:[2],
        3:[3]
    }
}
symmetries["\\"] = {
    0:[0],
    1:[1],
    2:[2],
    3:[3]
}

let settings = { 
    Generate: function(){ init(); },    
    Sample: "Castle",
}

function preload(){
    // Load all the XML files and images
    for(let [key, subdata] of Object.entries(data)){
        loadXML(subdata["dir"] + "data.xml", (xml) => {
            subdata["images"] = {};
            subdata["tiles"] = {};

            for(let tile of xml.getChildren('tiles')[0].getChildren('tile')){
                var name = tile.getString("name")
                subdata["tiles"][name] = tile.getString("symmetry");
                
                if (!subdata["dir"].includes("Summer")){
                    img_dir = subdata["dir"] + name + ".png";
                    subdata["images"][name] = loadImage(img_dir);
                }else{
                    n = 4
                    if (subdata["tiles"][name] == "X")
                        n = 1

                    for (let i = 0; i < n; i++) {
                        rot_name = name + " " + i;
                        img_dir = subdata["dir"] + rot_name+ ".png";
                        subdata["images"][rot_name] = loadImage(img_dir);   
                    } 
                }
            }

            subdata["neighbors"] = [];
            for(let neighbor of xml.getChildren('neighbor')){
                var new_neighbor = {
                    "left": neighbor.getString("left"),
                    "right": neighbor.getString("right")
                };
                subdata["neighbors"].push(new_neighbor);         
            }

            data[key] = subdata;
        });
    }
}

function gui(){
    // Adding the GUI menu
    var gui = new dat.GUI();
    gui.width = 150;
    gui.add(settings,'Generate');
    gui.add(    
        settings, 'Sample', 
        [ 'Castle', 'Circles', 'Circuit', 
        'Floor_Plan', 'Knots', 'Rooms', 'Summer'] );
}

function setup(){
    gui();
    createCanvas(720, 400);
    noLoop();

    for(let key of Object.keys(data)){
        grids[key] = new Grid(data[key]);
    }

    init();
}

function init(){
    background(255);
    grids[settings.Sample] = new Grid(data[settings.Sample]);
    grids[settings.Sample].compute();
    grids[settings.Sample].render();    
}

function draw(){}

