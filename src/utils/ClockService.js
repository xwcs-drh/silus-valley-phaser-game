export default class ClockService extends Phaser.GameObjects.Container {
    constructor(scene, x, y, diameter) {
        super(scene, x, y);
        this.scene = scene;
        this.diameter = diameter;
        this.speed = 5;
        this.x = x;
        this.y = y;

        // Add the clock container to the scene
        this.scene.add.existing(this);
    }

    passTime(rotations) {
        return new Promise(resolve => {
            this.createClock(this.diameter);
            this.animateClock(rotations, resolve);
        });
    }

    createClock(diameter) {
        // Create outer circle
        this.outerCircle = this.scene.add.circle(0, 0, diameter / 2, 0x0000ff);
        this.add(this.outerCircle);

        // Create inner circle
        this.innerCircle = this.scene.add.circle(0, 0, (diameter * 0.95) / 2, 0xffffff);
        this.add(this.innerCircle);

        // Create minute hand
        this.minuteHand = this.scene.add.line(0, 0, 0, 0, 0, -(diameter * 0.95 * 0.4), 0x000000);
        this.minuteHand.setLineWidth(3); // Increase line width for a thicker hand
        this.minuteHand.setOrigin(0.5, 0.5);
        this.add(this.minuteHand);

        this.setDepth(114);
    }

    animateClock(rotations, resolve) {
        // Tween in the clock
        this.scene.tweens.add({
            targets: this,
            alpha: { from: 0, to: 1 },
            duration: 100,
            onComplete: () => {
                // Rotate the minute hand
                this.scene.tweens.add({
                    targets: this.minuteHand,
                    angle: 360 * rotations,
                    duration: this.speed * 1000,
                    ease: 'Linear',
                    onComplete: () => {
                        // Wait 0.2 seconds and then tween out and destroy
                        this.scene.time.delayedCall(200, () => {
                            this.scene.tweens.add({
                                targets: this,
                                alpha: { from: 1, to: 0 },
                                duration: 100,
                                onComplete: () => {
                                    this.destroy();
                                    resolve();
                                }
                            });
                        });
                    }
                });
            }
        });
    }
}