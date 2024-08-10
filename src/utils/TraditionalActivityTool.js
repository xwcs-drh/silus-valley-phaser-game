import Phaser from 'phaser';

export default class TraditionalActivityTool extends Phaser.GameObjects.Container {
    constructor(scene, tool) {
        const { id, position, widthPercent, depth } = tool;
        const canvasWidth = scene.cameras.main.width;
        const canvasHeight = scene.cameras.main.height;
        const x = position[0] * canvasWidth;
        const y = position[1] * canvasHeight;
        const width = widthPercent * canvasWidth;

        super(scene, x, y);

        this.id = id;
        this.purpose = tool.purpose;

        // Create background
        const background = scene.add.rectangle(0, 0, width, width, 0xffffff);
        background.setOrigin(0.5);
        background.setStrokeStyle(2, 0x000000);
        this.add(background);

        // Create image
        const imageKey = `${id}Image`;
        const image = scene.add.image(0, 0, imageKey);
        image.setOrigin(0.5);
        const aspectRatio = image.height / image.width;
        image.setDisplaySize(width, width * aspectRatio);
        this.add(image);

        // Add to scene
        scene.add.existing(this);
        this.setDepth(depth);

        // Tween in
        scene.tweens.add({
            targets: this,
            alpha: { from: 0, to: 1 },
            duration: 500,
        });
    }

    updateTool(tool) {
        const { position, widthPercent, depth } = tool;
        const canvasWidth = this.scene.cameras.main.width;
        const canvasHeight = this.scene.cameras.main.height;
        const x = position[0] * canvasWidth;
        const y = position[1] * canvasHeight;
        const width = widthPercent * canvasWidth;

        this.purpose = tool.purpose;

        // Update position and size
        this.scene.tweens.add({
            targets: this,
            x: x,
            y: y,
            duration: 500,
        });

        this.list.forEach(child => {
            if (child instanceof Phaser.GameObjects.Image) {
                const aspectRatio = child.height / child.width;
                child.setDisplaySize(width, width * aspectRatio);
            } else if (child instanceof Phaser.GameObjects.Rectangle) {
                child.setSize(width, width);
            }
        });

        this.setDepth(depth);
    }

    destroyTool() {
        this.scene.tweens.add({
            targets: this,
            alpha: { from: 1, to: 0 },
            duration: 500,
            onComplete: () => {
                this.destroy();
            }
        });
    }
}