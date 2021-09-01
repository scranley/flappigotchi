
//export class Enemy extends Phaser.Physics.Arcade.Sprite {
import { getGameHeight } from '../helpers';
import { EXPLOSION } from 'game/assets';

export class Explosion extends Phaser.Physics.Arcade.Sprite{
  constructor(scene: Phaser.Scene, x: number, y:number) {
    super(scene, x, y, EXPLOSION, 0);
    this.setOrigin(0, 0);
    this.displayHeight = getGameHeight(scene) / 7;
    this.displayWidth = getGameHeight(scene) / 7;


    /* this.speed = 100;
	this.dir = 2;		// 0=up, 1=right, 2=down, 3=left
	this.dirChangeTimer = 0;
	this.alive = true */
  }

  public activate = (x: number, y: number, frame: number, velocityX: number) => {
    // Physics
    this.scene.physics.world.enable(this);
    (this.body as Phaser.Physics.Arcade.Body).setVelocityX(velocityX);

    this.setPosition(x, y);
    this.setFrame(frame);
  }

  public update = () => {
    if (this.x < -2 * this.displayWidth) {
      this.destroy()
    }
  }
}

	


/* export class Explosion extends Phaser.GameObjects.Group {
	radius = 3;
	scene;
	x;
	y;

	constructor(params) {
		super(params.scene);
		this.scene = params.scene;
		this.x = params.x;
		this.y = params.y;

		console.log('explosion: %o', this);
		// params.scene.add.existing(this);
		// params.scene.physics.world.enable(this);
		// params.scene.bombs.add(this);

		// this.body.immovable = true;

		// this.setSize(16,16,true);
		// this.setOrigin(0.5);

		// this.setFrame(2);


		const center = new Phaser.Physics.Arcade.Sprite(
			params.scene,
			params.x,
			params.y,
			'explosion',
			2
		);
		this.add(center);
		params.scene.physics.world.enable(center);
		params.scene.add.existing(center);
		params.scene.explosions.add(center);
		center.body.immovable = true;

		this.createArm(1, 0);
		this.createArm(-1,0);
		this.createArm(0, 1);
		this.createArm(0,-1);

		window['explosion'] = this;

		this.scene.tweens.add({
			targets: this.getChildren(),
			ease: 'Power1',
			duration: 500,
			alpha: '-=2',
			onComplete: () => this.kill()
		});
	}


	kill() {
		console.log('explosion kill() children=%o', this.children.entries.length);
		while(this.getChildren().length) this.getChildren().map(e => e.destroy());	// Strange bug
		this.destroy();
	}


	createArm(gx,gy, step=1) {		// grid units
		// console.log('createArm: gx=%o, gy=%o, step=%o', gx,gy,step);

		const x = this.x + 32*gx;
		const y = this.y + 32*gy;

		if(this.scene.map.getTileAtWorldXY(x,y)) return;

		const dx = Math.sign(gx);
		const dy = Math.sign(gy);
		const sprite = new Phaser.Physics.Arcade.Sprite(this.scene, x, y, 'explosion', 1);

		if(gy) sprite.angle = 90;

		const tile = this.scene.map.getTileAtWorldXY(x+dx*32,y+dy*32);
		// console.log('createArm: tile=%o', tile);

		this.add(sprite);
		this.scene.add.existing(sprite);
		this.scene.explosions.add(sprite);
		this.scene.physics.world.enable(sprite);
		sprite.body.immovable = true;

		if(step<(this.radius-1)) {
			this.createArm(gx+dx,gy+dy,step+1);
		} else {
			sprite.setFrame(0);
			if(gx>0) sprite.flipX = true;
			if(gy>0) sprite.angle = 270;
		}
	}

}
*/