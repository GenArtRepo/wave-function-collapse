/*
** Wave Function Collapse
* Cristian Rojas Cardenas, April 2022
* https://discourse.processing.org/t/wave-collapse-function-algorithm-in-processing/12983/3
*/

let dir;
let data;

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
    }
}

let settings = { 
    Generate: function(){ init(); },    
}

function preload(){
    dir = "samples/Summer/";
    data = {}
    loadXML(dir + "data.xml", (xml) => {
        data["images"] = {};
        data["tiles"] = {};
        for(let tile of xml.getChildren('tile')){
            var name = tile.getString("name")
            data["tiles"][name] = tile.getString("symmetry");
            
            if (!dir.includes("Summer")){
                img_dir = dir + name + ".png";
                data["images"][name] = loadImage(img_dir);
            }else{
                n = 4
                if (data["tiles"][name] == "X")
                    n = 1

                for (let i = 0; i < n; i++) {
                    rot_name = name + " " + i;
                    img_dir = dir + rot_name+ ".png";
                    data["images"][rot_name] = loadImage(img_dir);   
                } 
            }
             
        }

        data["neighbors"] = [];
        for(let neighbor of xml.getChildren('neighbor')){
            var new_neighbor = {
                "left": neighbor.getString("left"),
                "right": neighbor.getString("right")
            };
            data["neighbors"].push(new_neighbor);         
        }
    });
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

function init(){
    background(0);
    grid = new Grid(data);
    grid.compute();
    grid.render();
}

function draw(){
    
}

