/**
 * Cell class for maze generation
 */
export class Cell {
    constructor(c, r) {
        this.c = c;  // Column
        this.r = r;  // Row
        this.walls = {
            top: true,
            right: true,
            bottom: true,
            left: true
        };
        this.visited = false;
    }
}
