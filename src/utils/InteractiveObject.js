import Phaser from 'phaser';

export default class InteractiveObject extends Phaser.GameObjects.Container {
    constructor(scene, objectData) {
        const { id, position, widthPercent, depth, role } = objectData;
        // const canvasWidth = scene.cameras.main.width;
        // const canvasHeight = scene.cameras.main.height;
        const x = position[0] * scene.canvasWidth;
        const y = position[1] * scene.canvasHeight;
        const width = widthPercent * scene.canvasWidth;

        super(scene, x, y);

        this.id = id;
        this.role = role;

        // Create image to get aspect ratio
        const imageKey = `${id}Image`;
        const image = scene.add.image(0, 0, imageKey);
        image.setOrigin(0.5);
        const aspectRatio = image.height / image.width;
        const height = width * aspectRatio;

        // Create background
        const background = scene.add.rectangle(0, 0, width, height, 0xffffff);
        background.setOrigin(0.5);
        background.setStrokeStyle(2, 0x000000);
        this.add(background);

        // Set image size to 95% of the container size
        image.setDisplaySize(0.95 * width, 0.95 * height);
        this.add(image);

        // Set size of the container
        this.setSize(width, height);

        // Add to scene
        scene.add.existing(this);
        this.setDepth(depth);


        // Tween in
        scene.tweens.add({
            targets: this,
            alpha: { from: 0, to: 1 },
            duration: 500,
        });
        // console.log('Object created:', this.id);

        this.setInteractive(new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height), Phaser.Geom.Rectangle.Contains);

        // Set draggable if role is 'agent'
        if (role === 'agent' || role === 'decoy') {
            scene.input.setDraggable(this);
        }
    }

    updateSize(width){
        this.list.forEach(child => {
            if (child instanceof Phaser.GameObjects.Image) {
                const aspectRatio = child.height / child.width;
                const height = width * aspectRatio;
                this.scene.tweens.add({
                    targets: child,
                    displayWidth: 0.95 * width,
                    displayHeight: 0.95 * height,
                    duration: 500,
                });
            } else if (child instanceof Phaser.GameObjects.Rectangle) {
                const aspectRatio = child.height / child.width;
                const height = width * aspectRatio;
                this.scene.tweens.add({
                    targets: child,
                    width: width,
                    height: height,
                    duration: 500,
                });
            }
        });

        // Reset the interactive area to fit the new size
        const newHeight = width * (this.height / this.width);
        this.setSize(width, newHeight);
        this.setInteractive(new Phaser.Geom.Rectangle(-width / 2, -newHeight / 2, width, newHeight), Phaser.Geom.Rectangle.Contains);
    }

    updateObject(objectData) {
        // console.log('Updating object:', objectData);
        const { position, widthPercent, depth, role } = objectData;
        // const canvasWidth = this.scene.cameras.main.width;
        // const canvasHeight = this.scene.cameras.main.height;
        const x = position[0] * this.scene.canvasWidth;
        const y = position[1] * this.scene.canvasHeight;
        const width = widthPercent * this.scene.canvasWidth;

        this.role = role;

        // Update position and size
        // console.log("tweening object: ", this.id);
        // console.log("old position: ", this.x, this.y);
        // console.log("new position: ", x, y);
        this.scene.tweens.add({ // Tween the object to the new position
            targets: this,
            x: x,
            y: y,
            duration: 500,
        });

        if(width !== this.width){
            this.width = width;
            this.updateSize(this.width);
        }

        if(depth !== this.depth){
            this.depth = depth;
            this.setDepth(this.depth);
        }


        // Update draggable state
        if (role === 'agent' || role === 'decoy') {
            this.setInteractive();
            this.scene.input.setDraggable(this);
        } else {
            this.disableInteractive();
        }
    }


    destroyObject() {
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