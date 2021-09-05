
import { getGameHeight } from '../helpers';
import { SLIME } from 'game/assets';

enum HealthState
{
  IDLE,
  DAMAGE,
  DEAD
}

export class Slime extends Phaser.Physics.Arcade.Sprite{
private target?: Phaser.GameObjects.Components.Transform
 private _health = 3
 private isDead = false;
   private healthState = HealthState.IDLE
  private damageTime = 0
  private inCombat: boolean 


 constructor(scene: Phaser.Scene) {
   super(scene, 100, 100, SLIME, 0);
   this.displayHeight = getGameHeight(scene) / 7;
   this.displayWidth = getGameHeight(scene) / 7;
    
const tx = scene.scale.width * 0.5
const ty = scene.scale.height * 0.5

		// sprite
    this.setDisplaySize(this.displayHeight * getGameHeight(scene) / 1000, this.displayHeight * getGameHeight(scene) / 1000);

    this.inCombat = false 

   /* this.anims.create({
      key: 'slime',
      frames: this.anims.generateFrameNumbers('slime' || '', { frames: [ 0,1,2,3,4,5,6,7 ]}),
      frameRate: 2,
      repeat: -1

    }); */

 }

setTarget(target: Phaser.GameObjects.Components.Transform)
	{
		this.target = target
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


public activate = (x: number, y: number, frame: number, velocityX: number, velocityY: number) => {
    // Physics
    //this.scene.physics.world.enable(this);
    //(this.body as Phaser.Physics.Arcade.Body).setVelocityX(velocityX);
    //(this.body as Phaser.Physics.Arcade.Body).setVelocityY(velocityY);

    this.setPosition(x, y);
    this.setFrame(frame);

   // this.anims.play('slime', true);
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
     // this.setVelocity(dir.x, dir.y)

      this.setTint(0xff0000)

      this.healthState = HealthState.DAMAGE
      this.damageTime = 0
    }
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

		if (this.healthState === HealthState.DAMAGE
      || this.healthState === HealthState.DEAD
    )
    {
      return
    }   

		const tx = this.target.x
		const ty = this.target.y

		const x = this.x
		const y = this.y

		const dist = Phaser.Math.Distance.BetweenPoints(this.target, this);

		if (dist < 300 || this.inCombat) {
         
        this.inCombat = true 
        const vx = Math.cos(this.rotation) * 100;
        const vy = Math.sin(this.rotation) * 100;
(this.body as Phaser.Physics.Arcade.Body).setVelocityX(vx);
(this.body as Phaser.Physics.Arcade.Body).setVelocityY(vy);	
		} 

		const rotation = Phaser.Math.Angle.Between(x, y, tx, ty)
		this.setRotation(rotation)
	}
} 



