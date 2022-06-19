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
}   