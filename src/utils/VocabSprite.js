import Phaser from 'phaser';

export default class VocabSprite extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, vocabularyData, gameFormat) {
        super(scene, x, y, 'spriteImg');
        this.vocabularyData = vocabularyData;
        this.gameFormat = gameFormat;


        // Ensure the sprite's texture is loaded before setting the display size
        // this.scene.load.once('complete', () => {
            const canvasWidth = this.scene.canvasWidth;
            const canvasHeight = this.scene.canvasHeight;
            const aspectRatio = this.width / this.height;

            let newWidth, newHeight;

            if (this.width > this.height) {
                newWidth = canvasWidth * 0.3;
                newHeight = newWidth / aspectRatio;
            } else {
                newHeight = canvasHeight * 0.3;
                newWidth = newHeight * aspectRatio;
            }

            this.setDisplaySize(newWidth, newHeight);
            // console.log("newWidth: ", newWidth," ; newHeight: ", newHeight);

            // Add sprite to the scene
            // this.scene.add.existing(this);

            // Make the sprite interactive
            this.setInteractive();
            this.scene.input.setDraggable(this);

            // Handle input events
            this.on('pointerdown', this.handlePointerDown, this);

            // Move the sprite based on gameFormat
            const targetPosition = { x: 0, y: 0 };
            // console.log('Game format direction:', this.gameFormat.direction);

            switch (this.gameFormat.direction) {
                case "leftward":
                    targetPosition.x = -this.width;
                    targetPosition.y = y;
                    // console.log('Moving leftward to:', targetPosition);
                    this.moveSprite(targetPosition);
                    break;
                case "rightward":
                    targetPosition.x = this.scene.canvasWidth + this.width;
                    targetPosition.y = y;
                    // console.log('Moving rightward to:', targetPosition);
                    this.moveSprite(targetPosition);
                    break;
                case "upward":
                    targetPosition.x = x;
                    targetPosition.y = Phaser.Math.Between(this.scene.canvasHeight * 0.3, this.scene.canvasHeight * 0.5);
                    // console.log('Jumping upward to:', targetPosition);
                    this.jumpSprite(targetPosition);
                    break;
                case "downward":
                    targetPosition.x = x;
                    targetPosition.y = this.scene.canvasHeight + this.height;
                    // console.log('Dropping downward to:', targetPosition);
                    this.dropSprite(targetPosition);
                    break;
                case "grow":
                    targetPosition.x = x;
                    targetPosition.y = y;
                    // console.log('Scaling sprite');
                    this.scaleSprite();
                    break;
            }
        // });

        // Add sprite to the scene
        this.scene.add.existing(this);
    }

    handlePointerDown() {
        if (this.scene.gameMode === "practice") {
            this.scene.selectedInPractice(this);
        } else if (this.scene.gameMode === "challenge") {
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
            ease: 'Sine.easeInOut',
            onComplete: () => {
                if (this.active && this.y > this.scene.canvasHeight) {
                    if (!this.outOfBoundsCalled) {
                        this.outOfBoundsCalled = true;
                        this.scene.spriteOutOfBounds(this.vocabularyData);
                    }
                }
            }
        });
        // Track the tween
        this.scene.activeTweens.push(tween);

        this.on('destroy', () => {
            tween.stop();
        });
    }

    dropSprite(targetPosition) {
        const tween = this.scene.tweens.add({
            targets: this,
            y: targetPosition.y,
            duration: 1000,
            ease: 'Linear',
            onComplete: () => {
                if (this.active && this.y > this.scene.canvasHeight) {
                    if (!this.outOfBoundsCalled) {
                        this.outOfBoundsCalled = true;
                        this.scene.spriteOutOfBounds(this.vocabularyData);
                    }
                }
            }
        });
        // Track the tween
        this.scene.activeTweens.push(tween);

        this.on('destroy', () => {
            tween.stop();
        });
    }

    jumpSprite(targetPosition) {
        // Move upward to targetPosition.y
        const tween = this.scene.tweens.add({
            targets: this,
            y: targetPosition.y,
            duration: 3000,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                // Fall back down to the bottom of the screen
                this.scene.tweens.add({
                    targets: this,
                    y: this.scene.canvasHeight*1.1,
                    duration: 2000,
                    ease: 'Sine.easeInOut',
                    onComplete: () => {
                        if (this.active && this.y > this.scene.canvasHeight) {
                            if (!this.outOfBoundsCalled) {
                                this.outOfBoundsCalled = true;
                                this.scene.spriteOutOfBounds(this.vocabularyData);
                            }
                        }
                    }
                });
            }
        });
        // Track the tween
        this.scene.activeTweens.push(tween);

        this.on('destroy', () => {
            tween.stop();
        });
    }

    /**
     * Moves the sprite to the end position
     * @param {*} endPosition : the position to move the sprite to
     * @param {*} movementSpeed : the speed at which to move the sprite
     */
    moveSprite(targetPosition) {
        // console.log('Starting moveSprite to:', targetPosition);
        const tween = this.scene.tweens.add({
            targets: this,
            x: targetPosition.x,
            y: targetPosition.y,
            duration: this.gameFormat.movementSpeed,
            ease: 'Linear',
            onComplete: () => {
                if (this.active && (this.x < 0 || this.x > this.scene.canvasWidth)) {
                    if (!this.scene.outOfBoundsCalled) {
                        this.scene.outOfBoundsCalled = true;
                        this.scene.spriteOutOfBounds(this.vocabularyData);
                    }
                }
            }
        });
        // Track the tween
    this.scene.activeTweens.push(tween);

        // Add a listener to destroy the tween if the sprite is destroyed
        this.on('destroy', () => {
            if(tween){
                tween.stop();
            }
        });
    }

    disableInteractive() {
        if(this && this.interactive){
            this.setInteractive(false);
        }
    }
}