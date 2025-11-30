/**
 * Cell class for maze generation
 */
export class Cell {
    c: number;
    r: number;
    walls: { top: boolean; right: boolean; bottom: boolean; left: boolean };
    visited: boolean;

    constructor(c: number, r: number) {
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
