/*
HighlightService.js:
Functionality:
    - Adds a semi-transparent overlay to the scene
    - Adds a blocker to the scene to prevent interactivity with elements at a lower depth
    - Changes the depth of a target object to be higher (in front of) the blocker and overlays
    - Adds a border to a target object
        - The border is colored and has a tweening alpha. 
Imported into : `BaseScene`
Called from: `DialogueManager` as indicated by `dialogueData...functions`
*/
export default class HighlightService {
  constructor(scene) {
    this.scene = scene; //the scene which contains the target objects that will be highlighted
    this.overlay = null; // Graphics object for a semi-transparent rectangle
    this.originalDepth = null; // Store the original depth of the highlighted object
    this.overlayDepth = 100; //Store the default depth for the overlay
    this.blockerDepth = 101; //Store the default depth for the blocker
    this.targetObjectDepth = 102; //Store the default depth for the target object when highlighted
    this.highlightedObject = null; // Store the currently highlighted object
    this.border = null; // Graphics object for the border
  }

    /*
    Create a dark overlay that covers the entire scene
    */
    createOverlay() {
        console.log('Creating overlay');
        if (!this.overlay) {
            this.overlay = this.scene.add.graphics();
            this.overlay.fillStyle(0x000000, 0.2); // Black with 20% opacity
            this.overlay.fillRect(0, 0, this.scene.sys.game.config.width, this.scene.sys.game.config.height);
            this.overlay.setDepth(this.overlayDepth); // Ensure the overlay is above most other objects
        } else {
            this.overlay.setVisible(true);
        }

        // Create an invisible input blocker that covers the entire scene
        if (!this.blocker) {
            this.blocker = this.scene.add.rectangle(0, 0, this.scene.sys.game.config.width, this.scene.sys.game.config.height, 0x000000, 0);
            this.blocker.setOrigin(0, 0);
            this.blocker.setInteractive();
            this.blocker.setDepth(this.blockerDepth); // Ensure the blocker is above the overlay
        } else {
            this.blocker.setVisible(true);
        }
    }

    /*
    Create a border around the target object
    Includes:
        - Border
        - Tweening alpha
    Parameters:
        - Target object (gameObject or container)
        - colorStart (hexadecimal color code): starting color for the border 
        - colorEnd (hexadecimal color code): ending color for the border for the tween (NOT IMPLEMENTED)
        - alphaStart (hexadecimal color code): starting alpha value for the border at tween
        - alphaEnd (hexadecimal color code): ending alpha value for the border tween 
        - thickness (number): thickness of the border
    */
    createBorder(targetObject, colorStart, colorEnd, alphaStart, alphaEnd, thickness) {
        console.log("Creating border");
        if (this.border) {
            this.border.clear(); // Clear the previous border if it exists
            this.border.destroy(); // Destroy previous border graphics to prevent reuse
        }
        this.border = this.scene.add.graphics();

        // Style the border
        this.border.lineStyle(thickness, colorStart);
        this.border.strokeRect(targetObject.x - targetObject.width / 2, targetObject.y - targetObject.height / 2, targetObject.width, targetObject.height);
        this.border.setDepth(this.targetObjectDepth); // Ensure the border is above the highlighted object

        // Apply the pulsing tween effect
        this.scene.tweens.add({
            targets: this.border,
            alpha: { start: alphaStart, to: alphaEnd },
            duration: 700,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    /*
    Activates object highlight
    Functionality:
        - Change depth of target object to move above the overlay and blocker
        - Add the border
        - Add the overlay
        - Add the blocker
    Parameters:
        - Target object name (string)
        - Duration (number): milliseconds for the target object to be highlighted
        - colorStart (hexadecimal color code): starting color for the border 
        - colorEnd (hexadecimal color code): ending color for the border for the tween (NOT IMPLEMENTED)
        - alphaStart (hexadecimal color code): starting alpha value for the border at tween
        - alphaEnd (hexadecimal color code): ending alpha value for the border tween 
        - thickness (number): thickness of the border
    */
    highlightObject(targetObject, colorStart = 0xFFFD37, colorEnd = 0xFFFFE0, alphaStart = 1, alphaEnd = 0.2, thickness = 4) {
        console.log("Highlighting object", targetObject);
        this.createOverlay();
        if (targetObject instanceof Phaser.GameObjects.GameObject || targetObject instanceof Phaser.GameObjects.Container) {
            console.log("Highlighting object : ", targetObject);
            console.log(`Highlighting object at (${targetObject.x}, ${targetObject.y})`);

            this.originalDepth = targetObject.depth;
            targetObject.setDepth(this.targetObjectDepth);

            this.highlightedObject = targetObject;
            this.createBorder(targetObject, colorStart, colorEnd, alphaStart, alphaEnd, thickness);
        } else {
            console.error("Error: targetObject is not a Phaser GameObject or Container and does not support setDepth");
            console.log("targetObject type: ", typeof targetObject);
            console.log("targetObject properties: ", targetObject);
        }
    }

    /*
    Dectivates object highlight
    Functionality:
        - Reset depth of the target object to it's depth before being highlighted
        - Remove the border of target object
        - Remove the overlay from the scene
        - Remove the blocker from the scene
    */
    clearHighlight(){
        console.log('Clearing highlight');
        if (this.overlay) {
            this.overlay.setVisible(false);

            if (this.highlightedObject && this.highlightedObject.setDepth) {
                this.highlightedObject.setDepth(this.originalDepth);
            }

            this.originalDepth = null;
            this.highlightedObject = null;
        }
        if (this.border) {
            this.border.clear();
            this.border.destroy(); // Destroy the border graphics
            this.border = null; // Reset the border reference
        }
    }

    /*
    Activates target object highlight (`highlightObject(args)`), then clears it after `duration`
    Parameters:
        - Target object name (string)
        - Duration (number): milliseconds for the target object to be highlighted
        - colorStart (hexadecimal color code): starting color for the border 
        - colorEnd (hexadecimal color code): ending color for the border for the tween (NOT IMPLEMENTED)
        - alphaStart (hexadecimal color code): starting alpha value for the border at tween
        - alphaEnd (hexadecimal color code): ending alpha value for the border tween 
        - thickness (number): thickness of the border
    */
    tempHighlightObject(targetObjectName, duration, colorStart = 0xFFFD37, colorEnd = 0xFFFFE0, alphaStart = 1, alphaEnd = 0.5, thickness = 4) {
        //Check the target object exists in the scene
        console.log("Highlight service targetObjectName: ", targetObjectName.name, " scene: ", this.scene.sceneKey);
        //Store the target object
        const targetObject = this.scene.children.getByName(targetObjectName.name);
        //Check the target object has been successfully found and stored
        console.log("Highlight service targetObject: ", targetObject);

        //If the target object has been successfully found and stored as a non-null value:
            //highlight the object, wait `duration`, then clear the highlight.
        if (targetObject) {
            this.highlightObject(targetObject, colorStart, colorEnd, alphaStart, alphaEnd, thickness);
            this.scene.time.delayedCall(duration, () => {
                targetObject.setDepth(0); // Reset depth if needed
                this.clearHighlight(); // Clear the highlight after the duration
            });
        } 
        //If the target object has not been successfully found and stored as a null value, return error statement
        else {
            console.error(`Error: Could not find targetObject in scene ${this.scene.sceneKey} with name ${targetObjectName}`);
        }
    }
}