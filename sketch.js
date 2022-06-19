/*
** Wave Function Collapse
* Cristian Rojas Cardenas, April 2022
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
    3:[3],
}

let settings = { 
    Generate: function(){ init(); },    
    Sample: "Castle",
}

function preload(){
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
    background(255);
    noLoop();

    for(let key of Object.keys(data)){
        grids[key] = new Grid(data[key]);
    }

    init();
}

function init(){
    grids[settings.Sample] = new Grid(data[settings.Sample]);
    grids[settings.Sample].compute();
    grids[settings.Sample].render();    
}

function draw(){}

