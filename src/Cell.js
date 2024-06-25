/**
 * 
 * @classdesc Represents one cell in maze
 * @class 
 */
class Cell {
    /**
     * 
     * @param {Maze} parent - parent maze of cell 
     * @param {int} row - row index
     * @param {int} col - col index
     * @param {int} cellSize - size of cell, in pixels
     */
    constructor(parent, row, col, cellSize) {
        this.parent = parent;
        this.row = row;
        this.col = col;
        this.cellSize = cellSize;
        this.walls = { topWall: false, rightWall: false, bottomWall: false, leftWall: false };
        this.isFinish = false;

        // Set top and left walls to true for first row and column
        if (row === 0) {
            this.walls.topWall = true;
        }

        if (col === 0) {
            this.walls.leftWall = true;
        }

        // Set bottom and right walls to true for last row and column
        if (row === parent.rows - 1) {
            this.walls.bottomWall = true;
        }

        if (col === parent.cols - 1) {
            this.walls.rightWall = true;
        }
    }
    /**
     * set this sell as finish
     */
    setAsFinish() {
        this.isFinish = true;
    }

    /**
     * Draw top, right, bottom, left walls of cell based on walls object 
     */
    drawCell() {
        let x = this.col * this.cellSize;
        let y = this.row * this.cellSize;
        let walls = this.walls;

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";

        if (walls.topWall) {
            ctx.moveTo(x, y);
            ctx.lineTo(x + this.cellSize, y);
        }

        if (walls.rightWall) {
            ctx.moveTo(x + this.cellSize, y);
            ctx.lineTo(x + this.cellSize, y + this.cellSize);
        }

        if (walls.bottomWall) {
            ctx.moveTo(x + this.cellSize, y + this.cellSize);
            ctx.lineTo(x, y + this.cellSize);
        }

        if (walls.leftWall) {
            ctx.moveTo(x, y + this.cellSize);
            ctx.lineTo(x, y);
        }

        ctx.stroke();

        if (this.isFinish) {
            ctx.fillStyle = "#31ed51de";
            ctx.fillRect(x, y, this.cellSize, this.cellSize);
        }
    }
}