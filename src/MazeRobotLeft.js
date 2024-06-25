
/**
 * @classdesc Robot which follows left wall
 * @class 
 * @extends MazeRobotBasic
 */
class MazeRobotLeft extends MazeRobotBasic {
  constructor(maze, position) {
    super(maze, position);
    this.imagePath = './img/lefthand.webp';
    this.movingDirection = 'left';
    this.name = 'Left wall follower robot'
  }

/**
 * One step of robot based on state
 */
  move() {
    //no wall to the left - turn left
    let leftRelativeDirection = this.directionRelativeLeft(this.movingDirection)
    if (!this.isWallInDirection(leftRelativeDirection)) {
      this.position = this.nextPosition(this.position, leftRelativeDirection);
      this.movingDirection = leftRelativeDirection;
    }
    //otherwise try to go in same direction
    else if (!this.isWallInDirection(this.movingDirection)) {
      this.position = this.nextPosition(this.position, this.movingDirection);
    }
    //otherwise turn right
    else {
      let rightRelativeDirection = this.directionRelativeRight(this.movingDirection)
      this.movingDirection = rightRelativeDirection;
      if(this.isWallInDirection(this.movingDirection))
      {
        //turn left 2 times
        this.movingDirection = this.directionRelativeRight(this.movingDirection)
      }
      this.position = this.nextPosition(this.position, this.movingDirection)
    }
  }
}