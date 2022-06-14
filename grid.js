class Grid {
    constructor(dir, tiles, dx, dy) {
        this.dir = dir
        this.tiles = tiles;
        this.cells = [];
        this.dx = dx;
        this.dy = dy;

        for (let i = 0; i < floor(width/dx); i++) {
            this.cells[i] = [];
            for (let j = 0; j < floor(height/dy); j++) {
                this.cells[i][j] = new Cell(i, j, tiles);
            }
        }
        
    }


    static build(dir){    
        return fetch(dir + "data.xml")
            .then(response => response.text())
            .then(text => {
                var parser = new DOMParser();
                var xmlDOM = parser.parseFromString(text,"application/xml");
    
                var data = {};            
    
                var tiles = xmlDOM.querySelectorAll("tile");
                var img;
                tiles.forEach(tile => {
                    name = tile.getAttribute('name');
                    var symmetry = tile.getAttribute('symmetry');
                    img = loadImage(dir + name + ".png");
                    data[name] = new Tile(name, symmetry, img);

                    if(typeof img === undefined){
                        console.log(img);
                    }
                });
    
                var neighbors = xmlDOM.querySelectorAll("neighbor");
                neighbors.forEach(neighbor => {
                    var left = neighbor.getAttribute('left');
                    left = left.split(" ")[0];
                    var right = neighbor.getAttribute('right');
                    right = right.split(" ")[0];
                    data[left].right.push(right);
                    data[right].left.push(left);
                });

                tiles = []
                for(let tile in data){
                    tiles.push(data[tile])
                }

                
    
                return new Grid(dir, tiles, img.width, img.height)
            })
    }

    compute() {
        
    }

    render(){
        var tile = this.cells[0][0].possible_tiles[1];
        console.log(tile.name, tile.img);
        image(tile.img, 0, 0, 200, 200);
        for (let i = 0; i < floor(width/this.dx); i++) {
            this.cells[i] = [];
            for (let j = 0; j < floor(height/this.dy); j++) {
                // console.log("a", this.cells[i][j]);
                image(tile.img, i*this.dx, j*this.dy, this.dx, this.dx);
                try {
                    // image(this.cells[i][j].possible_tiles[0].img, i*this.dx, j*this.dy, this.dx, this.dy);
                } catch (error) {
                    // console.log(i,j)
                }
            }
        }
    }
}

class Cell{
    constructor(x, y, tiles){
        this.x = x;
        this.y = y;
        this.possible_tiles = tiles;
        this.entropy = Infinity;
    }
}
