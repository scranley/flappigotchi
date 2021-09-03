import Phaser from 'phaser'

import { sceneEvents } from '../events/EventsCenter'

export class GameUI extends Phaser.Scene
{
	private hearts!: Phaser.GameObjects.Group

	constructor()
	{
		super({ key: 'game-ui' })
	}

	create()
	{
		
		const coins = this.add.image(40, 100, 'treasure');


        const style = { font: "bold 48px Arial", fill: "#fff" };

		const coinsLabel = this.add.text(65, 75, '0', style)

		sceneEvents.on('player-coins-changed', (coins: number) => {
			coinsLabel.text = coins.toLocaleString()
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
		})
	}

	private handlePlayerHealthChanged(health: number)
	{
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