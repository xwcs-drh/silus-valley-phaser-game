export default class ArrowService {
    constructor(scene) {
        this.scene = scene;
        this.arrow = null;
        this.target = null;
    }

    createArrow(x, y, texture) {
        // Create the arrow sprite at a given position
        this.arrow = this.scene.add.sprite(x, y, texture);
        this.arrow.setScale(0.5); // Scale down the arrow if needed
    }

    setTarget(target) {
        // Set the target object
        this.target = target;
    }

    updateArrow() {
        if (!this.arrow || !this.target) return;

        // Calculate angle to target
        const angle = Phaser.Math.Angle.Between(
            this.arrow.x, this.arrow.y,
            this.target.x, this.target.y
        );

        // Set arrow rotation to point to target
        this.arrow.rotation = angle;

        // Apply a bouncing effect by modifying the arrow's scale or position
        this.applyBouncingEffect();
    }

    applyBouncingEffect() {
        // This creates a simple bounce effect by altering the y position in a sine wave pattern
        this.arrow.y += Math.sin(this.scene.time.now / 100) * 1.5;
    }
}
