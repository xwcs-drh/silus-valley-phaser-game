import Phaser from 'phaser';

export default class VocabCircle extends Phaser.GameObjects.Container {
    constructor(scene, x, y, radius, vocabularyData, language) {
        super(scene, x, y);
    
        this.scene = scene;
        this.radius = radius;
        this.vocabularyData = vocabularyData;
        this.language = language;
    
        const imageFilename = vocabularyData.targetImage;
        this.imageKey = imageFilename !== "" ? imageFilename.split('.').slice(0, -1).join('.') : ""; // Remove file extension
        console.log(`image key: ${this.imageKey}`);
        this.label = vocabularyData.wordH;
    
        this.createCircle();
        this.createImage();
        this.createText();
    
        this.scene.add.existing(this);
        console.log(`radius: ${this.radius}`);
        console.log("vocab data:", vocabularyData);
        console.log(`this circle label: ${this.label}`);
    }

    createCircle() {
        const circle = this.scene.add.graphics();
        circle.fillStyle(0xffffff, 1);
        circle.fillCircle(0, 0, this.radius);
        circle.lineStyle(2, 0x000000, 1);
        circle.strokeCircle(0, 0, this.radius);
    
        this.add(circle);
        this.circle = circle; // Store reference to the circle if needed later
    }


    createImage() {
        if (this.imageKey) {
            // Create the image
            this.image = this.scene.add.image(0, 0, this.imageKey);
            this.image.setOrigin(0.5);
            this.image.setDisplaySize(this.radius * 2, this.radius * 2); // Ensure the image covers the circle
    
            // Create a mask using the circle shape
            const maskShape = this.scene.make.graphics();
            maskShape.fillStyle(0xffffff);
            maskShape.fillCircle(0, 0, this.radius);
            maskShape.moveTo(0, 0);

    
            const mask = maskShape.createGeometryMask();
            this.image.setMask(mask);
            // Store the mask shape for later use
            this.maskShape = maskShape;

            // Add the image to the container
            this.add(this.image);
        }
    }


    createText() {
        this.text = this.scene.add.text(0, 0, this.label, {
            ...this.scene.fontStyles.baseSceneGenericStyles.bodyFontStyle,
            fill: '#000000',
            align: 'center'
        });
        this.text.setOrigin(0.5);
        this.text.setPosition(0, 0);
        this.add(this.text);
    }

    /**
     * Moves the slice to the specified coordinates
     * This function uses Phaser's tweens to animate the slice to the new position.
     * It updates the position of the slice and the mask shape to ensure they move together.
     * @param {number} x : the x coordinate of the new position
     * @param {number} y : the y coordinate of the new position
     */
    move(x, y) {
        this.scene.tweens.add({
            targets: this,
            x: x,
            y: y,
            duration: 500,
            ease: 'Power2',
            onUpdate: () => {
                if (this.maskShape) {
                    this.maskShape.setPosition(this.x, this.y); // Ensure the mask shape moves with the container
                }
                
            },
            onComplete: () => {
                this.setPosition(x, y);
            }
        });
    }

}