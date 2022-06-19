class Tile {
    constructor(filename, symmetry, rotation, imgs) {
        this.filename = filename;
        this.symmetry = symmetry;
        this.rotation = rotation;
        this.rotate_render = true;

        this.name = filename + " " + rotation;
        
        this.img = this.getImage(imgs);
                
        this.connections = [new Set(), new Set(), new Set(), new Set()];
        this.collapse = false;
    }

    static build(filename, symmetry, imgs){
        var tiles = {};
        // var n = symmetry=="X" ? 1 : 4;
        for (let i = 0; i < n; i++) {
            var tile = new Tile(filename, symmetry, i, imgs);
            tiles[tile.name] = tile;
        }
        return tiles;
    }

    getImage(imgs){
        if(this.name in imgs){
            this.rotate_render = false;
            return imgs[this.name];
        }else{
            if(this.filename in imgs){
                return imgs[this.filename];
            }else{
                return imgs[this.filename + " 0"];
            }
        }
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