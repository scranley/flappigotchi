
import { FIREBALL } from 'game/assets';
import { getGameHeight } from '../helpers';

export class Explosion extends Phaser.Physics.Arcade.Sprite
{
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number)
  {

  super(scene, x, y, FIREBALL, 0)

    // sprite
    this.setDisplaySize(this.displayHeight * getGameHeight(scene) / 200, this.displayHeight * getGameHeight(scene) / 200); 

    this.anims.create({
      key: 'potionanim',
      frames: this.anims.generateFrameNumbers('fireball' || '', { frames: [ 0,1,2,3]}),
      frameRate:2,
    });
  

  this.scene.physics.world.enable(this);

  this.setImmovable(true);

  this.play('potionanim')

  this.on('animationcomplete', this.fizzle, this);

  } 

    public activate = (x: number, y: number) => {
    // Physics
    this.setPosition(x, y);
  }

  fizzle() {
   
    this.destroy()

  } 

} 