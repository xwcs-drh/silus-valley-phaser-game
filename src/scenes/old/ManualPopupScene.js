import PopupScene from './PopupScene';

export default class ManualPopupScene extends PopupScene {
    constructor(config) {
        super('ManualPopupScene');
    }

    preload(){
        this.load.image('yellow_wash_background', './assets/UI/yellow_wash_background.jpg'); // Load recipe book background image
    }

    create() {
        // const fontStyles = new FontStyles(this);
        this.game.fontStyles.updateFontResolution(); // Initial call to set the resolution

        //set key for background image for super PopupScene to set
        this.backgroundKey = 'yellow_wash_background';
        console.log(`background image key", ${this.backgroundKey}`);

        super.create();

        console.log("thisscene: ", this.game.fontStyles.baseSceneGenericStyles.popupHeaderFontStyle);
        const popupHeaderStyle = { ...this.game.fontStyles.baseSceneGenericStyles.popupHeaderFontStyle, fontSize: `${this.popupWidth * 0.025}px`};

        // Add specific content for the manual popup

        if (this.popupContainer) {
            const headerText = this.add.text(this.popupX + this.popupWidth * 0.5, this.popupY + this.popupHeight*0.1, 'Instructions', popupHeaderStyle)
            headerText.setOrigin(0.5);
            // this.addContentToPopup(0, 0, headerText, true); // Positioning text at 5% from the top-left corner

            // Add specific content for the manual popup
            const manualText = this.add.text(this.popupX + this.popupWidth * 0.12, this.popupY + this.popupHeight*0.18, 'Manual Content', this.game.fontStyles.baseSceneGenericStyles.popupBodyFontStyle)
            manualText.setOrigin(0.5);
            // this.addContentToPopup(0, 0, manualText, false); // Positioning text at 5% from the top-left corner

        } else {
          console.error('Popup container is not initialized');
        }
    }
}
