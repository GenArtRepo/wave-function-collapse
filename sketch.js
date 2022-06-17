/*
** Wave Function Collapse
* Cristian Rojas Cardenas, April 2022
* https://discourse.processing.org/t/wave-collapse-function-algorithm-in-processing/12983/3
*/

let dir;
let data;

let settings = { 
    Generate: function(){ init(); },    
}

function preload(){
    dir = "samples/Summer/";
    data = {}
    var xml = loadXML(dir + "data.xml", (xml) => {
        data["images"] = {};
        data["tiles"] = {};
        for(let tile of xml.getChildren('tile')){
            var name = tile.getString("name")
            data["tiles"][name] = tile.getString("symmetry");
            
            if (!dir.indexOf("Summer")){
                img_dir = dir + name + ".png";
                data["images"][name] = loadImage(img_dir);
            }
             
        }

        data["neighbors"] = [];
        for(let neighbor of xml.getChildren('neighbor')){
            new_neighbor = {
                "left": neighbor.getString("left"),
                "right": neighbor.getString("right")
            };
            data["neighbors"].push(new_neighbor);

            if (dir.indexOf("Summer")){
                left_img_dir = dir + neighbor.getString("left") + ".png";
                data["images"][new_neighbor["left"]] = loadImage(left_img_dir);
                right_img_dir = dir + neighbor.getString("right") + ".png";
                data["images"][new_neighbor["right"]] = loadImage(right_img_dir);
            }            
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
    
    console.log(data);
    grid = new Grid(data);
    // grid.compute();
    // grid.render();
}

function draw(){
    
}

