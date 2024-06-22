import PopupScene from './PopupScene';
export default class ManualPopupScene extends PopupScene {
    constructor(config) {
        super('ManualPopupScene');
    }


    create() {
        super.create();

        this.popupWidth = this.game.config.width / 2;
        this.popupHeight = this.game.config.height / 2;

        // Add specific content for the manual popup

        if (this.popupContainer) {
            const headerText = this.add.text(50, 0, 'Instructions', { fontSize: '24px', fill: '#000' });
            this.addContentToPopup(0.5, 0.005, headerText, true); // Positioning text at 5% from the top-left corner

            // Add specific content for the manual popup
            const manualText = this.add.text(0, 0, 'Manual Content', { fontSize: '18px', fill: '#000' });
            this.addContentToPopup(0.05, 0.15, manualText, false); // Positioning text at 5% from the top-left corner

        } else {
          console.error('Popup container is not initialized');
        }
    }
}
