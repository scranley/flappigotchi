
import { BOMB } from 'game/assets';
import { getGameHeight } from '../helpers';
import { OPENCHEST } from 'game/assets';

export class Chest extends Phaser.Physics.Arcade.Sprite
{
private openchest!: Phaser.Sound.BaseSound;
	constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number)
	{

		super(scene, x, y, BOMB, 0)

		// sprite


    this.openchest = scene.sound.add(OPENCHEST, { volume: .1,loop: false });

    this.setDisplaySize(this.displayHeight * getGameHeight(scene) / 700, this.displayHeight * getGameHeight(scene) / 700);

     this.anims.create({
      key: 'chest-closed',
      frames: this.anims.generateFrameNumbers('chest' || '', { frames: [ 0 ]}),
      frameRate: 2,
    });
this.anims.create({
      key: 'chest-open',
      frames: this.anims.generateFrameNumbers('chest' || '', { frames: [ 0,1,2,3,4,5,6,7,8 ]}),
      frameRate: 6,
    });


	this.scene.physics.world.enable(this);
	(this.body as Phaser.Physics.Arcade.Body).setSize(50, 50);

		this.play('chest-closed')

	}
open()
	{
		
		if (this.anims.currentAnim.key !== 'chest-closed')
		{
			return 0
		} 
this.openchest?.play();	

           if (!this.anims.isPlaying)
		{this.play('chest-open')
		return Phaser.Math.Between(50, 200)}
		return 0
	}

    public activate = (x: number, y: number) => {
    // Physics
    //this.scene.physics.world.enable(this);  
    this.setPosition(x, y);
    this.setImmovable(true);

  } 

}