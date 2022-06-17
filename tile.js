class Tile {
    constructor(filename, symmetry, rotation) {
        this.name = filename + " " + rotation;
        this.filename = filename;
        this.img;
        
        this.symmetry = symmetry;
        this.rotation = rotation;
        
        this.up = new Set();
        this.down = new Set();
        this.right = new Set();
        this.left = new Set();
        this.collapse = false;
    }

    static build(filename, symmetry){
        var tiles = [];
        for (let i = 0; i < 4; i++) {
            tiles.push(new Tile(filename, symmetry, i));
        }
        return tiles;
    }

    addNeighbor(neighbor, side){
        if(this.symmetry == "X"){
            this.right.add(neighbor);
            this.left.add(neighbor);
            this.up.add(neighbor);
            this.down.add(neighbor);
        }
        else if(this.symmetry == "T" & (this.rotation == 0 | this.rotation == 2)){
            this.right.add(neighbor);
            this.left.add(neighbor);
        }
        else if(this.symmetry == "T" & (this.rotation == 1 | this.rotation == 3)){
            this.up.add(neighbor);
            this.down.add(neighbor);
        }
        else if(this.symmetry == "L" & side == "right"){
            switch(this.rotation) {
                case 0:
                    this.right.add(neighbor);
                    break;
                case 1:
                    this.down.add(neighbor);
                    break;
                case 2:
                    this.left.add(neighbor);
                    break;
                default:
                    this.up.add(neighbor);
            }
        }
        else if(this.symmetry == "L" & side == "left"){
            switch(this.rotation) {
                case 0:
                    this.left.add(neighbor);
                    break;
                case 1:
                    this.up.add(neighbor);
                    break;
                case 2:
                    this.right.add(neighbor);
                    break;
                default:
                    this.down.add(neighbor);
                    break;
            }
        }
        else{
            throw `The Symmetry ${this.symmetry} is not implemented`;
        }
    }
}   