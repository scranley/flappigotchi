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
//export const LEVEL1 = 'level1';
//export const LEVEL2 = 'level2';
//export const LEVEL3 = 'level3';
export const FULLHEART = 'ui-heart-full';
export const EMPTYHEART = 'ui-heart-empty';
export const ENEMY = 'enemy';
export const BOMB = 'bomb';
export const TREASURE = 'treasure';
export const EXPLOSION = 'explosion';
export const TILESET = 'tileset';
export const DUNGEONTILESET = 'dungeontileset';
export const LIQUIDATOR1 = 'LIQUIDATOR1';

// Save all in game assets in the public folder
export const assets: Array<Asset | SpritesheetAsset> = [
  {
    key: TILESET,
    src: 'assets/tileset.png',
    type: 'IMAGE',
  },
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
    key: EXPLOSION,   //replace with gotchi
    src: 'assets/explosion.png',
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
];
