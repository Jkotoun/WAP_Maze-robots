
/**
 * @classdesc Robot using tremaux's algorithm to find finish
 * @class 
 * @extends MazeRobotBasic
 * 
 */
class MazeRobotTremaux extends MazeRobotBasic {
  /**
   * 
   * @param {Maze} maze
   * @param {{col:int, row:int}} position - spawn position
   */
  constructor(maze, position) {
    super(maze, position);
    this.imagePath = './img/tremaux.webp';
    this.name = 'Trémaux\'s algorithm robot'
    this.movingDirection = undefined;
    /**
     * hash map of all junctions found in maze. Each junction has array of possible directions with boolean indicating if it was visited
     */
    this.junctions = new Map()
    /**
     * History of robots steps
     * 
     */
    this.directionsHistory = [];
    /**
     * Backtracking state
     * 
     */
    this.backtracking = false;
  }

  /**
   * adds junction to map at current position
   * @param {Array<{direction: string, visited: boolean}>} directions - possible paths with visited mark
   */
  addJunction(){
    let paths = []
    //not initial junction after spawn
    if(this.movingDirection !== undefined)
    {
      paths.push({direction: this.reverseDirection(this.movingDirection), visited: true})
      let directions =  [this.directionRelativeLeft(this.movingDirection),  this.directionRelativeRight(this.movingDirection), this.movingDirection];
      directions.forEach(direction => {
        if(!this.isWallInDirection(direction))
        {
          paths.push({direction: direction, visited: false})
        }
      })
    }
    else
    {
      this.directionsClockwiseSequence.forEach(direction => {
        if(!this.isWallInDirection(direction))
        {
          let path = {direction: direction, visited: false}
          paths.push(path)
        }
      })
    }
    this.junctions.set(this.positionToMapKey(this.position), paths)
  }
  /**
   * Get path to explore (direction) at current position
   * @returns direction in string to explore. if there is no path to explore, returns null
   */
  getPathToExplore()
  {
    let junction = this.junctions.get(this.positionToMapKey(this.position));
    if(junction === undefined)
    {
      return null;
    }
    else
    {
      let unvisited_path_index = junction.findIndex(path => path.visited === false)
      if(unvisited_path_index === -1)
      {
        return null;
      }
      else
      {
        junction[unvisited_path_index].visited = true
        this.junctions.set(this.positionToMapKey(this.position), junction)

        return junction[unvisited_path_index].direction
      }
    }
  }
  /**
   * Checks if current position is junction
   * @returns true if exists alternative path to left or right, false otherwise
   */
  currentPositionIsJunction()
  {
    return !this.isWallInDirection(this.directionRelativeLeft(this.movingDirection)) 
    || !this.isWallInDirection(this.directionRelativeRight(this.movingDirection))
    || this.junctions.has(this.positionToMapKey(this.position))
  }

  /**
   * returns previous position in maze based on steps history stack
   * @returns {{col: int, row: int}}}
   */
  previousPosition(){
    let lastMoveDirection = this.directionsHistory.pop()
    return this.nextPosition(this.position, this.reverseDirection(lastMoveDirection))
  }
  /**
   * 
   * @param {{col: int, row: int}} position - position in maze 
   * @returns mapping to key for junctions map
   */
  positionToMapKey(position)
  { 
    return `${position.row}-${position.col}`
  }

  /**
   * one step of robot based on state
   */
  move() {
    //set moving direction or backtracking
    if(!this.backtracking)
    {
      if(this.movingDirection === undefined)
      {
        this.addJunction()
        this.movingDirection = this.getPathToExplore()
      }
      else if(this.currentPositionIsJunction())
      {
        if(!this.junctions.has(this.positionToMapKey(this.position)))
        {
          this.addJunction(this.position)
        }
        let pathToExplore = this.getPathToExplore()
        if(pathToExplore !== null)
        {
          this.movingDirection = pathToExplore 
        }
        else
        {
          //backtrack to prev junction
          this.backtracking = true; 
        }
      }
    }
    //set next position
    if(this.backtracking || this.isWallInDirection(this.movingDirection))
    {
      this.position = this.previousPosition();
      if(this.currentPositionIsJunction())
      {
        this.backtracking = false;
      }
      else
      {
        this.backtracking = true
      }
    }
    else
    {
      this.position = this.nextPosition(this.position, this.movingDirection);
      this.directionsHistory.push(this.movingDirection);
    }
  }
}