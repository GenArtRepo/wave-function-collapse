class Tile {
    constructor(filename, symmetry, rotation, imgs) {
        this.name = filename + " " + rotation;
        this.filename = filename;
        this.symmetry = symmetry;
        this.rotation = rotation;
        this.rotate_render = true;

        this.img = this.getImage(imgs);
                
        this.connections = [new Set(), new Set(), new Set(), new Set()];
        this.collapse = false;
    }

    static build(filename, symmetry, imgs){
        var tiles = {};
        for (let i = 0; i < 4; i++) {
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