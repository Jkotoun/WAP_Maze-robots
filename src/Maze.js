
/**
 * @classdesc Represents Maze 
 * @class
 */
class Maze {
    constructor(rows, cols, cellSize, mazeLoops) {
        // 2D array of cells
        this.cells = [];
        this.robots = [];
        this.player = undefined;
        this.rows = rows;
        this.cols = cols;
        this.cellSize = cellSize;
        this.height = rows * cellSize;
        this.width = cols * cellSize;
        this.cnt = 0;
        this.mazeLoops = mazeLoops;
        this.finish = {
            row: 0,
            cell: 0
        }
    }
    /**
     * create player instance and spawn him player in maze
     * @param {{row: int, col: int}} position - position where to spawn player 
     */
    createPlayer(position) {
        this.player = new Player(this, { row: position.row, col: position.col });
    }
    /**
     * spawns robot with selected strategy to maze
     * @param {{row: int, col: int}} position - selected cell where to spawn the robot
     * @param {string} heuristic - strategy of pathfinding, selected by user 
     */
    createRobot(position, heuristic) {
        if (heuristic == "random") {
            this.robots.push(new MazeRobotBasic(this, position));
        }
        else if (heuristic == "right") {
            this.robots.push(new MazeRobotRight(this, position));
        }
        else if (heuristic == "left") {
            this.robots.push(new MazeRobotLeft(this, position));
        }
        else if (heuristic == "backtracking") {
            this.robots.push(new MazeRobotBacktracking(this, position));
        }
        else if (heuristic == "tremaux") {
            this.robots.push(new MazeRobotTremaux(this, position));
        }
    }

    /**
     * Add wall between two cells
     * @param {Cell} cell1 
     * @param {Cell} cell2 
     */
    addWall(cell1, cell2) {
        let rowDiff = cell1.row - cell2.row;
        let colDiff = cell1.col - cell2.col;
        if (rowDiff === 1) {
            cell1.walls.topWall = true;
            cell2.walls.bottomWall = true;
        } else if (rowDiff === -1) {
            cell1.walls.bottomWall = true;
            cell2.walls.topWall = true;
        } else if (colDiff === 1) {
            cell1.walls.leftWall = true;
            cell2.walls.rightWall = true;
        } else if (colDiff === -1) {
            cell1.walls.rightWall = true;
            cell2.walls.leftWall = true;
        }
    }

    /**
     * Add doors between two cells
     * @param {Cell} cell1 
     * @param {Cell} cell2 
     */
    placeDoor(cell1, cell2) {
        let rowDiff = cell1.row - cell2.row;
        let colDiff = cell1.col - cell2.col;

        if (rowDiff === 1) {
            cell1.walls.topWall = false;
            cell2.walls.bottomWall = false;
        } else if (rowDiff === -1) {
            cell1.walls.bottomWall = false;
            cell2.walls.topWall = false;
        } else if (colDiff === 1) {
            cell1.walls.leftWall = false;
            cell2.walls.rightWall = false;
        } else if (colDiff === -1) {
            cell1.walls.rightWall = false;
            cell2.walls.leftWall = false;
        }
    }

    /**
     * Create a 2D array of cells
     */
    createCells() {
        for (let row = 0; row < this.rows; row++) {
            this.cells[row] = [];
            for (let col = 0; col < this.cols; col++) {
                this.cells[row][col] = new Cell(this, row, col, this.cellSize);
            }
        }
    }

    /**
     * Draw maze to canvas by drawing each cell
     * @param {boolean} setup - initial setup or not, player is rendered only on initial setup, 
     * then its rerendered on arrow keys events
     */
    drawMaze(setup = false) {
        maze.width = this.width;
        maze.height = this.height;
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                let cell = this.cells[row][col];
                cell.drawCell();
            }
        }
        for (let i = 0; i < this.robots.length; i++) {
            this.robots[i].draw();
        }
        if (!setup) {
            this.player.draw();
        }
    }
    /**
     * animation of generating maze
     * @param {chamber} currentChamber 
     * @param {boolean} mazeLoops - if maze should have loops or not
     */
    generateChambers(currentChamber, mazeLoops = false) {
        let chamberDividerRow = randomNumber(currentChamber.rowStart, currentChamber.rowEnd - 1);
        let chamberDividerCol = randomNumber(currentChamber.colStart, currentChamber.colEnd - 1);

        let chambers = [
            { rowStart: currentChamber.rowStart, rowEnd: chamberDividerRow, colStart: currentChamber.colStart, colEnd: chamberDividerCol },
            { rowStart: currentChamber.rowStart, rowEnd: chamberDividerRow, colStart: chamberDividerCol + 1, colEnd: currentChamber.colEnd },
            { rowStart: chamberDividerRow + 1, rowEnd: currentChamber.rowEnd, colStart: currentChamber.colStart, colEnd: chamberDividerCol },
            { rowStart: chamberDividerRow + 1, rowEnd: currentChamber.rowEnd, colStart: chamberDividerCol + 1, colEnd: currentChamber.colEnd }
        ]

        for (let row = currentChamber.rowStart; row < currentChamber.rowEnd + 1; row++) {
            this.addWall(this.cells[row][chamberDividerCol], this.cells[row][chamberDividerCol + 1]);
        }

        for (let col = currentChamber.colStart; col < currentChamber.colEnd + 1; col++) {
            this.addWall(this.cells[chamberDividerRow][col], this.cells[chamberDividerRow + 1][col]);
        }

        let direction = ["north", "east", "south", "west"];
        let numberOfDoors = mazeLoops ? randomNumber(3, 4) : 3;

        for (let doors = 0; doors < numberOfDoors; doors++) {
            let randomDirectionIndex = Math.floor(Math.random() * direction.length);
            let selectedWall = direction[randomDirectionIndex];
            direction.splice(randomDirectionIndex, 1);

            if (selectedWall === "north") {
                let randomRow = randomNumber(currentChamber.rowStart, chamberDividerRow);
                this.placeDoor(this.cells[randomRow][chamberDividerCol], this.cells[randomRow][chamberDividerCol + 1]);
            }
            if (selectedWall === "east") {
                let randomCol = randomNumber(chamberDividerCol + 1, currentChamber.colEnd);
                this.placeDoor(this.cells[chamberDividerRow][randomCol], this.cells[chamberDividerRow + 1][randomCol]);
            }
            if (selectedWall === "south") {
                let randomRow = randomNumber(chamberDividerRow + 1, currentChamber.rowEnd);
                this.placeDoor(this.cells[randomRow][chamberDividerCol], this.cells[randomRow][chamberDividerCol + 1]);
            }
            if (selectedWall === "west") {
                let randomCol = randomNumber(currentChamber.colStart, chamberDividerCol);
                this.placeDoor(this.cells[chamberDividerRow][randomCol], this.cells[chamberDividerRow + 1][randomCol]);
            }
        }

        this.drawMaze(true)

        for (let chamber of chambers) {
            if (chamber.colEnd - chamber.colStart >= 1 && chamber.rowEnd - chamber.rowStart >= 1) {
                this.cnt += 1;
                //window.requestAnimationFrame((timestemp) => {
                setTimeout(() => {
                    this.generateChambers(chamber, mazeLoops);
                }, 50);
                //})
            }
        }
    }

    /**
     * Recursive division algorithm to generate maze (https://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_division_method)
     */
    generateMaze() {
        let masterChamber = { colStart: 0, colEnd: this.cols - 1, rowStart: 0, rowEnd: this.rows - 1 };

        this.generateChambers(masterChamber, this.mazeLoops);

        // Select random cell and set it as the finish cell
        let finishCell = this.cells[randomNumber(0, this.rows - 1)][randomNumber(0, this.cols - 1)];
        finishCell.setAsFinish();
        this.finish = {
            row: finishCell.row,
            col: finishCell.col
        }
    }
    /**
     * check if position is in bounds of maze
     * @param {{row: int, col:int}} position 
     * @returns booleans
     */
    checkBounds(position) {
        return position.row >= 0 && position.row < this.rows && position.col >= 0 && position.col < this.cols;
    }

    /**
     * Check if between cells is a wall
     * @param {{row: int, col: int}} currentCellPos 
     * @param {{row: int, col: int}} nextCellPos 
     * @returns boolen indicating if wall is between cells
     */
    isWall(currentCellPos, nextCellPos) {
        if (this.checkBounds(currentCellPos) && this.checkBounds(nextCellPos)) {
            let rowDiff = currentCellPos.row - nextCellPos.row;
            let colDiff = currentCellPos.col - nextCellPos.col;

            let curentCell = this.cells[currentCellPos.row][currentCellPos.col];
            if (rowDiff === 1 && colDiff === 0) {
                return curentCell.walls.topWall;
            }
            if (rowDiff === 0 && colDiff === 1) {
                return curentCell.walls.leftWall;
            }
            if (rowDiff === -1 && colDiff === 0) {
                return curentCell.walls.bottomWall;
            }
            if (rowDiff === 0 && colDiff === -1) {
                return curentCell.walls.rightWall;
            }
        }
        return true;
    }

    /**
     *  Is the cell a finish cell?
     * @param {{row: int, col:int}} position 
     * @returns {boolean}
     */
    isFinish(position) {
        return this.cells[position.row][position.col].isFinish;
    }
}

