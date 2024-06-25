
/**
 * @classdesc Robot which follow right wall
 * @class 
 * @extends MazeRobotBasic
 * 
 */
class MazeRobotRight extends MazeRobotBasic {
  constructor(maze, position) {
    super(maze, position);
    this.imagePath = './img/robotRight.webp';
    this.movingDirection = 'right';
    this.name = 'Right wall follower robot'
  }

  /**
   * One step of robot based on state
   */
  move() {
    //direction right, relative to current robots direction
    let rightRelativeDirection = this.directionRelativeRight(this.movingDirection)
    //no wall to the right - turn right
    if (!this.isWallInDirection(rightRelativeDirection)) {
      this.position = this.nextPosition(this.position, rightRelativeDirection);
      this.movingDirection = rightRelativeDirection;
    }
    //otherwise try to go in same direction
    else if (!this.isWallInDirection(this.movingDirection)) {
      this.position = this.nextPosition(this.position, this.movingDirection);
    }
    //otherwise turn left
    else {
      let leftRelativeDirection = this.directionRelativeLeft(this.movingDirection)
      this.movingDirection = leftRelativeDirection;
      if(this.isWallInDirection(this.movingDirection ))
      {
        //turn left 2 times
        this.movingDirection = this.directionRelativeLeft(this.movingDirection)
      }
      this.position = this.nextPosition(this.position, this.movingDirection)
    }
  }
}