//export class Enemy extends Phaser.Physics.Arcade.Sprite {
import { getGameHeight } from '../helpers';
import { LIQUIDATOR1 } from 'game/assets';

enum Direction
{
	UP,
	DOWN,
	LEFT,
	RIGHT
}

const randomDirection = (exclude: Direction) => {
	let newDirection = Phaser.Math.Between(0, 3)
	while (newDirection === exclude)
	{
		newDirection = Phaser.Math.Between(0, 3)
	}

	return newDirection
}

export class Enemy extends Phaser.Physics.Arcade.Sprite{
   private target?: Phaser.GameObjects.Components.Transform
   private direction = Direction.RIGHT
	private moveEvent: Phaser.Time.TimerEvent


  constructor(scene: Phaser.Scene) {
    super(scene, -100, -100, LIQUIDATOR1, 0);
    this.setOrigin(0, 0);
    this.displayHeight = getGameHeight(scene) / 7;
    this.displayWidth = getGameHeight(scene) / 7;
    /* this.speed = 100;
	this.dir = 2;		// 0=up, 1=right, 2=down, 3=left
	this.dirChangeTimer = 0;
	this.alive = true */
	this.scene.physics.world.enable(this);
	(this.body as Phaser.Physics.Arcade.Body).setSize(15, 15);

	scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleTileCollision, this)

		this.moveEvent = scene.time.addEvent({
			delay: 2000,
			callback: () => {
				this.direction = randomDirection(this.direction)
			},
			loop: true
		})
  
   // this.anims.create({
   //   key: 'enemy',
   //   frames: this.anims.generateFrameNumbers('enemy' || '', { frames: [ 0,1,2,3,4,5,6,7,8,9 ]}),
   //   frameRate: 2,
   // });

  }

    public setTarget(target: Phaser.GameObjects.Components.Transform)
	{
		this.target = target
	}



  public activate = (x: number, y: number, frame: number, velocityX: number, velocityY: number) => {
    // Physics
    this.scene.physics.world.enable(this);
    (this.body as Phaser.Physics.Arcade.Body).setVelocityX(velocityX);
    (this.body as Phaser.Physics.Arcade.Body).setVelocityY(velocityY);

    this.setPosition(x, y);
    this.setFrame(frame);
  }

  private handleTileCollision(go: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile)
	{
		if (go !== this)
		{
			return
		}

		this.direction = randomDirection(this.direction)
	}

  preUpdate(t: number, dt: number)
	{
		super.preUpdate(t, dt)

		const speed = 50

		switch (this.direction)
		{
			case Direction.UP:
				this.setVelocity(0, -speed)
				break

			case Direction.DOWN:
				this.setVelocity(0, speed)
				break

			case Direction.LEFT:
				this.setVelocity(-speed, 0)
				break

			case Direction.RIGHT:
				this.setVelocity(speed, 0)
				break
		}
	}



}

/* public update(t: number, dt: number)
	{
		if (!this.target)
		{
			return
		}

		const tx = this.target.x
		const ty = this.target.y

		const x = this.x
		const y = this.y

		const dist = Phaser.Math.Distance.BetweenPoints(this.target, this);

		if (dist < 300) {
         
        const vx = Math.cos(this.rotation) * 100;
        const vy = Math.sin(this.rotation) * 100;
(this.body as Phaser.Physics.Arcade.Body).setVelocityX(vx);
(this.body as Phaser.Physics.Arcade.Body).setVelocityY(vy);	
		} 

		const rotation = Phaser.Math.Angle.Between(x, y, tx, ty)
		this.setRotation(rotation)
	}
} */

	



  