export default class HighlightService {
    constructor(scene) {
        this.scene = scene;
        this.overlay = null;
    }

    createOverlay() {
        // Create a dark overlay that covers the entire scene
        this.overlay = this.scene.add.graphics({ fillStyle: { color: 0x000000, alpha: 0.5 } });
        this.overlay.fillRect(0, 0, this.scene.sys.game.config.width, this.scene.sys.game.config.height);
    }

    highlightObject(x, y, radius) {
        if (!this.overlay) {
            this.createOverlay();
        }

        // Set blend mode to erase for the circle area
        this.overlay.setBlendMode(Phaser.BlendModes.ERASE);
        this.overlay.fillCircle(x, y, radius);
        this.overlay.setBlendMode(Phaser.BlendModes.NORMAL);  // Reset blend mode
    }

    clearHighlight() {
        if (this.overlay) {
            this.overlay.clear();
            this.overlay = null;
        }
    }
}
