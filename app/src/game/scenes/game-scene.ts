import { LEFT_CHEVRON, BG, CLICK, BOOP } from "game/assets";
import { AavegotchiGameObject } from "types";
import { getGameWidth, getGameHeight, getRelative } from "../helpers";
import { Player, Bomb, Enemy, ScoreZone, Missle } from "game/objects";
import { Socket } from "socket.io-client";


const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: "Game",
};

/**
 * Scene where gameplay takes place
 */
export class GameScene extends Phaser.Scene {
  private socket?: Socket;
  private player?: Player;
  private selectedGotchi?: AavegotchiGameObject;
  private scoreZone?: Phaser.GameObjects.Group;

  private enemies?:Phaser.GameObjects.Group;
  private missles?:Phaser.GameObjects.Group;
  private bombs?:Phaser.GameObjects.Group;
  private explosions?:Phaser.GameObjects.Group;
  private map?:Phaser.Tilemaps.Tilemap;
  private level?:Phaser.Tilemaps.LayerData;

  private pointer?: Phaser.Input.Pointer;


  // Sounds
  private back?: Phaser.Sound.BaseSound;
  private boop?: Phaser.Sound.BaseSound;

  // Score
  private score = 0;
  private scoreText?: Phaser.GameObjects.Text;

  private isGameOver = false;

  constructor() {
    super(sceneConfig);
  }

   // console.log('GameScene init()\t data=%o', data); //Will probably break.
   // this.level = data.level; Need to put this here somehow?
  
  init = (data: { selectedGotchi: AavegotchiGameObject }): void => {
    this.selectedGotchi = data.selectedGotchi;
  };

  public create(): void {
    this.socket = this.game.registry.values.socket;
    this.socket?.emit('gameStarted');

    // Add layout
    this.add
      .image(getGameWidth(this) / 2, getGameHeight(this) / 2, BG)
      .setDisplaySize(getGameWidth(this), getGameHeight(this));
    this.back = this.sound.add(CLICK, { loop: false });
    this.boop = this.sound.add(BOOP, { loop: false });
    this.createBackButton();

     this.input.on('pointerdown', (pointer :MouseEvent) => {

            this.addBomb(pointer.x,pointer.y);

        });

     // Add pipes
    this.bombs = this.add.group({
      maxSize: 25,
      classType: Bomb,
    });


    this.enemies = this.add.group({
      maxSize: 125,
      classType: Enemy,
    });

    this.missles = this.add.group({
      maxSize: 125,
      classType: Missle,
      runChildUpdate: true,
    });

    // Add a player sprite that can be moved around.
    this.player = new Player({
      scene: this,
      x: getGameWidth(this) / 2,
      y: getGameHeight(this) / 2,
      key: this.selectedGotchi?.spritesheetKey || "",
    });

    this.scoreText = this.add
      .text(getGameWidth(this) / 2, getGameHeight(this) / 2 - getRelative(190, this), this.score.toString(), {
        color: '#FFFFFF',
      })
      .setFontSize(getRelative(94, this))
      .setOrigin(0.5)
      .setDepth(1);

    this.scoreZone = this.add.group({ classType: ScoreZone });


    // added from other gamescene.

    const map = this.make.tilemap({key:'level'+this.level});
    this.map = map;
    const tiles = map.addTilesetImage('tileset', 'tileset');

  //  const bgLayer = map.createLayer('background', tiles, 0,0);
  //  const  wallLayer = map.createLayer('walls', tiles, 0,0);

  //  wallLayer.setCollisionByExclusion([-1], true);

   // this.physics.world.bounds.width  = bgLayer.width;
  //  this.physics.world.bounds.height = bgLayer.height;
    this.physics.world.setBoundsCollision(true, true, true, true);

    //this.initAnims();

  this.time.addEvent({
      delay: 2000,
      callback: this.addEnemyGroup,
      callbackScope: this,
      loop: true,
    });

  this.time.addEvent({
      delay: 1000,
      callback: this.addMissle,
      callbackScope: this,
      loop: true,
    });
  
  
    //window['enemies'] = this.enemies.children.entries;

   // const objectLayer = map.getObjectLayer('objects');
 //   objectLayer.objects.forEach(object => {
 //     if(object.name==='player') {
      //  this.player = new Player({scene:this, x:object['x']+16, y:object['y']-24});
//      }
//      if(object.type==='enemy') {
        // if(!this.enemies.children.entries.length)
      //  this.enemies.add(new Enemy({scene:this, x:object['x']+16, y:object['y']-16}));
//      }
//    });

 /*    this.physics.add.collider(this.explosions, this.bombs, (a,b) => {
      if((a as any).explode) (a as any).explode(b);
      if((b as any).explode) (b as any).explode(a);
    });
    this.physics.add.collider(this.bombs, this.bombs);
    this.physics.add.collider(this.bombs, wallLayer);
    this.physics.add.collider(wallLayer, this.player);
    this.physics.add.collider(this.bombs, this.player);
    this.physics.add.collider(this.enemies, this.enemies, (a,b) => {
      if((a as any).onCollide) (a as any).onCollide(b);
      if((b as any).onCollide) (b as any).onCollide(a);
    });
    this.physics.add.collider(this.bombs, this.enemies, (a,b) => {
      if((a as any).onCollide) (a as any).onCollide(b);
      if((b as any).onCollide) (b as any).onCollide(a);
    });
    this.physics.add.collider(<any>[wallLayer,this.player], this.enemies, (a,b) => {
      if((a as any).onCollide) (a as any).onCollide(b);
      if((b as any).onCollide) (b as any).onCollide(a);
    });

    this.physics.add.collider(this.explosions, this.player, (explosion,player) => {
      console.log('player explosion collision: explosion=%o, player=%o', explosion,player);
      (player as any).exploded();
    });
    this.physics.add.collider(this.explosions, this.enemies, (explosion,enemy) => {
      console.log('enemy explosion collision: explosion=%o, enemy=%o', explosion,enemy);
      (enemy as any).exploded();
    }); */

  }

 // Uncaught TypeError: Cannot read property 'activate' of null when too many are created? seems like
 // The thing is object is created but doesnt have functions.

 private addEnemyGroup = () => {   
    const size = getGameHeight(this) / 7;
    const x = getGameWidth(this);
    const velocityX = -getGameWidth(this) / 5;
    const velocityY = -getGameWidth(this) / 5;
    const gap = Math.floor(Math.random() * 4) + 1;

    for (let i = 0; i < 7; i++) {
      if (i !== gap && i !== gap + 1) {
        const frame = i === gap - 1 ? 2 : i === gap + 2 ? 0 : 1;
        this.addEnemy(x, size * i, frame, velocityX, velocityY);
      }
    }
  };
  

  private createBackButton = () => {
    this.add
      .image(getRelative(54, this), getRelative(54, this), LEFT_CHEVRON)
      .setOrigin(0)
      .setInteractive({ useHandCursor: true })
      .setDisplaySize(getRelative(94, this), getRelative(94, this))
      .on("pointerdown", () => {
        this.back?.play();
        window.history.back();
      });
  };

  private addScoreZone = (x: number, y: number, velocityX: number): void => {
    const height = 2 * getGameHeight(this) / 7;
    const width = getGameHeight(this) / 7;
    this.scoreZone?.add(
      new ScoreZone({
        scene: this,
        x,
        y,
        width,
        height,
        velocityX
      })
    )
  };


  private addScore = () => {
    if (this.scoreText) {
      this.score += 1;
      this.scoreText.setText(this.score.toString());
    }
  };

   private addBomb = (x: number, y: number): void => {
    const bomb: Bomb = this.bombs?.get();
    bomb.activate(x, y);
  }; 

  private addMissle = (): void => {
    const missle: Missle = this.missles?.get();
    missle.activate();
  }; 

  private addEnemy = (x: number, y: number, frame: number, velocityX: number, velocityY: number): void => {
    const enemy: Enemy = this.enemies?.get();
    enemy.activate(x, y, frame, velocityX, velocityY);
    //enemy.activate(x, y, frame, velocityX, velocityY);

  }; 


  public update(): void {

  // this.player.update();
  //  this.enemies.getChildren().forEach(e => e.update());


      if (this.player && !this.player?.getDead()) {
      this.player.update();
    /*   this.physics.overlap(
        this.player,
        this.pipes,
        () => {
          this.player?.setDead(true);
          this.boop?.play();
        },
        undefined,
        this
      ); */
  
     

      this.physics.overlap(
        this.player,
        this.scoreZone,
        (_, zone) => {
          (zone as ScoreZone).handleOverlap();
          this.addScore();
        }
      )
    } else {
      if (!this.isGameOver) {
        this.isGameOver = true;
        this.socket?.emit('gameOver', {score: this.score});
      }

    /*  Phaser.Actions.Call(
        (this.pipes as Phaser.GameObjects.Group).getChildren(),
        (pipe) => {
          (pipe.body as Phaser.Physics.Arcade.Body).setVelocityX(0);
        },
        this
      ); */
    }

    if (this.player && this.player.y > this.sys.canvas.height) {
      window.history.back();
    } 
  } 
}
