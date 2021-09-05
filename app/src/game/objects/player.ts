import { getGameHeight } from 'game/helpers';
import { Chest } from "game/objects";
import { Potion } from "game/objects";

import { sceneEvents } from '../events/EventsCenter'

enum HealthState
{
  IDLE,
  DAMAGE,
  DEAD
}

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
  public facing = "up";

  private healthState = HealthState.IDLE
  private damageTime = 0

  private _health = 3
  private _coins = 0

  private knives?: Phaser.Physics.Arcade.Group
  private activeChest?: Chest
  private activePotion?: Potion




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
    (this.body as Phaser.Physics.Arcade.Body).setSize(60, 50);
  

    // sprite
    //this.setOrigin(0, 0);
    this.setDisplaySize(this.displayHeight * getGameHeight(scene) / 1600, this.displayHeight * getGameHeight(scene) / 1600);

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


  public get health()
  {
    return this._health
  }

  setKnives(knives: Phaser.Physics.Arcade.Group)
  {
    this.knives = knives
  }

  setChest(chest: Chest)
  {
    this.activeChest = chest
  }

  setPotion(potion: Potion)
  {
    this.activePotion = potion
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
      this.setVelocity(dir.x, dir.y)

      this.setTint(0xff0000)

      this.healthState = HealthState.DAMAGE
      this.damageTime = 0
    }
  }

 // public dropBomb() {
 // 		new Bomb({this.scene, x:this.body.x+8, y:this.body.y+8});
//		this.lastBombDrop = 0;
//	}

// set each zombie's target to be the player

  private throwKnife()
  {

    if (!this.knives)
    {
      return
    }

    const knife = this.knives.get(this.x, this.y, 'sword') as Phaser.Physics.Arcade.Image
    if (!knife)
    {
      return
    }

    //const parts = this.anims.currentAnim.key.split('-')
    //const direction = parts[2]


    const vec = new Phaser.Math.Vector2(0, 0)

    switch (this.facing)
    {
      case 'up':
        vec.y = -1
        break
      case 'down':
        vec.y = 1
        break
      case 'right':
          vec.x = 1
        break
      default: 'left'
          vec.x = -1
        break
    }

    const angle = vec.angle()

    knife.setActive(true)
    knife.setVisible(true)

    knife.setRotation(angle)

    knife.x += vec.x * 16
    knife.y += vec.y * 16

    knife.setVelocity(vec.x * 300, vec.y * 300)
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


  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {
    // handle input
    // if ((this.upKey.isDown || this.pointer.isDown) && !this.isFlapping) {

   if (this.healthState === HealthState.DAMAGE
      || this.healthState === HealthState.DEAD
    )
    {
      return
    }   


    if (!cursors)
    {
      return
    }

    if (this.activePotion)
      {
        const health = this.activePotion.drink()
        this._health = 3

        sceneEvents.emit('player-health-changed', this._health)
        this.activePotion = undefined
      }
	
    if (Phaser.Input.Keyboard.JustDown(cursors.space!))
    {
      if (this.activeChest)
      {
        const coins = this.activeChest.open()
        this._coins += coins

        sceneEvents.emit('player-coins-changed', this._coins)
      }
      else
      {
        this.throwKnife()
      }
      return
    }


    const speed = 300

    const leftDown = cursors.left?.isDown
    const rightDown = cursors.right?.isDown
    const upDown = cursors.up?.isDown
    const downDown = cursors.down?.isDown

    if (leftDown)
    {
      this.anims.play('flap', true)
      this.setVelocity(-speed, 0)
      this.facing="left"
     // this.scaleX = -1
     // this.body.offset.x = 24
    }
    else if (rightDown)
    {
      this.anims.play('flap', true)
      this.setVelocity(speed, 0)
      this.facing ="right" 

   //   this.scaleX = 1
     // this.body.offset.x = 8
    }
    else if (upDown)
    {
      this.anims.play('flap', true)
      this.setVelocity(0, -speed)
      this.facing = "up"
    }
    else if (downDown)
    {
      this.anims.play('flap', true)
      this.setVelocity(0, speed)
      this.facing = "down"
    }
    else
    {
    // const parts = this.anims.currentAnim.key.split('-')
    //  parts[1] = 'flap'
     // this.anims.play(parts.join('-'))
      this.setVelocity(0, 0)
    }

    if (leftDown || rightDown || upDown || downDown)
    {
      this.activeChest = undefined
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
