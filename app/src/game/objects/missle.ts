
import { getGameHeight } from '../helpers';
import { BOMB } from 'game/assets';

export class Missle extends Phaser.Physics.Arcade.Sprite{
	private target?:Phaser.Math.Vector2;
	private trackMouse?:boolean; 

 constructor(scene: Phaser.Scene) {
   super(scene, 100, 100, BOMB, 0);
   this.setOrigin(0, 0);
   this.displayHeight = getGameHeight(scene) / 7;
   this.displayWidth = getGameHeight(scene) / 7;
    
   const tx = scene.scale.width * 0.5
	const ty = scene.scale.height * 0.5

		this.target = new Phaser.Math.Vector2(tx, ty)
		this.trackMouse = false

   this.anims.create({
      key: 'bomb',
      frames: this.anims.generateFrameNumbers('bomb' || '', { frames: [ 0,1,2,3,4,5,6,7 ]}),
      frameRate: 2,
    });
//this.on('animationcomplete', this.explode, this);

 }

  public activate = () => {
    // Physics
    this.scene.physics.world.enable(this);
  // (this.body as Phaser.Physics.Arcade.Body).setVelocityX(10);
    this.anims.play('bomb', true);
  }


	setTrackMouse(enabled: boolean)
	{
		this.trackMouse = enabled
	}

	public update = () => {
    

	//const target = this.trackMouse ? this.scene.input.activePointer.position : this.target
  
  const target = this.scene.input.activePointer.position;	

	const targetAngle = Phaser.Math.Angle.Between(
		this.x, this.y,
		target.x, target.y
	)

	// clamp to -PI to PI for smarter turning
	const diff = Phaser.Math.Angle.Wrap(targetAngle - this.rotation)

	// set to targetAngle if less than turnDegreesPerFrame
	if (Math.abs(diff) < Phaser.Math.DegToRad(1.25))
	{
		this.rotation = targetAngle;
	}
	else
	{
		let angle = this.angle
		if (diff > 0)
		{
			// turn clockwise
			angle += 1.25
		}
		else
		{
			// turn counter-clockwise
			angle -= 1.25
		}
		
		this.setAngle(angle)
	}

	// move missile in direction facing
	const vx = Math.cos(this.rotation) * 100;
	const vy = Math.sin(this.rotation) * 100;

	(this.body as Phaser.Physics.Arcade.Body).setVelocityX(vx);
	(this.body as Phaser.Physics.Arcade.Body).setVelocityY(vy);

	}
}

/* Phaser.GameObjects.GameObjectFactory.register('missile', function (x, y, texture) {
	const missile = new Missile(this.scene, x, y, texture)

	this.displayList.add(missile)

    this.scene.physics.world.enableBody(missile, Phaser.Physics.Arcade.DYNAMIC_BODY)

	return missile
}) */


