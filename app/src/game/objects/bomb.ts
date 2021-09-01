import { Explosion } from '../objects/explosion';
import { getGameHeight } from '../helpers';
import { BOMB } from 'game/assets';

export class Bomb extends Phaser.Physics.Arcade.Sprite{
 constructor(scene: Phaser.Scene) {
   super(scene, -100, -100, BOMB, 0);
   this.setOrigin(0, 0);
   this.displayHeight = getGameHeight(scene) / 7;
   this.displayWidth = getGameHeight(scene) / 7;
  
   this.anims.create({
      key: 'bomb',
      frames: this.anims.generateFrameNumbers('bomb' || '', { frames: [ 0,1,2,3,4,5,6,7 ]}),
      frameRate: 2,
    });
this.on('animationcomplete', this.explode, this);

 }

 explode() {
		// console.log('bomb.explode()\t bomb=%o', this);
		const explosion = new Explosion(this.scene, this.x, this.y);
		this.destroy();
	}

public activate = (x: number, y: number) => {
    // Physics
    this.scene.physics.world.enable(this);
    (this.body as Phaser.Physics.Arcade.Body).setVelocityX(0);
     

    this.setPosition(x, y);
    this.anims.play('bomb', true);
  }

  public update = () => {
    if (this.x < -2 * this.displayWidth) {
      this.destroy()
    }
  }
}



/* export class Bomb extends Phaser.Physics.Arcade.Sprite {
	constructor(params) {
		super(params.scene, params.x, params.y, 'bomb');

		// console.log('bomb: %o', this);
		params.scene.add.existing(this);
		params.scene.physics.world.enable(this);
		params.scene.bombs.add(this);

		this.setOrigin(0.5);

		this.x = this.snapToGrid(this.x);
		this.y = this.snapToGrid(this.y);

		this.anims.play('bomb', true);
		this.on('animationcomplete', this.explode, this);
	}

	explode() {
		// console.log('bomb.explode()\t bomb=%o', this);
		const explosion = new Explosion({scene:this.scene, x:this.x, y:this.y, frame:2});
		this.destroy();
	}

	snapToGrid(n,snapSize=32) {
		n -= 16;
		n /= snapSize;
		n = Math.round(n);
		return n*snapSize + 16;
	}
} */
