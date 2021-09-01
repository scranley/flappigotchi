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
export const PLAYER = 'player';
export const ENEMY = 'enemy';
export const BOMB = 'bomb';
export const EXPLOSION = 'explosion';
export const TILESET = 'tileset';

// Save all in game assets in the public folder
export const assets: Array<Asset | SpritesheetAsset> = [
  {
    key: TILESET,
    src: 'assets/tileset.png',
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
    key: PLAYER,   //replace with gotchi
    src: 'assets/player.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 32,
      frameHeight: 32,
    }
  },
  {
    key: ENEMY,   //replace with gotchi
    src: 'assets/enemy.png',
    type: 'SPRITESHEET',
    data: {
      frameWidth: 32,
      frameHeight: 32,
    }
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
