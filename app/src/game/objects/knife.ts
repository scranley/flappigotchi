
import { SWORD } from 'game/assets';
import { getGameHeight } from '../helpers';

export class Knife extends Phaser.Physics.Arcade.Sprite
{
	constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number)
	{

	super(scene, x, y, SWORD, 0)

		// sprite
    this.setDisplaySize(this.displayHeight * getGameHeight(scene) / 400, this.displayHeight * getGameHeight(scene) / 400); 


	} 

 public activate = (x: number, y: number) => {
    // Physics
    //this.scene.physics.world.enable(this);  
    this.setPosition(x, y);
    this.setImmovable(true);

  } 

}