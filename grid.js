class Grid {
    constructor(data) {
        this.dx = data["images"][Object.keys(data["images"])[0]].width;
        this.dy = data["images"][Object.keys(data["images"])[0]].height;

        this.width = floor(width/this.dx);
        this.height = floor(height/this.dy);

        this.tiles = this.buildTiles(data);

        this.cells = [];
        for (let i = 0; i < this.width; i++) {
            this.cells[i] = [];
            for (let j = 0; j < this.height; j++) {
                this.cells[i][j] = new Cell(i, j, this.tiles);
            }
        }
    }

    buildTiles(data){
        var tiles = {};
        for(let [tile, symmetry] of Object.entries(data["tiles"]))
            tiles = Object.assign({}, tiles, 
                Tile.build(tile, symmetry, data['images']));

        for(let link of data["neighbors"]){
            var left = link["left"];
            var right = link["right"];

            tiles[left].addNeighbor(right, 'right');    
            tiles[right].addNeighbor(left, 'left'); 
        }

        var list_tiles = [];
        for(let tile of Object.keys(tiles))
            list_tiles.push(tiles[tile]);

        return list_tiles;
    }

    addLink(tile_name){
        tile_base = tile_names.split(" ")[0];
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
                if(this.cells[i][j].tiles.length > 0){
                    var tile = this.cells[i][j].tiles[0];
                    push();
                    // imageMode(CENTER);
                    
                    translate(i*this.dx, j*this.dy);
                    if(tile.rotate_render)
                        rotate(PI/2*tile.rotation);
                    image(tile.img, 0, 0, this.dx, this.dy);
                    pop();
                }
                else
                    console.log(i, j);
            }
        }
    }
}



class Cell{
    constructor(x, y, tiles){
        this.x = x;
        this.y = y;
        this.tiles = tiles;
        this.entropy = Infinity;
    }
}
