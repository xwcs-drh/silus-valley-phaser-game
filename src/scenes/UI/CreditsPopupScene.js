import PopupScene from './PopupScene';
export default class CreditsPopupScene extends PopupScene {
    constructor(config) {
        super('CreditsPopupScene');
    }

    preload(){
        this.load.json('credits', './assets/data/JSONs/credits.json'); //load credits data
        this.load.image('yellow_wash_background', './assets/UI/yellow_wash_background.jpg'); // Load recipe book background image
    }

    /**
     * Creates the credits popup
     */
    create() {
        super.create();
        //Style for Credit Header text
        this.creditHeaderStyle = this.textStyle = {
            fontFamily: 'Unbounded',
            fontSize: `${this.popupWidth * 0.025}px`,
            fill: '#000',
            strokeThickness: 0.5,
            resolution: window.devicePixelRatio,
            wordWrap: { width: this.width*0.35, useAdvancedWrap: true } // Set word wrap width
        };

        //Style for credit line text
        this.creditTextStyle = this.textStyle = {
            fontFamily: 'Unbounded',
            fontSize: `${this.popupWidth * 0.015}px`,
            fill: '#000',
            strokeThickness: 0.5,
            resolution: window.devicePixelRatio,
            wordWrap: { width: this.width*0.35, useAdvancedWrap: true } // Set word wrap width
        };

        //set key for background image for super PopupScene to set
        this.backgroundKey = 'yellow_wash_background';
        console.log(`background image key", ${this.backgroundKey}`);


        super.create(); //create the popup window
        const popupWidth = this.game.config.width / 2; //set popup window width
        const popupHeight = this.game.config.height / 2; //set popup window height

        const creditsData = this.cache.json.get('credits'); //get credits data cached during preload
        console.log("credits json: ", creditsData);

        //Format text to concatenate each credit object (role:name)
        let creditsText = '';
        //iterate through each category in the credits data and concatenate the names
        creditsData.forEach(categoryData => {
            creditsText += categoryData.category + ':\n\n';
            categoryData.name.forEach(name => {
                creditsText += '    ' + name + '\n';
            });
            creditsText += '\n'; // Add a blank line between categories
        });


        // Add specific content for the credit popup
        if (this.popupContainer) {
            this.add.text(this.popupX + this.popupWidth * 0.5, this.popupY + this.popupHeight*0.08, 'Credits', this.game.baseSceneGenericStyles.popupHeaderFontStyle)
            .setOrigin(0.5);
            // this.addContentToPopup(Math.min(popupWidth, popupHeight) * 0.2, Math.min(popupWidth, popupHeight) * 0.3, headerText, true); // Positioning text at 5% from the top-left corner
            // Create the multiline text object
            this.add.text(this.popupX + this.popupWidth * 0.03, this.popupY + this.popupHeight*0.1, creditsText, {...this.game.baseSceneGenericStyles.popupBodyFontStyle, fontSize: `${this.popupWidth * 0.015}px`, align: 'left'})
            .setOrigin(0);
        } else {
          console.error('Popup container is not initialized');
        }
    }
}
