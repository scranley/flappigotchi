
import { TOWER } from 'game/assets';
import { getGameHeight } from '../helpers';
import { Fireball } from "game/objects";

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

export class Tower extends Phaser.Physics.Arcade.Sprite
{

	private target?: Phaser.GameObjects.Components.Transform
	private fireballs?: Phaser.Physics.Arcade.Group
	private direction = Direction.RIGHT
	private fireEvent: Phaser.Time.TimerEvent
private _health = 1
private isDead = false;
  private healthState = HealthState.IDLE
  private damageTime = 0

	constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number)
	{

	super(scene, x, y, TOWER, 0)

		// sprite
    //this.setDisplaySize(this.displayHeight * getGameHeight(scene) / 700, this.displayHeight * getGameHeight(scene) / 700); 

    this.anims.create({
      key: 'toweranim',
      frames: this.anims.generateFrameNumbers('tower' || '', { frames: [ 0,1,2,3 ]}),
      frameRate:.5,
      repeat: -1
    });
  

//	this.scene.physics.world.enable(this);
//	(this.body as Phaser.Physics.Arcade.Body).setSize(50, 50);

	this.play('toweranim')

	this.fireEvent = scene.time.addEvent({
			delay: 2000,
			callback: () => {
				this.direction = randomDirection(this.direction)
				this.fire(this.direction)
			},
			loop: true
		})

      
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
    }
    else
    {
      //this.setVelocity(dir.x, dir.y)

      this.setTint(0xff0000)

      this.healthState = HealthState.DAMAGE
      this.damageTime = 0
    }
  }



createFireball(x:number, y:number )
{
	if (!this.fireballs)
    {
      return
    }

		const myfireball1 = this.fireballs.get(this.x, this.y, 'fireball') as Fireball

    myfireball1.activate(this.x,this.y,x,y)
}

fire(direction: Direction) {

    

    const speed = 300

		switch (this.direction)
		{
			case Direction.UP:
      this.createFireball(0,-speed)
				break

			case Direction.DOWN:	
			this.createFireball(0,speed)	 
			break
			case Direction.LEFT:
			this.createFireball(-speed,0)
			break
			case Direction.RIGHT:
			this.createFireball(speed,0)
			break
		}
  
	}

	setTarget(target: Phaser.GameObjects.Components.Transform)
	{
		this.target = target
	}

    public activate = (x: number, y: number) => {
    // Physics
    //this.scene.physics.world.enable(this);  
    this.setPosition(x, y);
    this.setImmovable(true);

  } 

  preUpdate(t: number, dt: number)
  {
    super.preUpdate(t, dt)

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
  }

 public update(t: number, dt: number)
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

		if (dist < 500) {
         
        const vx = Math.cos(this.rotation) * 100;
        const vy = Math.sin(this.rotation) * 100;
(this.body as Phaser.Physics.Arcade.Body).setVelocityX(vx);
(this.body as Phaser.Physics.Arcade.Body).setVelocityY(vy);	
		} 

		const rotation = Phaser.Math.Angle.Between(x, y, tx, ty)
		this.setRotation(rotation)
	}
} 
   
 
