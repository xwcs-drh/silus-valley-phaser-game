import Phaser from 'phaser';
import PopupScene from './PopupScene';

export default class ResourceDetailPopup extends PopupScene {
    constructor(scene, resource) {
        super(scene, scene.cameras.main.centerX, scene.cameras.main.centerY);
        
        this.resource = resource;
        this.createDetailPopup();
    }

    createDetailPopup() {
        const background = this.scene.add.rectangle(0, 0, 300, 400, 0xffffff);
        const thumbnail = this.scene.add.image(0, -150, this.resource.thumbnail).setScale(1.0);
        const nameText = this.scene.add.text(0, -50, this.resource[`name${this.language}`], { fontSize: '24px', color: '#000' }).setOrigin(0.5);
        const descriptionText = this.scene.add.text(0, 0, this.resource[`description${this.language}`], { fontSize: '16px', color: '#000', wordWrap: { width: 280 } }).setOrigin(0.5);
        const closeButton = this.scene.add.text(0, 180, 'Close', { fontSize: '18px', color: '#000' }).setOrigin(0.5).setInteractive();

        closeButton.on('pointerdown', () => this.destroy());

        this.add([background, thumbnail, nameText, descriptionText, closeButton]);
    }
}