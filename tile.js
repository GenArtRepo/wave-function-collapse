class Tile {
    constructor(name, symmetry, img) {
        this.name = name;
        this.symmetry = symmetry;
        this.img = img;
        this.right = [];
        this.left = [];
        this.collapse = false;
    }
}