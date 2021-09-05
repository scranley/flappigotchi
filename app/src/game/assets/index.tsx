export interface Asset {
  key: string;
  src: string;
  type: 'IMAGE' | 'SVG' | 'SPRITESHEET' | 'AUDIO' | 'JSON';
  data?: {
    frameWidth?: number;
    frameHeight?: number;
  };
}

export interface SpritesheetAsset extends Asset {
  type: 'SPRITESHEET';
  data: {
    frameWidth: number;
    frameHeight: number;
  };
}


export const BG = 'bg';
export const FULLSCREEN = 'fullscreen';
export const LEFT_CHEVRON = 'left_chevron';
export const CLICK = 'click';
export const PIPES = 'pipes';
export const BOOP = 'boop';
export const OOPS = 'oops';
//export const LEVEL1 = 'level1';
//export const LEVEL2 = 'level2';
//export const LEVEL3 = 'level3';
export const FULLHEART = 'ui-heart-full';
export const EMPTYHEART = 'ui-heart-empty';
export const ENEMY = 'enemy';
export const BOMB = 'bomb';
export const TREASURE = 'treasure';
export const CHEST = 'chest';
export const SWORD = 'sword';
export const POTION = 'potion';
export const EXPLOSION = 'explosion'; 
export const SLIME = 'slime'; 
export const FIREBALL = 'fireball'; 
export const TOWER = 'tower'; 
export const DUNGEONTILESET = 'dungeontileset';
export const LIQUIDATOR1 = 'LIQUIDATOR1';

// Save all in game assets in the public folder
export const assets: Array<Asset | SpritesheetAsset> = [
  {
    key: DUNGEONTILESET,
    src: 'assets/dtiles.png',
    type: 'IMAGE',
  },
 /*  {
    key: LEVEL1,
    src: 'assets/level1.json',
    type: 'JSON',
  },
   {
    key: LEVEL2,
    src: 'assets/level2.json',
    type: 'JSON',
  }, 
   {
    key: LEVEL3,
    src: 'assets/level3.json',
    type: 'JSON',
  }, */
  {
    key: LEFT_CHEVRON,
    src: 'assets/icons/chevron_left.svg',
    type: 'SVG',
  },
  {
    key: CLICK,
    src: 'assets/sounds/click.mp3', 
    type: 'AUDIO',
  },
  {
    key: FULLHEART,  
    src: 'assets/full-heart.png',
    type: 'IMAGE',
  },
  {
    key: TREASURE,  
    src: 'assets/retro_coin.png',
    type: 'IMAGE',
  },
  {
    key: SWORD,  
    src: 'assets/sword.png',
    type: 'IMAGE',
  },
  {
    key: EMPTYHEART,  
    src: 'assets/empty-heart.png',
    type: 'IMAGE',
  },
  {
    key: LIQUIDATOR1,   //replace with gotchi
    src: 'assets/ld1.svg',
    type: 'SVG'
  },
  {
    key: BOMB,   //replace with gotchi
    src: 'assets/bomb.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 32,
      frameHeight: 32,
    }
  },
   {
    key: CHEST,   //replace with gotchi
    src: 'assets/chest.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 46,
      frameHeight: 50,
    }
  },
  {
    key: POTION,   //replace with gotchi
    src: 'assets/potion.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 48,
      frameHeight: 48,
    }
  },
   {
    key: TOWER,   //replace with gotchi
    src: 'assets/tower.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 46,
      frameHeight: 96,
    }
  },
  {
    key: EXPLOSION,   //replace with gotchi
    src: 'assets/explosion.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 32,
      frameHeight: 32,
    }
  },
  {
    key: SLIME,   //replace with gotchi
    src: 'assets/evileye.svg',
    type: 'SVG'
  },
   {
    key: FIREBALL,   //replace with gotchi
    src: 'assets/fireball.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 32,
      frameHeight: 32,
    }
  },
  {
    key: BOOP,
    src: 'assets/sounds/boop.mp3',
    type: 'AUDIO',
  },
   {
    key: OOPS,
    src: 'assets/sounds/oops.mp3',
    type: 'AUDIO',
  },
];
