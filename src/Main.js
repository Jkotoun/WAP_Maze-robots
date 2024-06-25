let settingForm = document.querySelector("#settings");
let robotForm = document.querySelector("#robot");
let maze = document.querySelector(".maze");
let ctx = maze.getContext("2d");
let newMaze;
let myInterval;

//controls panel styling purposes
const header = document.querySelector('header');
const headerHeight = window.getComputedStyle(header).getPropertyValue('height');
document.documentElement.style.setProperty('--header-height', headerHeight);
//generate maze on page load
document.addEventListener('DOMContentLoaded', generateMaze);

//spawn selected type of robot to maze on click
maze.addEventListener("click", function (e) {
    e.preventDefault();
    let heuristic = document.querySelector("#robotHeuristic").value;
    let position = {
        row: Math.floor(e.offsetY / newMaze.cellSize),
        col: Math.floor(e.offsetX / newMaze.cellSize)
    };

    newMaze.createRobot(position, heuristic);
    newMaze.drawMaze();
}, false);

//generate maze on submit of generate maze button
settingForm.addEventListener("submit", generateMaze);

//key listener for player controls
document.addEventListener("keydown", function (e) {
    if (e.key === 'ArrowLeft') {
        newMaze.player.move("left");
    } else if (e.key === 'ArrowUp') {
        newMaze.player.move("up");
    } else if (e.key === 'ArrowRight') {
        newMaze.player.move("right");
    } else if (e.key === 'ArrowDown') {
        newMaze.player.move("down");
    }
    newMaze.drawMaze();
    if (newMaze.player.isFinished()) {
        let text = document.createElement("p");
        text.innerHTML = "Player has reached the finish";
        document.querySelector(".completed").appendChild(text);
        newMaze.player.setRandomPosition();
    }
});


/**
 * Generate maze of chosen size (size in row and col count) and update positions of robots every 200ms
 * @param {event} e
 */
function generateMaze(e) {
    e.preventDefault();
    const mazeSizes = {
        'small': {
            rows: 15,
            cols: 15,
        },
        'medium': {
            rows: 25,
            cols: 25,
        },
        'large': {
            rows: 35,
            cols: 35
        },
    }
    const robotsSpeeds = {
        'slow': {
            updateInterval: 500
        },
        'medium': {
            updateInterval: 150
        },
        'fast': {
            updateInterval: 75
        },
    }

    let chosenSize = document.querySelector("#mazeSize").value;
    let mazeLoops = document.querySelector("#mazeLoops").checked;
    let canvasContainer = document.querySelector(".maze-container")
    ctx.clearRect(0, 0, maze.width, maze.height);
    //calc cell size so maze fits to screen
    let cellsize = ((Math.min(canvasContainer.clientWidth, canvasContainer.clientHeight) - 50)) / (mazeSizes[chosenSize].cols)
    newMaze = new Maze(...Object.values(mazeSizes[chosenSize]), cellsize, mazeLoops);
    newMaze.createCells();
    newMaze.generateMaze();
    newMaze.createPlayer({ row: 0, col: 0 });
    newMaze.drawMaze(true);

    // Remove interval from function simulate if it exists
    if (myInterval !== undefined)
        clearInterval(myInterval);

    let interval = document.querySelector("#robotsSpeed").value;
    //set interval for one simulation step, chosen bu user
    myInterval = setInterval(simulate, robotsSpeeds[interval].updateInterval);
}
/**
 * simulation of pathfinding - updates positions of robots, checks for finish and rerenders the canvas
 */
function simulate() {
    ctx.clearRect(0, 0, maze.width, maze.height);
    for (robot of newMaze.robots) {
        robot.move();
    }
    newMaze.drawMaze();
    for (robot of newMaze.robots) {
        // Remove current robot form robots array
        // if the robot has reached the finish
        if (robot.isFinished()) {
            // Insert text to show that the robot has reached the finish
            let text = document.createElement("p");
            text.innerHTML = `${robot.name} has reached the finish`;
            document.querySelector(".completed").appendChild(text);
            newMaze.robots.splice(newMaze.robots.indexOf(robot), 1);
        }
    }

}
