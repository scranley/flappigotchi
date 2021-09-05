import { LEFT_CHEVRON, BG, CLICK, BOOP, OOPS, SUCCESS} from "game/assets";
import { AavegotchiGameObject } from "types";
import { getGameWidth, getGameHeight, getRelative } from "../helpers";
import { Player, Bomb, Enemy, ScoreZone, Missle, Chest, Potion, Slime, Explosion,Knife, Tower, Fireball } from "game/objects";
import { Socket } from "socket.io-client";
import Dungeon from "@mikewesthad/dungeon";
import { sceneEvents } from '../events/EventsCenter'
import { Room } from "@mikewesthad/dungeon";
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
  private player!: Player;

  private playerlocx?: number;
  private playerlocy?: number;

  private selectedGotchi?: AavegotchiGameObject;
  private scoreZone?: Phaser.GameObjects.Group;

  private enemies!: Phaser.Physics.Arcade.Group;
  private chests!:Phaser.Physics.Arcade.Group;
  private potions!:Phaser.Physics.Arcade.Group;
  private towers!:Phaser.Physics.Arcade.Group;
  private fireballs!:Phaser.Physics.Arcade.Group;
  private explosions!:Phaser.Physics.Arcade.Group;
  private bombs!:Phaser.Physics.Arcade.Group;
  private map?:Phaser.Tilemaps.Tilemap;
  private level?:Phaser.Tilemaps.LayerData;

  private pointer?: Phaser.Input.Pointer;

  private totalTowers!: number;


  // Sounds
  private back?: Phaser.Sound.BaseSound;
  private boop?: Phaser.Sound.BaseSound;
   private oops!: Phaser.Sound.BaseSound;
  private click!: Phaser.Sound.BaseSound;
    private success!: Phaser.Sound.BaseSound;
    

  // Score
  private score = 0;
  private scoreText?: Phaser.GameObjects.Text;

  private isGameOver = false;
  private playerEnemiesCollider?: Phaser.Physics.Arcade.Collider
  private playerSlimesCollider?: Phaser.Physics.Arcade.Collider
  private playerExplosionsCollider?: Phaser.Physics.Arcade.Collider
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private knives!: Phaser.Physics.Arcade.Group
  private slimes!: Phaser.Physics.Arcade.Group

  private towerUpdateOnce?:boolean



  constructor() {
    super(sceneConfig);
  }



   // console.log('GameScene init()\t data=%o', data); //Will probably break.
   // this.level = data.level; Need to put this here somehow?
  
  init = (data: { selectedGotchi: AavegotchiGameObject }): void => {
    this.selectedGotchi = data.selectedGotchi;
  };

  preload()
    {
    this.cursors = this.input.keyboard.createCursorKeys()
    }

  public create(): void {
    this.scene.run('game-ui') 

    this.towerUpdateOnce = true

    this.socket = this.game.registry.values.socket;
    this.socket?.emit('gameStarted');

    // Add layout
    this.add
      .image(getGameWidth(this) / 2, getGameHeight(this) / 2, BG)
      .setDisplaySize(getGameWidth(this), getGameHeight(this));
    this.click = this.sound.add(CLICK, { loop: false });
    this.boop = this.sound.add(BOOP, { loop: false });
     this.oops = this.sound.add(OOPS, { loop: false });
      this.success = this.sound.add(SUCCESS, { loop: false });
      
 
   
    this.totalTowers = 0;  

  const createChestAnims = (anims: Phaser.Animations.AnimationManager) => {
  /* anims.create({
    key: 'chest-open',
    frames: anims.generateFrameNames('treasure', { start: 0, end: 2, prefix: 'chest_empty_open_anim_f', suffix: '.png' }),
    frameRate: 5
  }) */
   anims.create({
      key: 'bomb',
      frames: anims.generateFrameNames('treasure',{ start: 0, end: 2, prefix: 'chest_empty_open_anim_f', suffix: '.png' }),
      frameRate: 5,
    });

  /* anims.create({
    key: 'chest-closed',
    frames: [{ key: 'treasure', frame: 'chest_empty_open_anim_f0.png' }]
  }) */

  anims.create({
      key: 'bomb',
      frames: [{ key: 'treasure', frame: 'chest_empty_open_anim_f0.png' }]
    });
}


   createChestAnims(this.anims);

   // this.chests = this.physics.add.staticGroup({
   //   classType: Chest
   // })

    this.chests = this.physics.add.group({
      classType: Chest,
      createCallback: (go) => {
        const chestGo = go as Chest
        chestGo.body.onCollide = true
      }
    })

    this.potions = this.physics.add.group({
      classType: Potion,
      createCallback: (go) => {
        const potionGo = go as Potion
        potionGo.body.onCollide = true
      }
    })

     this.explosions = this.physics.add.group({
      classType: Explosion,
      createCallback: (go) => {
        const explosionGo = go as Explosion
        explosionGo.body.onCollide = true
      },
       maxSize: 100
    })

       this.towers = this.physics.add.group({
      classType: Tower,
      createCallback: (go) => {
        const towerGo = go as Tower
        towerGo.body.onCollide = true
      },
       maxSize: 50
    })

         this.fireballs = this.physics.add.group({
      classType: Fireball,
      createCallback: (go) => {
        const fireballGo = go as Fireball
        fireballGo.body.onCollide = true
      },
       maxSize: 200
    })

    this.slimes = this.physics.add.group({
      classType: Slime,
      createCallback: (go) => {
        const slimeGo = go as Slime
        slimeGo.body.onCollide = true
      },
      runChildUpdate: true
    })


    this.knives = this.physics.add.group({
      classType: Knife,
      createCallback: (go) => {
        const knifeGo = go as Knife
        knifeGo.body.onCollide = true
      }
    })

 

     // Add pipes
    /* this.bombs = this.add.group({
      maxSize: 25,
      classType: Bomb,
    }); */

    this.bombs = this.physics.add.group({
      classType: Bomb,
      createCallback: (go) => {
        const bombGo = go as Bomb
        bombGo.body.onCollide = true
      },
        maxSize: 200
    })


    this.enemies = this.physics.add.group({
      classType: Enemy,
      createCallback: (go) => {
        const enmGo = go as Enemy
        enmGo.body.onCollide = true
      }
    })

   /*  this.missles = this.add.group({
      maxSize: 125,
      classType: Missle,
      runChildUpdate: true,
    }); */

   

    /* this.scoreText = this.add
      .text(getGameWidth(this) / 2, getGameHeight(this) / 2 - getRelative(190, this), this.score.toString(), {
        color: '#FFFFFF',
      })
      .setFontSize(getRelative(94, this))
      .setOrigin(0.5)
      .setDepth(1); */

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
    //const endRoom:Room = Phaser.Utils.Array.RemoveRandomElement(rooms);
    const otherRooms = Phaser.Utils.Array.Shuffle(rooms).slice(
      0,
      rooms.length * 0.9
    );

  
 // Place the stairs
//  stuffLayer.putTileAt(TILES.STAIRS, endRoom.centerX, endRoom.centerY);
 

// Place stuff in the 90% "otherRooms"
otherRooms.forEach(room => {
  const rand = Math.random();
  if (rand <= 0.50) {
    // 25% chance of chest
    //stuffLayer.putTileAt(TILES.CHEST, room.centerX, room.centerY);
    //const chestWorlCoords =  tileToWorldXY((room.centerX),(room.centerY)) as Phaser.Math.Vector2;
    //this.addChest(chestWorlCoords.x, chestWorlCoords.y);
    this.addChest((room.centerX)*48, (room.centerY)*48);
    //enemyLayer.putTileAt(TILES.BLANK, (room.centerX - 1)*46, (room.centerY + 1)*50;
    this.addEnemy((room.centerX - 1)*48, (room.centerY + 1)*48, 0, 0, 0);
     this.addSlime((room.centerX - 1)*48, (room.centerY + 1)*48, 0, 0, 0);
  } else if (rand <= 0.40) {
    // 50% chance of a pot anywhere in the room... except don't block a door!
    const x = Phaser.Math.Between(room.left + 2, room.right - 2);  
    const y = Phaser.Math.Between(room.top + 2, room.bottom - 2);
    //stuffLayer.weightedRandomize(x, y, 1, 1, TILES.POT);
    this.addPotion(x*48, y*48);
  } else {
    // 25% of either 2 or 4 towers, depending on the room size
    if (room.height >= 9) {

       this.addTower((room.centerX-1)*48, (room.centerY+1)*48); 
      this.addTower((room.centerX+1)*48, (room.centerY+1)*48); 
       this.addTower((room.centerX-1)*48, (room.centerY-2)*48); 
      this.addTower((room.centerX+1)*48, (room.centerY-2)*48); 

     /*  stuffLayer.putTilesAt(TILES.TOWER, room.centerX - 1, room.centerY + 1);
      stuffLayer.putTilesAt(TILES.TOWER, room.centerX + 1, room.centerY + 1);
      stuffLayer.putTilesAt(TILES.TOWER, room.centerX - 1, room.centerY - 2);
      stuffLayer.putTilesAt(TILES.TOWER, room.centerX + 1, room.centerY - 2); */
    } else {

      this.addTower((room.centerX-1)*48, (room.centerY-1)*48); 
      this.addTower((room.centerX+1)*48, (room.centerY-1)*48); 

      

      //stuffLayer.putTilesAt(TILES.TOWER, room.centerX - 1, room.centerY - 1);
      //stuffLayer.putTilesAt(TILES.TOWER, room.centerX + 1, room.centerY - 1);
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
    
       // Watch the player and ground layer for collisions, for the duration of the scene:

   
   this.player = new Player({
      scene: this,
      x: map.widthInPixels / 2,
      y: map.heightInPixels / 2,
      key: this.selectedGotchi?.spritesheetKey || "",
    }); 
this.player.setKnives(this.knives)

  this.slimes.children.each(child => {
      const slime = child as Slime
      slime.setTarget(this.player!)
    })

  this.towers.children.each(child => {
      const tower = child as Tower
      tower.setTarget(this.player!)
    })
    

//this.input.on('pointerdown', (pointer :MouseEvent) => {

this.input.keyboard.on('keydown-B', ()=> {  
  
    const bomb: Bomb = this.bombs?.get();

    bomb.setExplosions(this.explosions)

    //bomb.setPotions(this.potions)

    bomb.activate(this.player.x, this.player.y);




});


 /*this.input.keyboard.on('keydown-SPACE', ()=> {
 if (this.player) { 
     let playerFaceX = 0;
     let playerFaceY = 0;
      
       switch(this.player.facing) {
        case 0:
        // 0 is up
        playerFaceX =  0
        playerFaceY = -600
        break;
        case 1:
        // left
         playerFaceX = -600
         playerFaceY = 0
        break;
        case 3:
        //  right
         playerFaceX = 600
         playerFaceY = 0  
        break;
        case 2:
        //  down
         playerFaceX =  0
         playerFaceY = 600
         break;
      } 


       this.addMissle(this.player.x,this.player.y,playerFaceX,playerFaceY);
   }

 }); */
      

   
   this.playerEnemiesCollider = this.physics.add.collider(this.enemies, this.player, this.handlePlayerEnemyCollision, undefined, this)
  
  this.playerSlimesCollider = this.physics.add.collider(this.slimes, this.player, this.handlePlayerSlimeCollision, undefined, this)
   
    this.playerExplosionsCollider = this.physics.add.collider(this.explosions, this.player, this.handlePlayerExplosionCollision, undefined, this)
   

   this.physics.add.collider(this.player, this.chests, this.handlePlayerChestCollision, undefined, this)

   this.physics.add.collider(this.player, this.potions, this.handlePlayerPotionCollision, undefined, this)

   this.physics.add.collider(this.player, this.towers, this.handlePlayerTowerCollision, undefined, this)

    this.physics.add.collider(this.knives, groundLayer, this.handleKnifeWallCollision, undefined, this)
    this.physics.add.collider(this.knives, this.enemies, this.handleKnifeEnemyCollision, undefined, this)

     this.physics.add.collider(this.knives, this.towers, this.handleKnifeTowerCollision, undefined, this)

    this.physics.add.collider(this.knives, this.slimes, this.handleKnifeSlimeCollision, undefined, this) 

     this.physics.add.collider(this.explosions, this.enemies, this.handleExplosionEnemyCollision, undefined, this)  
      this.physics.add.collider(this.explosions, this.slimes, this.handleExplosionSlimeCollision, undefined, this) 
        this.physics.add.collider(this.explosions, this.towers, this.handleExplosionTowerCollision, undefined, this)     


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



  }



private handlePlayerChestCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject)
  {
    const chest = obj2 as Chest
    this.player.setChest(chest)
  
  }

  private handlePlayerPotionCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject)
  {
    const potion = obj2 as Potion
    this.player.setPotion(potion)
    this.potions.killAndHide(obj2)
    obj2.destroy()
  
  }

  private handleKnifeWallCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject)
  {
    this.knives.killAndHide(obj1)
    obj1.destroy()
  }

  private handleKnifeTowerCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject)
  {
    this.knives.killAndHide(obj1)
    obj1.destroy()
  }

  private handleKnifeEnemyCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject)
  {
      const enemy = obj2 as Enemy
    
    const dx = this.player.x - enemy.x
    const dy = this.player.y - enemy.y

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200)

    enemy.handleDamage(dir)

     this.click?.play();

    if (enemy.getDead())  
    {
    this.enemies.killAndHide(obj2)
    obj2.destroy()

      //this.playerEnemiesCollider?.destroy()
   }

      this.knives.killAndHide(obj1)
       obj1.destroy()
     
  }
  
   
  private handleKnifeSlimeCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject)
  {


    const slime = obj2 as Slime
    
    const dx = this.player.x - slime.x
    const dy = this.player.y - slime.y

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200)

    slime.handleDamage(dir)

        this.click?.play();

    if (slime.getDead())
    {
    this.slimes.killAndHide(obj2)
    obj2.destroy()

      //this.playerEnemiesCollider?.destroy()
   }

      this.knives.killAndHide(obj1)
       obj1.destroy()
    //if (this.player.health <= 0)
    //{
    //  this.playerEnemiesCollider?.destroy()
   // }
  
  }

  private handleExplosionTowerCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject)
  {


    this.towers.killAndHide(obj2)
   
    this.totalTowers--

    sceneEvents.emit('towers-changed', this.totalTowers)

    console.log(this.totalTowers);

    if(this.totalTowers <= 0) {
        sceneEvents.emit('you-win')
       this.success?.play();
    }

    obj2.destroy()

  }

   private handleExplosionEnemyCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject)
  {
    
    //this.explosions.killAndHide(obj1)
    this.enemies.killAndHide(obj2)
    obj2.destroy()
  //  obj1.destroy()
    
  }

   private handleExplosionSlimeCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject)
  {
      
   // this.explosions.killAndHide(obj1)
    this.slimes.killAndHide(obj2)
    obj2.destroy()
    //obj1.destroy()
  }

private handlePlayerEnemyCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject)
  {


    const enemy = obj2 as Enemy
    
    const dx = this.player.x - enemy.x
    const dy = this.player.y - enemy.y

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200)

    this.player.handleDamage(dir)

    sceneEvents.emit('player-health-changed', this.player.health)

     this.oops.play();

    if (this.player.health <= 0)
    {
      this.playerEnemiesCollider?.destroy()
       sceneEvents.emit('game-over')
    }
  
  }

  private handlePlayerExplosionCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject)
  {


    const explosion = obj2 as Explosion
    
    const dx = this.player.x - explosion.x
    const dy = this.player.y - explosion.y

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200)

    this.player.handleDamage(dir)

      this.oops.play();

    sceneEvents.emit('player-health-changed', this.player.health)

    this.cameras.main.shakeEffect.start(1000);  

    if (this.player.health <= 0)
    {
      this.playerExplosionsCollider?.destroy()
      sceneEvents.emit('game-over')
    }
  
  }

  private handlePlayerTowerCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject)
  {


    const tower = obj2 as Tower
    
    const dx = this.player.x - tower.x
    const dy = this.player.y - tower.y

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200)

    this.player.handleDamage(dir)

      this.oops.play();

    sceneEvents.emit('player-health-changed', this.player.health)

    if (this.player.health <= 0)
    {
      this.playerEnemiesCollider?.destroy()
        sceneEvents.emit('game-over')
    }
  
  }
  

  private handlePlayerSlimeCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject)
  {


    const slime = obj2 as Slime
    
    const dx = this.player.x - slime.x
    const dy = this.player.y - slime.y

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200)

    this.player.handleDamage(dir)

      this.oops.play();

    sceneEvents.emit('player-health-changed', this.player.health)

    if (this.player.health <= 0)
    {
      this.playerSlimesCollider?.destroy()
        sceneEvents.emit('game-over')
    }
  
  }



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

   public addBomb = (x: number, y: number): void => {
    const bomb: Bomb = this.bombs?.get();
    bomb.activate(x, y);
  }; 

  public addTower = (x: number, y: number): void => {
   const tower: Tower = this.towers?.get();
   tower.activate(x,y);
   this.totalTowers++
  }; 


  private addChest = (x: number, y: number): void => {
    const chest: Chest = this.chests?.get();
    chest.activate(x, y);
  }; 

  private addPotion = (x: number, y: number): void => {
    const potion: Potion = this.potions?.get();
    potion.activate(x, y);
  }; 

  /* private addMissle = (x: number, y: number, velocityX: number, velocityY: number ): void => {
    const missle: Missle = this.missles?.get();
    missle.activate(x,y,velocityX, velocityY);
  }; */

  private addEnemy = (x: number, y: number, frame: number, velocityX: number, velocityY: number): void => {
   
    const enemy: Enemy = this.enemies?.get();
   
    enemy.activate(x, y, frame, velocityX, velocityY);

  }; 

  private addSlime = (x: number, y: number, frame: number, velocityX: number, velocityY: number): void => {
   
    const slime: Slime = this.slimes?.get();
   
    slime.activate(x, y, frame, velocityX, velocityY);

  }; 


  public update(): void {

  // this.player.update();
  //  this.enemies.getChildren().forEach(e => e.update());


  //shake screen

      if (this.towerUpdateOnce) {
      sceneEvents.emit('towers-changed', this.totalTowers)
      this.towerUpdateOnce = false 
      }


      if (this.player && !this.player?.getDead()) {
 
      this.player.update(this.cursors)
    
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
