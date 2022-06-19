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

        this.changes;
        this.queue = [];

        this.entropy_cells = [];
    }



    buildTiles(data){
        var tiles = {};
        for(let [tile, symmetry] of Object.entries(data["tiles"]))
            tiles = Object.assign({}, tiles, 
                Tile.build(tile, symmetry, data['images']));

        for(let link of data["neighbors"]){
            var left, l_rotation;
            [left, l_rotation] = link["left"].split(" ");
            l_rotation = parseInt(l_rotation);
            if(typeof l_rotation === 'undefined')
                l_rotation = 0
            var l_symetry = tiles[left + " " + l_rotation].symmetry;
            
            var right, r_rotation;
            [right, r_rotation] = link["right"].split(" ");
            r_rotation = parseInt(r_rotation);
            if(typeof r_rotation === 'undefined')
                r_rotation = 0
            var r_symetry = tiles[right + " " + r_rotation].symmetry
            

            // [R1, C1, R2, C2]

            // TT
            // [0, 2, 0, 0] [0, 0, 0, 0]
            // ┴T
            // [0, 0, 2, 2] [0, 2, 2, 2]

            // T┴
            // [0, 2, 2, 0] [0, 0, 2, 0]
            // [0, 0, 0, 2] [0, 2, 0, 2]

            // XT
            // [0, 2, 0, 0] [0, 0, 0, 0]
            // [0, 3, 1, 1] [0, 1, 1, 1]
            // [0, 0, 2, 2] [0, 2, 2, 2]
            // [0, 1, 3, 3] [0, 3, 3, 3]

            // X┴ 
            // [0, 2, 2, 0] [0, 0, 2, 0]
            // [0, 3, 3, 1] [0, 1, 3, 1]
            // [0, 0, 0, 2] [0, 2, 0, 2]
            // [0, 1, 1, 3] [0, 3, 1, 3]


            // TL    
            // [0, 2, 0, 0] [0, 0, 0, 0]
            // [0, 0, 2, 2] [0, 2, 2, 2]


            // T┌
            // [0, 0, 1, 2] [0, 2, 1, 0]
            // [0, 2, 3, 0] [0, 0, 3, 0]

            var l_syms = symmetries[l_symetry][(2 + l_rotation) % 4];
            var r_syms = symmetries[r_symetry][r_rotation % 4];
            console.log(l_syms, r_syms);

            console.log(left, l_rotation, l_symetry, right, r_rotation, r_symetry);
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++){
                    var new_l_rotation = (l_rotation + j) % 4;
                    var new_r_rotation = (r_rotation + i) % 4;

                    var l_connection = (4*3 + 2 - i - j) % 4;
                    var r_connection = (4*3 - i - j) % 4;

                    console.log(new_l_rotation, l_connection, new_r_rotation, r_connection);

                    console.log(l_connection, j, r_connection, i, (4 + l_connection + j)%4, (4 + r_connection + i)%4)
                    if(
                        l_syms.includes((l_rotation + l_connection + j)%4) & 
                        r_syms.includes((r_rotation + r_connection + i)%4) & 
                        (4+l_connection-2)%4 == r_connection){
                            
                        for(let k=0; k<4; k++){
                            var outer_l_rotation = (new_l_rotation + k) % 4;
                            var outer_r_rotation = (new_r_rotation + k) % 4;

                            // console.log(l_connection)
                            var outer_l_connection = (4 + l_connection - k) % 4;
                            var outer_r_connection = (4 + r_connection - k) % 4;
                            // console.log(outer_l_connection)

                            console.log([outer_l_rotation, outer_l_connection, outer_r_rotation, outer_r_connection]);
                            tiles[left + " " + outer_l_rotation].connections[outer_l_connection].add(right + " " + outer_r_rotation);
                            tiles[right + " " + outer_r_rotation].connections[outer_r_connection].add(left + " " + outer_l_rotation);
                        }
                    }  
                }
            }           
        }

        console.log(tiles["waterside 0"],);

        var list_tiles = [];
        for(let tile of Object.keys(tiles))
            list_tiles.push(tiles[tile]);

        return list_tiles;
    }

    updateEntropy(){
        this.entropy_cells = [];
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                if(this.cells[i][j].tiles.length > 1)
                    this.entropy_cells.push([i, j]);
            }
        }
    }
  
    collapse(){
        
        var cell = Math.floor(Math.random()*this.entropy_cells.length);
        var i = this.entropy_cells[cell][0];
        var j = this.entropy_cells[cell][1];

        var i_tile = Math.floor(Math.random()*this.cells[i][j].tiles.length);
        this.cells[i][j].tiles = [this.cells[i][j].tiles[i_tile]];

        // console.log(i, j, this.cells[i][j].tiles[0].name)

        return [i, j];
    }
    

    propagate(cords){
        this.changes = true;
        this.queue = [cords];

        var i = 0;
        while(this.queue.length > 0){

            var cords = this.queue.pop(0);
            var x = cords[0];
            var y = cords[1];
        

            var t_connections = [new Set(), new Set(), new Set(), new Set()]
            for(let tile of this.cells[x][y].tiles){
                for(let i = 0; i < 4; i++)
                    t_connections[i] = new Set([...t_connections[i], ...tile.connections[i]]);
            }

            //Left
            this.updateCell(x-1, y, t_connections[0]);
            //Up
            this.updateCell(x, y-1, t_connections[1]);
            //Right
            this.updateCell(x+1, y, t_connections[2]);
            //Down
            this.updateCell(x, y+1, t_connections[3]);
        }
    }

    updateCell(x, y, allowed_tiles){
        if(x >= 0 & x < this.cells.length){
            if(y >= 0 & y < this.cells[x].length){
                var tiles = []
                for(let tile of this.cells[x][y].tiles){
                    if(allowed_tiles.has(tile.name)){
                        tiles.push(tile);
                    }      
                }

                if(tiles.length != this.cells[x][y].tiles.length){
                    if(tiles.length<1){
                        this.changes = false;
                        // console.log(x,y, "no length");
                        // console.log(allowed_tiles);
                        // console.log(this.cells[x][y].tiles)
                        return;
                    }
                    this.queue.push([x, y]);
                    this.cells[x][y].tiles = tiles;

                    // console.log(x, y, tiles);
                }
            }
        }
    }

    compute(){
        this.updateEntropy();

        while(this.entropy_cells.length > 0){
            var cords = this.collapse()
            this.propagate(cords);
            this.updateEntropy();
        }
        
    }    

    render(){
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                if(this.cells[i][j].tiles.length > 0){
                    var tile = this.cells[i][j].tiles[0];
                    push();                  
                    translate(i*this.dx + this.dx/2, j*this.dy + this.dy/2);
                    if(tile.rotate_render)
                        rotate(-PI/2*tile.rotation);
                    imageMode(CENTER);
                    image(tile.img, 0, 0, this.dx, this.dy);
                    pop();
                }
                else{
                    // console.log(i, j);
                }
                    
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
