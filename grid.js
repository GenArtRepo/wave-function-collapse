class Grid {
    constructor(dir, tiles, dx, dy) {
        this.dir = dir
        this.tiles = tiles;
        this.cells = [];
        this.dx = dx;
        this.dy = dy;
        this.width = floor(width/dx);
        this.height = floor(height/dy);

        for (let i = 0; i < this.width; i++) {
            this.cells[i] = [];
            for (let j = 0; j < this.height; j++) {
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
                return new Promise((resolve, reject) => {
                    tiles.forEach((tile, index, array) => {
                        var name = tile.getAttribute('name');
                        var symmetry = tile.getAttribute('symmetry');
                        loadImage(dir + name + ".png", img => {
                            data[name] = new Tile(name, symmetry, img);
                            if (Object.keys(data).length === array.length){
                                resolve(data);
                            } 
                        });
                    });
                })
                .then(data => {
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
    
                    return new Grid(
                        dir, tiles, 
                        tiles[0].img.width, 
                        tiles[0].img.height
                    )
                })

            })
    }

    compute() {
        
    }

    render(){
        console.log(this.dx, this.dy);
        console.log(this.cells[0][0].tiles)
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                image(this.cells[i][j].tiles[0].img, i*this.dx, j*this.dy, this.dx, this.dy);
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
