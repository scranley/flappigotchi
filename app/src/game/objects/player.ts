import { getGameHeight } from 'game/helpers';



interface Props {
  scene: Phaser.Scene;
  x: number;
  y: number;
  key: string;
  frame?: number;
}

export class Player extends  Phaser.Physics.Arcade.Sprite {
  private upKey: Phaser.Input.Keyboard.Key;
  private leftKey: Phaser.Input.Keyboard.Key;
  private downKey: Phaser.Input.Keyboard.Key;
  private rightKey: Phaser.Input.Keyboard.Key;
  private pointer: Phaser.Input.Pointer;
  private isFlapping = false;
  private isDead = false;
  private speed = 1000;
  private dir = 2;


  //private cursors = this.input.keyboard.createCursorKeys();

  constructor({ scene, x, y, key }: Props) {
    super(scene, x, y, key);

    // Animations
    this.anims.create({
      key: 'flap',
      frames: this.anims.generateFrameNumbers(key || '', { frames: [ 1, 0 ]}),
      frameRate: 2,
    });
    this.anims.create({
      key: 'dead',
      frames: this.anims.generateFrameNumbers(key || '', { frames: [ 2 ]}),
    });

    // physics
    this.scene.physics.world.enable(this);
    
	//(this.body as Phaser.Physics.Arcade.Body).setGravityY(getGameHeight(this.scene) * 1.5);
    (this.body as Phaser.Physics.Arcade.Body).setSize(70, 80);
  

    // sprite
    this.setOrigin(0, 0);
    this.setDisplaySize(this.displayHeight * getGameHeight(scene) / 1400, this.displayHeight * getGameHeight(scene) / 1400);

    // input
    this.upKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.leftKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.downKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.rightKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.pointer = this.scene.input.activePointer;



    this.scene.add.existing(this);
  }

  public getDead(): boolean {
    return this.isDead;
  }

  public setDead(dead: boolean): void {
    this.isDead = dead;
    this.anims.play('dead');
  }

 // public dropBomb() {
 // 		new Bomb({this.scene, x:this.body.x+8, y:this.body.y+8});
//		this.lastBombDrop = 0;
//	}

// set each zombie's target to be the player
   

  update(): void {
    // handle input
    // if ((this.upKey.isDown || this.pointer.isDown) && !this.isFlapping) {
	
   this.setVelocity(0);

    if (this.leftKey.isDown)
    {
        this.setVelocityX(-300);
    }
    else if (this.downKey.isDown)
    {
        this.setVelocityX(300);
    }

    if (this.upKey.isDown)
    {
        this.setVelocityY(-300);
    }
    else if (this.rightKey.isDown)
    {
        this.setVelocityY(300);
    } 




	/* if (this.upKey.isDown ) {
      // flap
      this.dir = 0;
      this.setAcceleration(-this.speed,0);
      this.anims.play('flap');

      (this.body as Phaser.Physics.Arcade.Body).setVelocity(0,0);

    }  else if 
    (this.rightKey.isDown) {
			//this.anims.play('player-walk-right', true);
			this.dir = 3;
			// this.body.setVelocity(-this.speed,0);
			this.setAcceleration(-this.speed,0);
		} else if(this.leftKey.isDown) {
			//this.anims.play('player-walk-right', true);
			this.dir = 1;
			this.setAcceleration(0,this.speed);
		} else if(this.downKey.isDown) {
			//this.anims.play('player-walk-down', true);
			this.dir = 2;
			this.setAcceleration(this.speed,0);
			} else {
			switch(this.dir) {
				case 0:
				//	this.anims.play('player-idle-up', true); break;
				break;
				case 1:
				break;
				case 3:
				//	this.anims.play('player-idle-right', true); break;
				break;
				case 2:
				//	this.anims.play('player-idle-down', true); break;
			}
			this.setAcceleration(0,0);
			this.setVelocity(0,0);

			} */




    //else if (this.jumpKey.isUp && !this.pointer.isDown && this.isFlapping) {
    //  this.isFlapping = false;
   // }

    // check if off the screen
    //if (this.y > getGameHeight(this.scene) || this.y < 0) {
    //  this.setDead(true);
   // }
  }
}
