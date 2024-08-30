import Phaser from 'phaser';

export default class VocabSprite extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, vocabularyData, gameFormat) {
        super(scene, x, y, vocabularyData.imageFilename.split('.')[0]);
        this.vocabularyData = vocabularyData;
        this.gameFormat = gameFormat;

        // Set sprite dimensions
        this.setDisplaySize(this.scene.canvasWidth * 0.1, this.height * (this.scene.canvasWidth * 0.1 / this.width));

        // Add sprite to the scene
        this.scene.add.existing(this);

        // Make the sprite interactive
        this.setInteractive();
        this.scene.input.setDraggable(this);

        // Handle input events
        this.on('pointerdown', this.handlePointerDown, this);
        this.on('pointerup', this.handlePointerUp, this);

        // Move the sprite based on gameFormat
        this.moveSprite();
    }

    handlePointerDown() {
        if(this.scene.gameMode === "practice") {
            this.scene.selectedInPractice(this);
        }
        else if(this.scene.gameMode === "challenge") {
            this.scene.selectedInChallenge(this);
        }
    }

    scaleSprite() {
        this.scene.tweens.add({
            targets: this,
            scale: 2,
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    dropSprite() {
        this.scene.tweens.add({
            targets: this,
            y: this.scene.canvasHeight,
            duration: 1000,
            ease: 'Linear'
        });
    }

    jumpSprite() {
        this.scene.tweens.add({
            targets: this,
            y: this.scene.canvasHeight,
            duration: 1000,
            ease: 'Sine.easeInOut'
        });
    }

    moveSprite(direction, spawnPosition, movementSpeed) {
        this.scene.tweens.add({
            targets: this,
            x: spawnPosition.x,
            y: spawnPosition.y,
            duration: movementSpeed,
            ease: 'Power2',
            onComplete: () => {
                if (this.x < 0 || this.x > this.scene.canvasWidth || 
                    this.y < 0 || this.y > this.scene.canvasHeight) {
                    this.destroy();
                    this.scene.spriteOutOfBounds();
                }
            }
        });
    }

    disableInteractive() {
        this.disableInteractive();
    }
}