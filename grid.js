class Grid {
    constructor(data) {
        // Cells width and height
        this.dx = data["images"][Object.keys(data["images"])[0]].width;
        this.dy = data["images"][Object.keys(data["images"])[0]].height;

        // Grid width and heigth
        this.width = floor(width/this.dx);
        this.height = floor(height/this.dy);

        // List of all the possible tiles
        this.tiles = this.buildTiles(data);

        // Build the cells of the grid
        this.cells = [];
        for (let i = 0; i < this.width; i++) {
            this.cells[i] = [];
            for (let j = 0; j < this.height; j++) {
                this.cells[i][j] = new Cell(i, j, this.tiles);
            }
        }

        this.queue = [];
        this.entropy_cells = [];
    }



    buildTiles(data){

        // Load the tiles with their respective symmetry and image 
        var tiles = {};
        for(let [tile, symmetry] of Object.entries(data["tiles"]))
            tiles = Object.assign({}, tiles, 
                Tile.build(tile, symmetry, data['images']));

        // Add each one of the links
        for(let link of data["neighbors"]){

            // Load tile, rotation and symmetry for the right and left tiles 
            // of the link

            var left, l_rotation;
            [left, l_rotation] = link["left"].split(" ");
            l_rotation = parseInt(l_rotation);
            if(isNaN(l_rotation))
                l_rotation = 0

            var l_symetry = tiles[left + " " + l_rotation].symmetry;
            
            var right, r_rotation;
            [right, r_rotation] = link["right"].split(" ");
            r_rotation = parseInt(r_rotation);
            if(isNaN(r_rotation))
                r_rotation = 0
            var r_symetry = tiles[right + " " + r_rotation].symmetry
            

            // Load the list of simmetry sides of the original tile 
            var l_syms = symmetries[l_symetry][(2 + l_rotation) % 4];
            var r_syms = symmetries[r_symetry][r_rotation % 4];

            // Rotate the left tile
            for (let i = 0; i < 4; i++) {
                // Rotate the right tile 
                for (let j = 0; j < 4; j++){

                    // Current rotation
                    var new_l_rotation = (l_rotation + j) % 4;
                    var new_r_rotation = (r_rotation + i) % 4;

                    // The new connections in the current rotation 
                    var l_connection = (4*3 + 2 - i - j) % 4;
                    var r_connection = (4*3 - i - j) % 4;

                    // Check symmetry and connection
                    if(
                        l_syms.includes((l_rotation + l_connection + j)%4) & 
                        r_syms.includes((r_rotation + r_connection + i)%4) & 
                        (4+l_connection-2)%4 == r_connection 
                        ){

                        // Add all the possible combination rotations
                        for(let k=0; k<4; k++){
                            var outer_l_rotation = (new_l_rotation + k) % 4;
                            var outer_r_rotation = (new_r_rotation + k) % 4;

                            var outer_l_connection = (4 + l_connection - k) % 4;
                            var outer_r_connection = (4 + r_connection - k) % 4;

                            tiles[left + " " + outer_l_rotation].connections[outer_l_connection].add(right + " " + outer_r_rotation);
                            tiles[right + " " + outer_r_rotation].connections[outer_r_connection].add(left + " " + outer_l_rotation);
                        }
                    }  
                }
            }           
        }

        // Build the list 
        var list_tiles = [];
        for(let tile of Object.keys(tiles))
            list_tiles.push(tiles[tile]);

        return list_tiles;
    }

    updateEntropy(){
        // Generate a list with all the cells that contain more that one tile
        this.entropy_cells = [];
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                if(this.cells[i][j].tiles.length > 1)
                    this.entropy_cells.push([i, j]);
            }
        }
    }
  
    collapse(){
        // Select a random tile for a random cell in the entropy list 
        var cell = Math.floor(Math.random()*this.entropy_cells.length);
        var i = this.entropy_cells[cell][0];
        var j = this.entropy_cells[cell][1];

        var i_tile = Math.floor(Math.random()*this.cells[i][j].tiles.length);
        this.cells[i][j].tiles = [this.cells[i][j].tiles[i_tile]];

        return [i, j];
    }
    

    propagate(cords){
        // Iterate over the grid and update the new possible tiles of each cell
        // after their neighbors collapsing it

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
        // Update the tiles of a cell given a list of allowed tiles
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
                        return;
                    }
                    this.queue.push([x, y]);
                    this.cells[x][y].tiles = tiles;
                }
            }
        }
    }

    compute(){
        this.updateEntropy();

        while(this.entropy_cells.length > 0){
            // 1. Collapse 
            var cords = this.collapse()
            // 2. Propagate
            this.propagate(cords);
            // 3. Update Entropy
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
            }
        }
    }
}