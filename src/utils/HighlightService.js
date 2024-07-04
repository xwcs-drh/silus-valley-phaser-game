export default class HighlightService {
  constructor(scene) {
    this.scene = scene;
    this.overlay = null;
    this.originalDepth = null; // Store the original depth of the highlighted object
    this.highlightedObject = null; // Store the currently highlighted object
  }

  createOverlay() {
    console.log('Creating overlay');
    // Create a dark overlay that covers the entire scene
    if (!this.overlay) {
      this.overlay = this.scene.add.graphics();
      this.overlay.fillStyle(0x000000, 0.2); // Black with 50% opacity
      this.overlay.fillRect(0, 0, this.scene.sys.game.config.width, this.scene.sys.game.config.height);
      this.overlay.setDepth(100); // Ensure the overlay is above most other objects
    } else {
      this.overlay.setVisible(true);
    }
  }

    highlightObject(targetObject) {
        console.log(`Highlighting object at (${targetObject.x}, ${targetObject.y})`);

        // Ensure targetObject is a Phaser GameObject or Container
        if (targetObject.setDepth) {
            // Create the overlay if it doesn't exist
            this.createOverlay();

            this.originalDepth = targetObject.depth; //original depth of the currently highlighted object
            this.highlightedObject = targetObject; //reference to the object currently being highlighted

            // Bring the target object to the front
            this.scene.children.bringToTop(targetObject);

            targetObject.setDepth(100); // Ensure the target object is above the overlay

            // Optional tween scale
            // this.scene.tweens.add({
            //   targets: targetObject,
            //   scale: { from: 1, to: 1.2 },
            //   duration: 300,
            //   yoyo: true,
            //   repeat: -1,
            //   ease: 'Sine.easeInOut'
            // });
        } else {
          console.error('targetObject is not a Phaser GameObject or Container and does not support setDepth');
        }
    }

    clearHighlight(){
        console.log('Clearing highlight');
        if (this.overlay) {
            this.overlay.setVisible(false);
            
            // Reset the depth of the highlighted object
            if (this.highlightedObject && this.highlightedObject.setDepth) {
              this.highlightedObject.setDepth(this.originalDepth);
            }

            // Clear the stored depth and highlighted object
            this.originalDepth = null;
            this.highlightedObject = null;
        }
    }

    tempHighlightObject(targetObject, duration){
        this.highlightObject(targetObject);
        this.scene.time.delayedCall(duration, () => {
            this.clearHighlight();
        });
    }
}