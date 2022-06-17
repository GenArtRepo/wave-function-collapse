class Grid {
    constructor(data) {
        this.tiles = this.buildTiles(data);
        this.cells = [];

        this.dx = data["images"][Object.keys(data["images"])[0]].width;
        this.dy = data["images"][Object.keys(data["images"])[0]].height;

        this.width = floor(width/this.dx);
        this.height = floor(height/this.dy);

        for (let i = 0; i < this.width; i++) {
            this.cells[i] = [];
            for (let j = 0; j < this.height; j++) {
                this.cells[i][j] = new Cell(i, j, this.tiles);
            }
        }
        
    }

    buildTiles(data){
        console.log(data["tiles"]);
        for(let tile of Object.entries(data["tiles"])){
            console.log(tile);
        }

        return data['tiles'];
    }


    static build(dir){    
        return fetch(dir + "data.xml")
            .then(response => response.text())
            .then(text => {
                var parser = new DOMParser();
                var xmlDOM = parser.parseFromString(text,"application/xml");
                           
                var tiles_xml = xmlDOM.querySelectorAll("tile");
                var tiles_raw = {}
                tiles_xml.forEach(tile => {
                    tiles_raw[tile.getAttribute('name')] = tile.getAttribute('symmetry');
                });

                var data = {}; 
                var neighbors = xmlDOM.querySelectorAll("neighbor");
                neighbors.forEach(neighbor => {
                              
                    var left = neighbor.getAttribute('left');
                    if(!(left in data)){
                        var filename = left.split(" ")[0];
                        var symmetry = tiles_raw[filename];
                        for(let tile of Tile.build(filename, symmetry))
                            data[tile.name] = tile;
                    } 

                    var right = neighbor.getAttribute('right');
                    if(!(right in data)){
                        var symmetry = tiles_raw[right.split(" ")[0]];
                        var rotation = right.split(" ")[1];
                        data[right] = new Tile(right, symmetry, rotation);
                    } 
                    
                    data[left].addNeighbor(right, 'right');    
                    data[right].addNeighbor(left, 'left');                 

                });

                return new Promise((resolve, reject) => {
                    var tiles = []

                    for(let tile in data){

                        // console.log(checkImage(dir + data[tile].filename + ".png"));

                        loadImage(data[tile].dir, img => {
                            data[tile].img = img
                            tiles.push(data[tile]);

                            if (tiles.length == Object.keys(data).length)
                                resolve(
                                    new Grid(
                                        dir, tiles, 
                                        data[tile].img.width, 
                                        data[tile].img.height
                                    )
                                ) 
                        });    
                    }                    
                })
            })
    }

    

    select_random_tile_at_random_cell(){
        var i = Math.floor(Math.random()*this.width);
        var j = Math.floor(Math.random()*this.height);

        var i_tile = Math.floor(Math.random()*this.cells[i][j].tiles.length);
        this.cells[i][j].tiles = [this.cells[i][j].tiles[i_tile]];
        return [i, j];
    }

    collapse(cords){
        

        var changes = true;
        var queue = [cords];

        while(changes){

            var cords = queue.pop(0);
            var x = cords[0];
            var y = cords[1];

            var right = new Set();
            var left = new Set();
            for(let tile of this.cells[x][y].tiles){
                right = new Set([...right, ...tile.right]);
                left = new Set([...left, ...tile.left]);
            }

            console.log(this.cells[x][y].tiles);
                
            changes = false;
            //Right
            if(x + 1 >= 0 & x + 1 < this.cells.length){
                var tiles = []
                for(let tile of this.cells[x+1][y].tiles){
                    
                    if(right.has(tile.filename)){
                        tiles.push(tile);
                    }else{
                        changes = true;
                        queue.push([x+1, y]);
                    }        
                }
                
                console.log(right);
                console.log(tiles);
                this.cells[x+1][y].tiles = tiles;
            }

        }
        
    }

    compute(){
        var cords = this.select_random_tile_at_random_cell()
        this.collapse(cords);
    }    

    render(){
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                image(
                    this.cells[i][j].tiles[0].img, 
                    i*this.dx, j*this.dy, this.dx, this.dy);
            }
        }
    }
      
}

function checkImage(dir) {
    console.log(dir);
    fetch(dir, { method: 'HEAD' })
        .then(res => {
            console.log(res);
            if (res.ok)
                return true;
            return false;
        })
}

class Cell{
    constructor(x, y, tiles){
        this.x = x;
        this.y = y;
        this.tiles = tiles;
        this.entropy = Infinity;
    }
}
