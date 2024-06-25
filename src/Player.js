/**
 * @classdesc Player character
 * @class
 */
class Player {
    /**
     * 
     * @param {Maze} maze 
     * @param {{row:int, col:int}} position 
     */
    constructor(maze, position) {
        this.maze = maze;
        this.position = position;
        this.imagePath = './img/character.webp';
    }
    /**
     * move to next cell in direction if theres no wall
     * @param {string} direction direction of movement 
     */
    move(direction) {
        let nextPosition = { row: this.position.row, col: this.position.col };

        if (direction == "left") {
            nextPosition.col -= 1;
        } else if (direction == "up") {
            nextPosition.row -= 1;
        } else if (direction == "right") {
            nextPosition.col += 1;
        } else if (direction == "down") {
            nextPosition.row += 1;
        }

        if (!this.maze.isWall(this.position, nextPosition)) {
            this.position = nextPosition;
        }
    }
    /**
     * render player icon in maze
     */
    draw() {
        let x = this.position.col * this.maze.cellSize;
        let y = this.position.row * this.maze.cellSize;

        let img = new Image();
        img.src = this.imagePath;
        ctx.drawImage(img, x + 5, y + 5, this.maze.cellSize - 10, this.maze.cellSize - 10);
    }
    /**
     * Check if player finished
     * @returns {boolean} 
     */
    isFinished() {
        return this.maze.isFinish(this.position);
    }
    /**
     * respawn player on random position after finishing
     */
    setRandomPosition() {
        let row = Math.floor(Math.random() * this.maze.rows);
        let col = Math.floor(Math.random() * this.maze.cols);
        this.position = { row, col };
    }
}