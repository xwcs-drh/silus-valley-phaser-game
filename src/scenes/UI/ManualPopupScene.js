import PopupScene from './PopupScene';
export default class ManualPopupScene extends PopupScene {
    constructor(config) {
        super('ManualPopupScene');
    }

    preload(){
        this.load.image('yellow_wash_background', './assets/UI/yellow_wash_background.jpg'); // Load recipe book background image
    }

    create() {
        //set key for background image for super PopupScene to set
        this.backgroundKey = 'yellow_wash_background';
        console.log(`background image key", ${this.backgroundKey}`);

        super.create();


        //Style for Setting header text
        this.h1Style = this.textStyle = {
            fontFamily: 'Unbounded',
            fontSize: `${this.popupWidth * 0.025}px`,
            fill: '#000',
            strokeThickness: 0.5,
            resolution: window.devicePixelRatio,
            wordWrap: { width: this.width*0.35, useAdvancedWrap: true } // Set word wrap width
        };

        //Style for Setting label text
        this.h2Style = this.textStyle = {
            fontFamily: 'Unbounded',
            fontSize: `${this.popupWidth * 0.02}px`,
            fill: '#000',
            strokeThickness: 0.5,
            resolution: window.devicePixelRatio,
            wordWrap: { width: this.width*0.35, useAdvancedWrap: true } // Set word wrap width
        };

        // Add specific content for the manual popup

        if (this.popupContainer) {
            const headerText = this.add.text(this.popupX + this.popupWidth * 0.5, this.popupY + this.popupHeight*0.1, 'Instructions', this.h1Style)
            headerText.setOrigin(0.5);
            // this.addContentToPopup(0, 0, headerText, true); // Positioning text at 5% from the top-left corner

            // Add specific content for the manual popup
            const manualText = this.add.text(this.popupX + this.popupWidth * 0.12, this.popupY + this.popupHeight*0.18, 'Manual Content', this.h2Style)
            manualText.setOrigin(0.5);
            // this.addContentToPopup(0, 0, manualText, false); // Positioning text at 5% from the top-left corner

        } else {
          console.error('Popup container is not initialized');
        }
    }
}
