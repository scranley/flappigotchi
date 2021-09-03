import { LEFT_CHEVRON, BG, CLICK, BOOP } from "game/assets";
import { AavegotchiGameObject } from "types";
import { getGameWidth, getGameHeight, getRelative } from "../helpers";
import { Player, Bomb, Enemy, ScoreZone, Missle } from "game/objects";
import { Socket } from "socket.io-client";
import Dungeon from "@mikewesthad/dungeon";
//import TilemapVisibility from "tilemap-visibility.js";



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
    this.scene.run('game-ui') 

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
       runChildUpdate: true,
    });

    this.missles = this.add.group({
      maxSize: 125,
      classType: Missle,
      runChildUpdate: true,
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

   // const map = this.make.tilemap({key:'level'+this.level});

   /*   const map = this.make.tilemap({key:'MAP'});

    this.map = map;
    const tiles = map.addTilesetImage('tileset', 'tileset');

   const bgLayer = map.createLayer('background', tiles, 0,0);
    const  wallLayer = map.createLayer('walls', tiles, 0,0); */

   const dungeon = new Dungeon({
      width: 50,
      height: 50,
      doorPadding: 2,
      rooms: {
        width: { min: 7, max: 15, onlyOdd: true },
        height: { min: 7, max: 15, onlyOdd: true }
      }
    });

   //dungeon.drawToConsole();
    

const map = this.make.tilemap({
  tileWidth: 48,
  tileHeight: 48,
  width: dungeon.width,
  height: dungeon.height
});

// Our custom tile mapping with:
// - Single index for putTileAt
// - Array of weights for weightedRandomize
// - Array or 2D array for putTilesAt
const TILES = {
  BLANK: 20,
  WALL: {
    TOP_LEFT: 3,
    TOP_RIGHT: 4,
    BOTTOM_RIGHT: 23,
    BOTTOM_LEFT: 22,
    TOP: [{ index: 39, weight: 4 }, { index: [57, 58, 59], weight: 1 }],
    LEFT: [{ index: 21, weight: 4 }, { index: [76, 95, 114], weight: 1 }],
    RIGHT: [{ index: 19, weight: 4 }, { index: [77, 96, 115], weight: 1 }],
    BOTTOM: [{ index: 1, weight: 4 }, { index: [78, 79, 80], weight: 1 }]
  },
  FLOOR: [{ index: 6, weight: 9 }, { index: [7, 8, 26], weight: 1 }],
  POT: [{ index: 13, weight: 1 }, { index: 32, weight: 1 }, { index: 51, weight: 1 }],
  DOOR: {
    TOP: [40, 6, 38],
    // prettier-ignore
    LEFT: [
      [40],
      [6],
      [2]
    ],
    BOTTOM: [2, 6, 0],
    // prettier-ignore
    RIGHT: [
      [38],
      [6],
      [0]
    ]
  },
  CHEST: 166,
  STAIRS: 81,
  // prettier-ignore
  TOWER: [
    [186],
    [205]
  ]
};



// Load up a tileset, in this case, the tileset has 1px margin & 2px padding (last two arguments)
const tileset = map.addTilesetImage("dungeontileset", "dungeontileset", 48, 48, 1, 2);


const groundLayer = map
      .createBlankLayer("Ground", tileset)
      .fill(TILES.BLANK);
const stuffLayer = map.createBlankLayer("Stuff", tileset);

const enemyLayer = map.createBlankLayer("Enemy", tileset);


dungeon.rooms.forEach((room) => {
      const { x, y, width, height, left, right, top, bottom } = room;


// Fill the floor with mostly clean tiles
      groundLayer.weightedRandomize(
        TILES.FLOOR,
        x + 1,
        y + 1,
        width - 2,
        height - 2
      );

      // Place the room corners tiles
      groundLayer.putTileAt(TILES.WALL.TOP_LEFT, left, top);
      groundLayer.putTileAt(TILES.WALL.TOP_RIGHT, right, top);
      groundLayer.putTileAt(TILES.WALL.BOTTOM_RIGHT, right, bottom);
      groundLayer.putTileAt(TILES.WALL.BOTTOM_LEFT, left, bottom);

      // Fill the walls with mostly clean tiles
      groundLayer.weightedRandomize(
        TILES.WALL.TOP,
        left + 1,
        top,
        width - 2,
        1
      );
      groundLayer.weightedRandomize(
        TILES.WALL.BOTTOM,
        left + 1,
        bottom,
        width - 2,
        1
      );
      groundLayer.weightedRandomize(
        TILES.WALL.LEFT,
        left,
        top + 1,
        1,
        height - 2
      );
      groundLayer.weightedRandomize(
        TILES.WALL.RIGHT,
        right,
        top + 1,
        1,
        height - 2
      );

      // Dungeons have rooms that are connected with doors. Each door has an x & y relative to the
      // room's location
      const doors = room.getDoorLocations();
      for (let i = 0; i < doors.length; i++) {
        if (doors[i].y === 0) {
          groundLayer.putTilesAt(
            TILES.DOOR.TOP,
            x + doors[i].x - 1,
            y + doors[i].y
          );
        } else if (doors[i].y === room.height - 1) {
          groundLayer.putTilesAt(
            TILES.DOOR.BOTTOM,
            x + doors[i].x - 1,
            y + doors[i].y
          );
        } else if (doors[i].x === 0) {
          groundLayer.putTilesAt(
            TILES.DOOR.LEFT,
            x + doors[i].x,
            y + doors[i].y - 1
          );
        } else if (doors[i].x === room.width - 1) {
          groundLayer.putTilesAt(
            TILES.DOOR.RIGHT,
            x + doors[i].x,
            y + doors[i].y - 1
          );
        }
      }
    });

    // Not exactly correct for the tileset since there are more possible floor tiles, but this will
    // do for the example.
    groundLayer.setCollisionByExclusion([-1, 6, 7, 8, 26]);

  
// Separate out the rooms into:
    //  - The starting room (index = 0)
    //  - A random room to be designated as the end room (with stairs and nothing else)
    //  - An array of 90% of the remaining rooms, for placing random stuff (leaving 10% empty)
    const rooms = dungeon.rooms.slice();
    const startRoom = rooms.shift();
    const endRoom = Phaser.Utils.Array.RemoveRandomElement(rooms);
    const otherRooms = Phaser.Utils.Array.Shuffle(rooms).slice(
      0,
      rooms.length * 0.9
    );

  
 // Place the stairs
  //stuffLayer.putTileAt(TILES.STAIRS, endRoom.centerX, endRoom.centerY);
  // somehow endRoom has this removed? 

// Place stuff in the 90% "otherRooms"
otherRooms.forEach(room => {
  const rand = Math.random();
  if (rand <= 0.25) {
    // 25% chance of chest
    stuffLayer.putTileAt(TILES.CHEST, room.centerX, room.centerY);
    //enemyLayer.putTileAt(TILES.BLANK, (room.centerX - 1)*46, (room.centerY + 1)*50;
    this.addEnemy((room.centerX - 1)*46, (room.centerY + 1)*50, 0, 0, 0);
  } else if (rand <= 0.5) {
    // 50% chance of a pot anywhere in the room... except don't block a door!
    const x = Phaser.Math.Between(room.left + 2, room.right - 2);
    const y = Phaser.Math.Between(room.top + 2, room.bottom - 2);
    //stuffLayer.weightedRandomize(x, y, 1, 1, TILES.POT);
  } else {
    // 25% of either 2 or 4 towers, depending on the room size
    if (room.height >= 9) {
      stuffLayer.putTilesAt(TILES.TOWER, room.centerX - 1, room.centerY + 1);
      stuffLayer.putTilesAt(TILES.TOWER, room.centerX + 1, room.centerY + 1);
      stuffLayer.putTilesAt(TILES.TOWER, room.centerX - 1, room.centerY - 2);
      stuffLayer.putTilesAt(TILES.TOWER, room.centerX + 1, room.centerY - 2);
    } else {
      stuffLayer.putTilesAt(TILES.TOWER, room.centerX - 1, room.centerY - 1);
      stuffLayer.putTilesAt(TILES.TOWER, room.centerX + 1, room.centerY - 1);
    }
  }
}); 
      
 
//console.log(map.getLayer(KEYS.TILEMAPS.LAYERS.stuffLayer).properties[0].value);

//enemyLayer.objects.forEach(enemyuObj => {
  //    this.enemies.get(enemyObj.x! + enemyObj.width! * 0.5, enemyObj.y! - enemyObj.height! * 0.5, 'enemy')
    //})

// Drop a 2D array into the map at (0, 0)
//groundLayer.putTilesAt(mappedTiles, 0, 0);
    
     // Add a player sprite that can be moved around.
   /* this.player = new Player({
      scene: this,
      x: getGameWidth(this) / 2,
      y: getGameHeight(this) / 2,
      key: this.selectedGotchi?.spritesheetKey || "",
    }); */

     // Place the player in the center of the map
    this.player = new Player({
      scene: this,
      x: map.widthInPixels / 2,
      y: map.heightInPixels / 2,
      key: this.selectedGotchi?.spritesheetKey || "",
    }); 

       // Watch the player and ground layer for collisions, for the duration of the scene:
    this.physics.add.collider(this.player, groundLayer);
   
     this.physics.add.collider(this.enemies, groundLayer); 
   // wallLayer.setCollisionByExclusion([-1], true);

   // this.physics.world.bounds.width  = bgLayer.width;
  //  this.physics.world.bounds.height = bgLayer.height;
    this.physics.world.setBoundsCollision(true, true, true, true);

     const camera = this.cameras.main;
    camera.startFollow(this.player);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);


     this.enemies.children.each(child => {
      const enemy = child as Enemy
      enemy.setTarget(this.player!)
    })


    //this.initAnims();

  /* this.time.addEvent({
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
 */  
  
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
  
     

    /*   this.physics.overlap(
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
      } */

    /*  Phaser.Actions.Call(
        (this.pipes as Phaser.GameObjects.Group).getChildren(),
        (pipe) => {
          (pipe.body as Phaser.Physics.Arcade.Body).setVelocityX(0);
        },
        this
      ); */
    }

    //if (this.player && this.player.y > this.sys.canvas.height) {
    //  window.history.back();
    //} 
  } 
}
