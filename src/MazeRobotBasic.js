
/**
 * @classdesc default robot, goes random directions
 * @class 
 */
class MazeRobotBasic {
    /**
     * 
     * @param {array<Cell>} maze - maze represented by 2d array of cells 
     * @param {{cell: int, row: int}} position - initial position of robot in maze
     */
    constructor(maze, position) {
        this.maze = maze;
        this.position = position;
        this.imagePath = './img/robot-basic.webp';
        this.name = 'Random robot'
        /**
         * Sequence of directions to calculate relative directions based on robots rotation
         */
        this.directionsClockwiseSequence = ['left', 'up', 'right', 'down']
        /**
         * mapping of directions to maze grid changes
         */
        this.directions = {
            'left': {
                row: 0,
                col: -1,
            },
            'up': {
                row: -1,
                col: 0,
            },
            'right': {
                row: 0,
                col: 1,
            },
            'down': {
                row: 1,
                col: 0,
            }
        };
        this.movingDirection = undefined;
    }
    /**
     * Calculates next position based on current position and moving direction
     * @param {{col: int, row: int}} currentPosition 
     * @param {{col: int, row: int}} direction 
     * @returns {{col: int, row: int}} - position in maze grid
     */
    nextPosition(currentPosition, direction) {
        let positionChange = this.directions[direction];
        return {
            row: currentPosition.row + positionChange.row,
            col: currentPosition.col + positionChange.col
        }
    }
    /**
     * Checks wall in direction
     * @param {string} direction 
     * @returns true or false whether there is wall in direction
     */
    isWallInDirection(direction) {
        return this.maze.isWall(this.position, this.nextPosition(this.position, direction))
    }

    /**
     * calculates relative left direction of robot based on its rotation
     * @param {string} direction 
     * @returns {string} direction
     */
    directionRelativeLeft(direction) {
        let leftRelativeDirectionIndex = ((this.directionsClockwiseSequence.indexOf(direction) - 1) + 4) % 4;
        return this.directionsClockwiseSequence[leftRelativeDirectionIndex]
    }
    /**
     * calculates relative right direction of robot based on its rotation
     * @param {string} direction 
     * @returns {string} direction
     */
    directionRelativeRight(direction) {
        return this.directionsClockwiseSequence[(this.directionsClockwiseSequence.indexOf(direction) + 1) % 4];
    }
    /**
     * calculates reverse direction of robot based on its rotation
     * @param {string} direction 
     * @returns {string} direction
     */
    reverseDirection(direction) {
        return this.directionsClockwiseSequence[(this.directionsClockwiseSequence.indexOf(direction) + 2) % 4];
    }
    /**
    * One step of robot based on state
    */
    move() {
        do {
            let randIndex = Math.floor(Math.random() * this.directionsClockwiseSequence.length);
            this.movingDirection = this.directionsClockwiseSequence[randIndex];
        } while ((this.maze.isWall(this.position, this.nextPosition(this.position, this.movingDirection))));
        this.position = this.nextPosition(this.position, this.movingDirection);
    }
    /**
     * draw robot icon on canvas
     */
    draw() {
        let x = this.position.col * this.maze.cellSize;
        let y = this.position.row * this.maze.cellSize;
        let img = new Image();
        img.src = this.imagePath;
        ctx.drawImage(img, x + 5, y + 5, this.maze.cellSize - 10, this.maze.cellSize - 10);
    }
    /**
     * 
     * @returns boolean indicating if robot has reached a finish
     */
    isFinished() {
        return this.maze.isFinish(this.position);
    }
}


