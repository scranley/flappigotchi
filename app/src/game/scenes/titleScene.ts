export class TitleScene extends Phaser.Scene {
	constructor() {
		super({key:'TitleScene'});
	}

	create() {

	}

	update() {
		this.scene.start('GameScene', {level:1});
	}
}
