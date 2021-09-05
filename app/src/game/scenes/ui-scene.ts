import Phaser from 'phaser'

import { sceneEvents } from '../events/EventsCenter'
import { LEFT_CHEVRON, BG, CLICK, BOOP } from "game/assets";
import { getGameWidth, getGameHeight, getRelative } from "../helpers";

export class GameUI extends Phaser.Scene
{
	private hearts!: Phaser.GameObjects.Group
	private label!: Phaser.GameObjects.Text
private back?: Phaser.Sound.BaseSound;

	constructor()
	{
		super({ key: 'game-ui' })
	}

	create()
	{
		
		const coins = this.add.image(40, 100, 'treasure');


        const style = { font: "bold 48px Arial", fill: "#fff" };

         const endstyle = { font: "bold 96px Arial", fill: "#fff" };

		const coinsLabel = this.add.text(65, 75, '0', style)

		const towersLabel = this.add.text(20,125, 'Towers:', style)

		const towersLeft = this.add.text(200,125, '0', style)

      

		const gameover = this.add.text(this.scale.width/2 - 300, this.scale.height/2, '', endstyle)
		const youwin = this.add.text( this.scale.width/2 - 250, this.scale.height/2, '', endstyle)

		sceneEvents.on('game-over', (coins: number) => {
			gameover.text = "GAME OVER."
		})

		sceneEvents.on('you-win', (coins: number) => {
				youwin.text = "YOU WIN!"
				this.createBackButton();
		})


		sceneEvents.on('player-coins-changed', (coins: number) => {
			coinsLabel.text = coins.toLocaleString()
		})

		sceneEvents.on('towers-changed', (towers: number) => {
			towersLeft.text = towers.toLocaleString()
		})
	
		this.hearts = this.add.group({
			classType: Phaser.GameObjects.Image
		})

		this.hearts.createMultiple({
			key: 'ui-heart-full',
			setXY: {
				x: 40,
				y: 40,
				stepX: 48
			},
			quantity: 3
		})

		sceneEvents.on('player-health-changed', this.handlePlayerHealthChanged, this)

		this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
			sceneEvents.off('player-health-changed', this.handlePlayerHealthChanged, this)
			sceneEvents.off('player-coins-changed')
			sceneEvents.off('towers-changed')
				sceneEvents.off('game-over')
					sceneEvents.off('you-win')
		})


   const style2 = { font: "bold 24px Arial", fill: "#fff" };

   this.label = this.add.text(6, this.scale.height-125, '', style2).setWordWrapWidth(this.scale.width);
   //this.label = this.add.text(400, 400, '', style2).setWordWrapWidth(100);
   

   const graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });

   const pointer = this.input.activePointer;

   const r2 = this.add.rectangle(this.scale.width/2, this.scale.height-75, this.scale.width, 150, 0x9966ff);
   r2.setStrokeStyle(6, 0xefc53f);

   // const r2 = new Phaser.Geom.Rectangle(this.scale.width/2, this.scale.height-75, this.scale.width, 150);
   //graphics.fillRectShape(r2);

    
   // this.createBackButton();

  // r2.setDepth(1);
   this.label.setDepth(2);
 
    graphics.setInteractive(r2, () => {
      if(pointer.isDown) {
        //graphics.setVisible(false);
        r2.setVisible(false);
        
        this.label.setVisible(false);
      }
    });   

   this.typewriteTextWrapped('Welcome to the Aave Gotchi Dungeon! YOUR QUEST is to destroy all the towers and collect treasures!\n - To drop a Bomb press "B"\n - To throw swords and open chests press "SPACEBAR"\n // CLICK HERE TO CLOSE THIS BOX //')
	}


	private createBackButton = () => {
    this.add
      .image(getRelative(this.scale.width/2, this), getRelative(this.scale.height/2+100, this), LEFT_CHEVRON)
      .setOrigin(0)
      .setInteractive({ useHandCursor: true })
      .setDisplaySize(getRelative(94, this), getRelative(94, this))
      .on("pointerdown", () => {
        this.back?.play();
        window.history.back();
      });
  };


private typewriteText(text: string)
{
	const length = text.length
	let i = 0
	this.time.addEvent({
		callback: () => {
			this.label.text += text[i]
			++i
		},
		repeat: length - 1,
		delay: 50
	})
}

private typewriteTextWrapped(text: string)
{
	const lines = this.label.getWrappedText(text)
	const wrappedText = lines.join('\n')

	this.typewriteText(wrappedText)
}


	private handlePlayerHealthChanged(health: number)
	{
		if (this.hearts.children) {
		this.hearts.children.each((go, idx) => {

			const heart = go as Phaser.GameObjects.Image
			if (idx < health)
			{
				heart.setTexture('ui-heart-full')
			}
			else
			{
				heart.setTexture('ui-heart-empty')
			}
		})
		}
	}
}