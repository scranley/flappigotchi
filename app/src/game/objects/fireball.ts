
import { FIREBALL } from 'game/assets';
import { getGameHeight } from '../helpers';

export class Fireball extends Phaser.Physics.Arcade.Sprite
{constructor(scene: Phaser.Scene, x: number, y: number,velocityX: number, velocityY: number, texture: string, frame?: string | number)
  {
  super(scene, x, y, FIREBALL, 0)
  this.setDisplaySize(this.displayHeight * getGameHeight(scene) / 700, this.displayHeight * getGameHeight(scene) / 700); 
  (this.body as Phaser.Physics.Arcade.Body).setVelocity(velocityX,velocityY)
  
    this.anims.create({
      key: 'fireballnim',
      frames: this.anims.generateFrameNumbers('fireball' || '', { frames: [ 0,1,2,3]}),
      frameRate:2,
      repeat: -1
    });
  
  this.scene.physics.world.enable(this);
  (this.body as Phaser.Physics.Arcade.Body).setVelocity(300, 0);

  this.play('fireballanim')

  } 

public activate = (x: number, y: number,velocityX: number, velocityY: number) => {
    // Physics
    this.setPosition(x, y);

   (this.body as Phaser.Physics.Arcade.Body).setVelocity(velocityX, velocityY);
  }


} 