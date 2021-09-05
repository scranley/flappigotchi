
import { POTION } from 'game/assets';
import { getGameHeight } from '../helpers';

export class Potion extends Phaser.Physics.Arcade.Sprite
{
	constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number)
	{

	super(scene, x, y, POTION, 0)

		// sprite
    this.setDisplaySize(this.displayHeight * getGameHeight(scene) / 700, this.displayHeight * getGameHeight(scene) / 700); 

    this.anims.create({
      key: 'potionanim',
      frames: this.anims.generateFrameNumbers('potion' || '', { frames: [ 0,1,2,3,4,5,6,7 ]}),
      frameRate:2,
      repeat: -1
    });
  

//	this.scene.physics.world.enable(this);
//	(this.body as Phaser.Physics.Arcade.Body).setSize(50, 50);

	this.play('potionanim', true)
      
	} 

	drink()
	{
	return 1
	}

    public activate = (x: number, y: number) => {
    // Physics
    //this.scene.physics.world.enable(this);  
    this.setPosition(x, y);
    this.setImmovable(true);

  } 

}