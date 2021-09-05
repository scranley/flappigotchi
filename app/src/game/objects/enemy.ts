//export class Enemy extends Phaser.Physics.Arcade.Sprite {
import { getGameHeight } from '../helpers';
import { LIQUIDATOR1 } from 'game/assets';

enum HealthState
{
  IDLE,
  DAMAGE,
  DEAD
}

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
private _health = 3
private isDead = false;
  private healthState = HealthState.IDLE
  private damageTime = 0

  constructor(scene: Phaser.Scene) {
    super(scene, -100, -100, LIQUIDATOR1, 0);
    this.setOrigin(0, 0);

    // sprite
    this.setDisplaySize(this.displayHeight * getGameHeight(scene) / 1400, this.displayHeight * getGameHeight(scene) / 1400);
    /* this.speed = 100;
	this.dir = 2;		// 0=up, 1=right, 2=down, 3=left
	this.dirChangeTimer = 0;
	this.alive = true */
	//this.scene.physics.world.enable(this);
	//(this.body as Phaser.Physics.Arcade.Body).setSize(45, 45);

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

  public getDead(): boolean {
    return this.isDead;
  }

  public setDead(dead: boolean): void {
    this.isDead = dead;
    this.anims.play('dead');
  }

  public get health()
  {
    return this._health
  }

  handleDamage(dir: Phaser.Math.Vector2)
  {
    if (this._health <= 0)
    {
      return
    }

    if (this.healthState === HealthState.DAMAGE)
    {
      return
    }

    --this._health

    if (this._health <= 0)
    {
      // TODO: die
      this.healthState = HealthState.DEAD
     // this.anims.play('faune-faint')
      this.setVelocity(0, 0)

      this.destroy()
    }
    else
    {
      this.setVelocity(dir.x, dir.y)

      this.setTint(0xff0000)

      this.healthState = HealthState.DAMAGE
      this.damageTime = 0
    }
  }




    destroy(fromScene?: boolean)
	{
		this.moveEvent.destroy()

		super.destroy(fromScene)
	}


    public setTarget(target: Phaser.GameObjects.Components.Transform)
	{
		this.target = target
	}



  public activate = (x: number, y: number, frame: number, velocityX: number, velocityY: number) => {
    // Physics
    //this.scene.physics.world.enable(this);
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

	switch (this.healthState)
    {
      case HealthState.IDLE:
        break

      case HealthState.DAMAGE:
        this.damageTime += dt
        if (this.damageTime >= 250)
        {
          this.healthState = HealthState.IDLE
          this.setTint(0xffffff)
          this.damageTime = 0
        }
        break
    }

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

	



  