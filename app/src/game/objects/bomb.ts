
import { getGameHeight } from '../helpers';
import { BOMB } from 'game/assets';
import { BOMBSOUND } from 'game/assets';
import { Explosion } from "game/objects";
import { FIREBALL } from "game/assets";
import { Potion } from "game/objects";
import {POTION} from 'game/assets';

export class Bomb extends Phaser.Physics.Arcade.Sprite{
 
 private explosions?: Phaser.Physics.Arcade.Group
  private bombsound!: Phaser.Sound.BaseSound;

 private potions?: Phaser.Physics.Arcade.Group

 constructor(scene: Phaser.Scene) {
   super(scene, -100, -100, BOMB, 0);

   
   this.displayHeight = getGameHeight(scene) / 14;
   this.displayWidth = getGameHeight(scene) / 14;

    this.bombsound = scene.sound.add(BOMBSOUND, { loop: false });
  
   this.anims.create({
      key: 'bomb',
      frames: this.anims.generateFrameNumbers('bomb' || '', { frames: [ 0,1,2,3,4,5,6,7 ]}),
      frameRate: 2,
    });

this.on('animationcomplete', this.explode, this);

 }

 explode() {

     if (!this.explosions)
    {
      return
    }

    // if (!this.potions)
    //{
    //  return
    //}
        this.bombsound?.play();
    
    const myexplosion = this.explosions.get(this.x, this.y, 'fireball') as Phaser.Physics.Arcade.Image
    //const mypotion = this.potions.get(this.x, this.y, 'potion') as Phaser.Physics.Arcade.Image
   
    this.destroy();

	}

    setExplosions(explosions: Phaser.Physics.Arcade.Group)
  {
    this.explosions = explosions
  }

     setPotions(potions: Phaser.Physics.Arcade.Group)
  {
    this.potions = potions
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

