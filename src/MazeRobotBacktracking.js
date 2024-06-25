
/**
 * @classdesc Backtracking algorithm robot
 * @class 
 * @extends MazeRobotBasic
 */
class MazeRobotBacktracking extends MazeRobotBasic {
  constructor(maze, position) {
    super(maze, position);
    this.imagePath = './img/backtracking.webp';
    this.name = 'Backtracking robot'
    this.movingDirection = undefined;
    /**
     * stack of nodes with unexplored paths
     */
    this.nodesStack = []
    /**
     * backtracking state
     */
    this.backtracking = false;
    /**
     * History of robots steps
     */
    this.directionsHistory = [];
    /**
     * init the nodes stack with possible directions from start
     */
    this.directionsClockwiseSequence.forEach(possibleDirection =>{
      if(!this.isWallInDirection(possibleDirection))
      {
        this.nodesStack.push({
          position: this.position,
          direction: possibleDirection
        })
      }
    })
    this.backtrackingGoalNode = {};
  }
  /**
   * 
   * @returns array of alternative directions in cell which can robot explore later
   */
  alternativePathsNodes()
  {
    let nodes = []
    let arr = [this.directionRelativeLeft(this.movingDirection), this.directionRelativeRight(this.movingDirection)]
    arr.forEach(alternativeDirection =>{
      if(!this.isWallInDirection(alternativeDirection))
      { 
        nodes.push({
          position: this.position,
          direction: alternativeDirection
        })
      }
    })
    return nodes;
  }
  /**
   * One step of robot based on state
   */
  move() {
    //store alternative paths when exploring
    if(this.movingDirection !== undefined && !this.backtracking)
    {
      this.alternativePathsNodes().forEach(alternativePathNode => {
        this.nodesStack.push(alternativePathNode)});
    }
    //get first move direction at start
    if(this.movingDirection === undefined)
    {
      let node = this.nodesStack.pop();
      this.position = node.position;
      this.movingDirection = node.direction;
    }
    //backtracking to not explored path
    else if(this.backtracking)
    {
      //backtracked to intersection which leads to some of unexplored paths
      if(this.position.col == this.backtrackingGoalNode.position.col && this.position.row == this.backtrackingGoalNode.position.row )
      {
        this.backtracking = false;
        //move in direction of unexplored path
        this.movingDirection = this.backtrackingGoalNode.direction;
        this.position = this.nextPosition(this.position,this.movingDirection);
        this.directionsHistory.push(this.movingDirection);
        this.backtrackingGoalNode = {};
      }
      //not there yet, continue to backtrack to intersection
      else
      {
        let directionsHistoryLast = this.directionsHistory.pop()
        this.position = this.nextPosition(this.position, this.reverseDirection(directionsHistoryLast ));
      }
    }
    //reached wall
    else if(this.isWallInDirection(this.movingDirection))
    {
      
      this.backtrackingGoalNode = this.nodesStack.pop();
      //not dead end, can turn to left or right
      if(this.position.col == this.backtrackingGoalNode.position.col && this.position.row == this.backtrackingGoalNode.position.row )
      {
        this.position = this.nextPosition(this.position, this.backtrackingGoalNode.direction);
        this.directionsHistory.push(this.backtrackingGoalNode.direction);
        this.movingDirection = this.backtrackingGoalNode.direction;
        this.backtracking = false;
        this.backtrackingGoalNode = {}
      }
      else //dead end = backtrack
      {
        let directionsHistoryLast = this.directionsHistory.pop()
        this.position = this.nextPosition(this.position, this.reverseDirection(directionsHistoryLast ));
        this.backtracking = true;
      }
    }
    //can continue in same direction
    else
    {
      this.position = this.nextPosition(this.position, this.movingDirection);
      this.directionsHistory.push(this.movingDirection);
    }
  }
}