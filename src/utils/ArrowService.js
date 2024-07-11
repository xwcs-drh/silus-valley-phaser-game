export default class ArrowService {
    constructor(scene) {
        this.scene = scene;
        this.arrow = null;
        this.target = null;
        this.bounceTween = null;
    }

    createArrow(texture, fillColor) {
        // Create the arrow sprite but don't add it to the scene yet
        this.arrow = this.scene.add.sprite(0, 0, texture);
        this.arrow.setScale(0.15); // Scale up the arrow
        this.setFillColor(fillColor); // Apply the fill color tint
        this.arrow.setDepth(102); //dialogueBox depth +1
        this.arrow.setVisible(false); // Initially hide the arrow
        //console.log(`Arrow created with width: ${this.arrow.displayWidth}, height: ${this.arrow.displayHeight}`);
    }

    setTarget(target) {
        // Set the target object
        this.target = target;
        this.updateArrow(); // Update arrow direction immediately
        //console.log(`arrow service: arrow x: ${this.arrow.x}, y: ${this.arrow.y}`);
    }

    updateArrow() {
        if (!this.arrow || !this.target) return;

        // Calculate angle to target
        const angle = Phaser.Math.Angle.Between(
          this.arrow.x, this.arrow.y,
          this.target.x, this.target.y
        );

        // Set arrow rotation to point 180 degrees (π radians)
        // this.arrow.rotation = Math.PI;

        // Apply the bouncing effect
        this.applyBouncingEffect();
    }

    // This creates a simple bounce effect using Phaser's tween system
    applyBouncingEffect() {
        if (this.bounceTween) {
          this.bounceTween.stop();
        }

        this.bounceTween = this.scene.tweens.add({
          targets: this.arrow,
          y: this.arrow.y - 10, // Adjust bounce height
          yoyo: true,
          repeat: -1,
          duration: 300,
          ease: 'Sine.easeInOut'
        });
    }

    // Set the fill color of the arrow
    setFillColor(color) {
        if (this.arrow) {
            this.arrow.setTint(color);
        }
    }

    //Set the position of the arrow to be relative to the target object, and enable visibility
    pointAtObject(target) {
        //console.log(`arrow service: target x: ${target.x}, y: ${target.y}`);

        this.setTarget(target);
        if (this.arrow) {
            const arrowBottomAboveTargetTop = target.y - (target.displayHeight / 2) - (this.arrow.displayHeight / 2) - 10; // Adjust -10 for gap between arrow and target

            this.arrow.setPosition(target.x, arrowBottomAboveTargetTop);//offset y-position of arrow, to be above the target object
            this.updateArrow(); // Ensure the arrow points to the target immediately
            this.arrow.setVisible(true);
        }
        //console.log(`arrow service: target x: ${target.x}, y: ${target.y}`);
        //console.log(`Arrow now has width: ${this.arrow.displayWidth}, height: ${this.arrow.displayHeight}`);
    }

    //Disable visibility of arrow
    hideArrow() {
        if (this.arrow) {
            this.arrow.setVisible(false);
            if (this.bounceTween) {
                this.bounceTween.stop();
            }
        }
    }
}