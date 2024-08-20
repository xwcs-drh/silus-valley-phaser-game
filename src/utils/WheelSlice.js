import Phaser from 'phaser';
import { pointInPolygon } from './geometry';


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
        this.matched = false;

        this.createSlice();

        //Set image and image mask if there's an image file specified for the slice according to its role
        if(this.imageFilename !== "" && this.role !== "draggable") {
            this.createImage();
            this.createMask();
        }

        // Create a custom shape for the interactive area
        const sliceShape = new Phaser.Geom.Polygon([
            { x: 0, y: 0 },
            ...this.getArcPoints(0, 0, this.radius, this.startAngle, this.endAngle)
        ]);

       //Set the interactive area of the slice
        this.setInteractive(sliceShape, Phaser.Geom.Polygon.Contains);
        
        //Set draggability if the slice's role is 'draggable'
        if(this.role === "draggable") {
            this.scene.input.setDraggable(this);
        }
        this.scene.add.existing(this);
        
    }

    /**
     * Returns the points of an arc
     * @param {number} centerX : the x coordinate of the center of the arc
     * @param {number} centerY : the y coordinate of the center of the arc
     * @param {number} radius : the radius of the arc
     * @param {number} startAngle : the start angle of the arc
     * @param {number} endAngle : the end angle of the arc
     * @param {number} steps : the number of steps to use to approximate the arc
     * @returns {Array} : the points of the arc
     */
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

    /**
     * Creates the slice
     * This function creates a graphical representation of the slice using Phaser's graphics object.
     * It sets the fill color, draws the arc shape, and adds a border to the slice.
     * Additionally, it adds a text label to the slice, positioning it at the center of the slice.
     * The created slice and text are then added to the scene.
     */
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

        this.sliceShape = slice;
        this.add(this.sliceShape);

        // Add text to the slice
        this.text = this.scene.add.text(this.x, this.y, this.label, {
            font: '24px Arial',
            fill: '#000000',
            align: 'center'
        });
        this.text.setOrigin(0.5);
        this.text.setPosition(this.x, this.y - this.radius / 2);
        this.text.setDepth(1);
    }

    /**
     * Creates the image for the slice
     * This function creates an image object for the slice and sets its origin to the center of the image.
     * It then scales the image to fit the radius of the slice and adds it to the scene.
     */
    createImage() {
        this.image = this.scene.add.image(0, 0, this.imageKey);
        this.image.setOrigin(0.5, 1);
        // Set the image height to the radius and adjust the width proportionally
        const originalHeight = this.image.height;
        const originalWidth = this.image.width;
        const scaleFactor = this.radius / originalHeight;
        this.image.setDisplaySize(originalWidth * scaleFactor, this.radius);
        this.add(this.image);
    }

    /**
     * Creates the mask for the slice
     * This function creates a graphics object for the mask and fills it with the specified color.
     * It then creates a mask from the graphics object and sets it to the image.
     */
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
                if (this.text) {
                    this.text.setPosition(this.x, this.y - this.radius / 2);
                }
            }
        });
    }

    /**
     * Returns the slice to its home position
     * This function moves the slice to its home position and resets its rotation and scale.
     */
    returnToHomePosition() {
        this.move(this.homePosition.x, this.homePosition.y);
        this.matched = false;
        this.setSliceDepth(0);
    }

    /**
     * Distributes the slice to the specified coordinates
     * This function moves the slice to the specified coordinates and updates its home position.
     * @param {number} x : the x coordinate of the new position
     * @param {number} y : the y coordinate of the new position
     */
    distribute(x,y) {
        this.move(x,y);
        this.homePosition = { x: x, y: y };
    }

    /**
     * Sets the home position of the slice
     * This function sets the home position of the slice to the specified coordinates.
     * @param {number} x : the x coordinate of the new position
     * @param {number} y : the y coordinate of the new position
     */
    setHomePosition(x,y) {
        // console.log("setting home position of: ", this.id, ", role: ", this.role, " to: ", x, y);
        this.homePosition = { x: x, y: y };
        // const polygon = this.getPolygon();
        // console.log("home position of: ", this.id, ", role: ", this.role, " is: ", polygon);
    }

    
    /*
    Rotates the slice by the specified angle in radians and updates the text position to be centered on the slice   
    @param angle: angle in radians
    */
    rotateSlice(angle) {
        const angleInDegrees = Phaser.Math.RadToDeg(angle);//convert angle param value from radians to degrees
        const targets = [this];
        if (this.maskShape) {
            targets.push(this.maskShape);
        }

        //Rotate the slice and the mask shape
        this.scene.tweens.add({
            targets: targets,
            angle: `+=${angleInDegrees}`,
            duration: 500,
            ease: 'Power2',
            onUpdate: () => {
                if (this.text) {
                    //Calculate the angle of the text
                    const midpointAngle = (this.startAngle + this.endAngle) / 2 + Phaser.Math.DegToRad(this.angle);

                    const textX = this.x + (this.radius / 2) * Math.cos(midpointAngle);
                    const textY = this.y + (this.radius / 2) * Math.sin(midpointAngle);
                    this.text.setPosition(textX, textY);
                }
            },
            onComplete: () => {
                this.currentRotation += angle; // Update the current rotation
                console.log("current rotation: ", this.currentRotation);
        
                // Update the start and end angles
                this.startAngle += angle;
                this.endAngle += angle;

                // Ensure angles stay within the range of -2π to 2π
                this.startAngle = Phaser.Math.Wrap(this.startAngle, -Math.PI * 2, Math.PI * 2);
                this.endAngle = Phaser.Math.Wrap(this.endAngle, -Math.PI * 2, Math.PI * 2);

                // console.log("after rotate: startAngle: ", this.startAngle, "; endAngle: ",this.endAngle);
            }
        });
    }

    /**
     * Scales the slice by the specified scale factor
     * This function uses Phaser's tweens to animate the slice to the new scale.
     * It updates the scale of the slice and the mask shape to ensure they scale together.
     * @param {number} scale : the scale factor to apply to the slice
     */
    scaleSlice(scale) {
        console.log("scaling slice: ", this.id, ", role: ", this.role, " to: ", scale);
        const targets = [this];
        if (this.maskShape) {
            targets.push(this.maskShape);
        }

        this.scene.tweens.add({
            targets: targets,
            scaleX: scale,
            scaleY: scale,
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
                this.radius *= scale;
                console.log(`Slice ${this.id} scaled to: ${scale}`);
            }
        });
    }

    /**
     * Sets the depth of the slice
     * This function sets the depth of the slice and the text to ensure they are displayed in the correct order.
     * @param {number} depth : the depth to set the slice to
     */
    setSliceDepth(depth) {
        this.setDepth(depth + 1);
        this.text.setDepth(depth + 2);
        // console.log("setting draggabledepth of slice to: ", depth);
    }

    /**
     * Returns the polygon of the slice
     * This function returns the polygon of the slice.
     * It is used to check if a point is inside the slice.
     * @returns {Phaser.Geom.Polygon} : the polygon of the slice
     */
    getPolygon() {
        // console.log("after rotate: startAngle: ", this.startAngle, "; endAngle: ",this.endAngle);

        return new Phaser.Geom.Polygon([
            { x: this.homePosition.x, y: this.homePosition.y },
            ...this.getArcPoints(this.homePosition.x, this.homePosition.y, this.radius, this.startAngle, this.endAngle)
        ]);
    }

    /**
     * Highlights the slice
     * This function highlights the slice by setting the alpha of the image and text to 0.5.
     */
    highlight() {
        if (!this.highlighted) {
            // console.log("highlighting: ", this.id, ", role: ", this.role);
            // this.sliceShape.lineStyle(5, 0xFFFF00, 1);
            // this.maskShape.lineStyle(5, 0xFFFF00, 1);
            if(this.image){
                this.image.setAlpha(0.5); 
            }
            this.highlighted = true;
            if(this.text){
                this.text.setAlpha(0.5);
            }
        }
    }

    /**
     * Unhighlights the slice
     * This function unhighlights the slice by setting the alpha of the image and text to 1.
     */
    unhighlight() {
        if(this.image){
            this.image.setAlpha(1); // Reset the alpha to fully opaque
        }
        // this.sliceShape.lineStyle(2, 0x000000, 1);
        // this.maskShape.lineStyle(2, 0x000000, 1);
        if(this.text){
            this.text.setAlpha(1);
        }
        this.highlighted = false;
    }

    scoreLabel(correct) {
        if(correct) {
            this.text.setText(`✅ ${this.text.text}`);
        }
        else {
            this.text.setText(`❌ ${this.text.text}`);
        }
    }
    
}

// Handle drag events
export function setupInputEvents(scene) {
    let draggingSlice = null; // Variable to keep track of the currently dragged slice

    /*
    Handle dragstart event
    This function handles the dragstart event by checking if the gameObject is a WheelSlice and if its role is "draggable".
    It then sets the depth of the gameObject to 1 and sets the draggingSlice variable to the gameObject.
    */
    scene.input.on('dragstart', (pointer, gameObject) => {
        //Check if the gameObject is a WheelSlice and if its role is "draggable"
        if (gameObject instanceof WheelSlice && gameObject.role === "draggable") {
            gameObject.setSliceDepth(1);
            draggingSlice = gameObject;
        }
    });

    /*
    Handle drag event
    This function handles the drag event by checking if the gameObject is a WheelSlice and if its role is "draggable" or "target".
    It then sets the depth of the gameObject to 3 and moves it to the new position.
    */
    scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
        //Check if the gameObject is a WheelSlice and if its role is "draggable" or "target"
        if (gameObject instanceof WheelSlice && (gameObject.role === "draggable" || gameObject.role === "target")) {
            gameObject.setSliceDepth(3);
            gameObject.move(dragX, dragY);
        }
    });

    /*
    Handle dragend event
    This function handles the dragend event by checking if the gameObject is a WheelSlice and if its role is "draggable" or "target".
    It then checks for collisions between the gameObject and the wheelSlices.
    */
    scene.input.on('dragend', (pointer, gameObject) => {
        draggingSlice = null;
        console.log("dragend event triggered on mode: ", scene.gameMode);
        //Check if the gameObject is a WheelSlice and if its role is "draggable" or "target"
        if (gameObject instanceof WheelSlice && (gameObject.role === "draggable" || gameObject.role === "target")) {
    
            let finalCollisionDetected = false;
            let i = 0;

            //Loop through the wheelSlices to check for collisions
            while (i < scene.wheelSlices.length && !finalCollisionDetected) {
                const wheelSlice = scene.wheelSlices[i];
                if (wheelSlice instanceof WheelSlice && (wheelSlice.role === "target" && wheelSlice.matched === false) && gameObject.role === "draggable") {
                    const pointerPosition = { x: pointer.worldX, y: pointer.worldY };
                    const wheelSlicePolygon = wheelSlice.getPolygon();
                    wheelSlice.unhighlight();

                    
                    if (pointInPolygon(pointerPosition, wheelSlicePolygon)) {
                        // Handle collision
                        if ((gameObject.id === wheelSlice.id) || (scene.gameMode === 'challenge')) {
                            console.log("Collision detected between: ", gameObject.id, ", role: ", gameObject.role, " and ", wheelSlice.id, ", role: ", wheelSlice.role);
                            handleCollision(scene, gameObject, wheelSlice);
                            finalCollisionDetected = true; // Exit the loop after handling the collision
                            break; // Exit the while loop
                        }
                    }
                }
                i++;
            }
            //If no collision is detected, return the gameObject to its home position
            if (!finalCollisionDetected) {
                console.log("No correct collision detected, returning to home position.");
                gameObject.returnToHomePosition();
            }
        }
    });

    /*
    Handle pointermove event
    This function handles the pointermove event by checking if the gameObject is a WheelSlice and if its role is "target".
    It then sets the depth of the gameObject to 3 and moves it to the new position.
    */
    scene.input.on('pointermove', (pointer) => {
        if (draggingSlice) {
            let hoveredSlice = null;

            scene.wheelSlices.forEach(wheelSlice => {
                if (wheelSlice.role === "target") {
                    const pointerPosition = { x: pointer.worldX, y: pointer.worldY };
                    const wheelSlicePolygon = wheelSlice.getPolygon();
                    if (pointInPolygon(pointerPosition, wheelSlicePolygon)) {
                        hoveredSlice = wheelSlice;
                    }
                }
            });

            scene.wheelSlices.forEach(wheelSlice => {
                if (wheelSlice.role === "target") {
                    if (wheelSlice === hoveredSlice) {
                        wheelSlice.highlight();
                    } else {
                        wheelSlice.unhighlight();
                    }
                }
            });
        }
    });
}

/*
Handle collision
This function handles the collision between the draggable and the target.
It then scales the draggable to the size of the target and moves it to the position of the target.
It then rotates the draggable to the rotation of the target and sets the depth of the draggable to the depth of the target + 1.
*/
function handleCollision(scene, draggable, target) {
    console.log("target radius: ", target.radius, "; draggable radius: ", draggable.radius);
    draggable.scaleSlice(target.radius / draggable.radius);
    draggable.move(target.homePosition.x, target.homePosition.y);
    console.log("target rotation: ", target.currentRotation);
    draggable.rotateSlice(target.currentRotation);
    draggable.setSliceDepth(target.depth + 1);
    // Remove draggability from the draggable slice
    draggable.removeInteractive();
    draggable.matched = true;
    target.removeInteractive();
    target.matched = true;
    
    if(scene.gameMode === 'challenge'){
        handleChallengeDrop(scene, draggable, target);
    }
    else{
        handlePracticeDrop(scene, draggable, target);
    }
}

/*
Handle challenge drop
This function handles the challenge drop by adding the draggable and target to the challenge drop data.
*/
function handleChallengeDrop(scene, draggable, target) {
    scene.addChallengeDrop(draggable, target);
    console.log("scene.slicesFilled.length === scene.wheelSlices.length, ", scene.slicesFilled.length, scene.wheelSlices.length);
    if(scene.numDropped === scene.wheelSlices.length){
        console.log("Challenge completed");
        scene.validateChallengeDrops();
    }
}

/*
Handle practice drop
This function handles the practice drop by adding the draggable and target to the practice drop data.
*/
function handlePracticeDrop(scene, draggable, target) {
    scene.addIncorrectDropData(draggable, target);
}