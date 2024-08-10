import Phaser from 'phaser';

export default class WheelSlice extends Phaser.GameObjects.Container {
    constructor(scene, x, y, radius, sliceAngle, vocabularyData, role, language) {
        super(scene, x, y);

        this.scene = scene;
        this.radius = radius;
        this.sliceAngle = sliceAngle;
        this.vocabularyData = vocabularyData;
        this.id = vocabularyData.id;
        const imageFilename = vocabularyData[`${role}Image`];
        this.imageKey = imageFilename !== "" ? imageFilename.split('.').slice(0, -1).join('.') : ""; // Remove file extension
        this.role = role;
        this.label = vocabularyData[`word${language}`];
        this.language = language;

        this.ninetyRad = 90 * (Math.PI / 180);
        this.startAngle = -this.ninetyRad - this.sliceAngle / 2;
        this.endAngle = this.sliceAngle / 2 - this.ninetyRad;
        this.anticlockwise = false;

        this.homePosition = { x: x, y: y };
        this.currentRotation = 0;

        this.createSlice();
        //Set image and image mask if there's an image file specified for the slice according to its role
        if(this.imageFilename !== "") {
            this.createImage();
            this.createMask();
        }

        // Create a custom shape for the interactive area
        const sliceShape = new Phaser.Geom.Polygon([
            { x: 0, y: 0 },
            ...this.getArcPoints(0, 0, this.radius, this.startAngle, this.endAngle)
        ]);

        this.setInteractive(sliceShape, Phaser.Geom.Polygon.Contains);
        
        this.scene.input.setDraggable(this);
        this.scene.add.existing(this);
        console.log("WheelSlice created: ", this.id, "; role: ", this.role, "; label: ", this.label);
    }

    getArcPoints(centerX, centerY, radius, startAngle, endAngle, steps = 100) {
        const points = [];
        const angleStep = (endAngle - startAngle) / steps;

        for (let i = 0; i <= steps; i++) {
            const angle = startAngle + i * angleStep;
            points.push({
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            });
        }

        return points;
    }

    createSlice() {
        const slice = this.scene.add.graphics();
        slice.fillStyle(0xffffff, 1);
        slice.beginPath();
        slice.moveTo(0, 0);
        slice.arc(0, 0, this.radius, this.startAngle, this.endAngle, this.anticlockwise);
        slice.closePath();
        slice.fillPath();
        slice.lineStyle(2, 0x000000, 1);
        slice.strokePath();
        this.add(slice);

        console.log("Slice created with the following properties:");
        console.log("Position: (", this.x, ",", this.y, ")");
        console.log("Radius: ", this.radius);
        console.log("Start Angle (radians): ", this.startAngle, " degrees: ", this.startAngle * (180 / Math.PI));
        console.log("End Angle (radians): ", this.endAngle, " degrees: ", this.endAngle * (180 / Math.PI));

        // Add text to the slice
        this.text = this.scene.add.text(this.x, this.y, this.label, {
            font: '24px Arial',
            fill: '#000000',
            align: 'center'
        });
        this.text.setOrigin(0.5);
        this.text.setPosition(this.x, this.y - this.radius / 2);
        this.text.setDepth(3);
    }

    createImage() {
        this.image = this.scene.add.image(0, 0, this.imageKey);
        this.image.setOrigin(0.5, 1);
        // Set the image height to the radius and adjust the width proportionally
        const originalHeight = this.image.height;
        const originalWidth = this.image.width;
        const scaleFactor = this.radius / originalHeight;
        this.image.setDisplaySize(originalWidth * scaleFactor, this.radius);
        // console.log("Image created with the following properties:", this.imageKey);
        // console.log("Position: (", this.x, ",", this.y, ")");
        // console.log("Width: ", this.image.displayWidth);
        // console.log("Height: ", this.image.displayHeight);
        this.add(this.image);
    }

    createMask() {
        // Create a graphics object for the mask
        const maskShape = this.scene.make.graphics({ x: this.x, y: this.y });
        maskShape.fillStyle(0xffffff);
        maskShape.beginPath();
        maskShape.moveTo(0, 0);
        maskShape.arc(0, 0, this.radius, this.startAngle, this.endAngle, this.anticlockwise);
        maskShape.closePath();
        maskShape.fillPath();

        // Create a mask from the graphics object
        const mask = maskShape.createGeometryMask();
        this.image.setMask(mask);

        // Store the mask shape for later use
        this.maskShape = maskShape;

        console.log("Mask created with the following properties:");
        console.log("Position: (", this.x, ",", this.y, ")");
        console.log("Radius: ", this.radius);
        console.log("Start Angle (radians): ", this.startAngle, " degrees: ", this.startAngle * (180 / Math.PI));
        console.log("End Angle (radians): ", this.endAngle, " degrees: ", this.endAngle * (180 / Math.PI));
    }

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
                if (this.text) {
                    this.text.setPosition(this.x, this.y - this.radius / 2);
                }
            }
        });
    }

    returnToHomePosition() {
        this.move(this.homePosition.x, this.homePosition.y);
    }

    distribute(x,y) {
        this.move(x,y);
        this.homePosition = { x: x, y: y };
    }

    /*
    Rotates the slice by the specified angle in radians and updates the text position to be centered on the slice   
    @param angle: angle in radians
    */
   //TODO: fix so text repositions correctly when rotating
    rotateSlice(angle) {
        const angleInDegrees = Phaser.Math.RadToDeg(angle);//convert angle param value from radians to degrees
        const targets = [this];
        if (this.maskShape) {
            targets.push(this.maskShape);
        }

        this.scene.tweens.add({
            targets: targets,
            angle: `+=${angleInDegrees}`,
            duration: 500,
            ease: 'Power2',
            onUpdate: () => {
                if (this.text) {
                    console.log("there is text to rotate");
                    const currentAngle = Phaser.Math.DegToRad(this.angle);
                    const textX = this.x + (this.radius / 2) * Math.cos(currentAngle);
                    const textY = this.y + (this.radius / 2) * Math.sin(currentAngle);
                    this.text.setPosition(textX, textY);
                }
            },
            onComplete: () => {
                this.currentRotation += angle; // Update the current rotation
                console.log(`final Slice position: (${this.x}, ${this.y})`);
                console.log(`final Mask position: (${this.maskShape.x}, ${this.maskShape.y})`);
            }
        });
    }
    
}

// Handle drag events
export function setupInputEvents(scene) {

    scene.input.on('pointerover', (pointer, gameObject) => {
        if (gameObject instanceof WheelSlice) {
            console.log("Pointer over: ", gameObject.id, "; role: ", gameObject.role);
        }
    });
    scene.input.on('dragstart', (pointer, gameObject) => {
        if (gameObject instanceof WheelSlice && (gameObject.role === "draggable" || gameObject.role === "target")) {
            gameObject.setDepth(3);
            gameObject.text.setDepth(4);
        }
    });

    scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
        if (gameObject instanceof WheelSlice && (gameObject.role === "draggable" || gameObject.role === "target")) {
            gameObject.move(dragX, dragY);
        }
    });

    scene.input.on('dragend', (pointer, gameObject) => {
        if (gameObject instanceof WheelSlice && (gameObject.role === "draggable" || gameObject.role === "target")) {
            gameObject.setDepth(2);
            gameObject.returnToHomePosition();
        }
    });
}