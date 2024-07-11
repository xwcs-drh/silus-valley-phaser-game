import PopupScene from './PopupScene';
export default class CreditsPopupScene extends PopupScene {
    constructor(config) {
        super('CreditsPopupScene');
    }

    preload(){
        this.load.json('credits', './assets/data/JSONs/credits.json');
        this.load.image('yellow_wash_background', './assets/UI/yellow_wash_background.jpg'); // Load recipe book background image
    }

    create() {

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
        creditsData.forEach(categoryData => {
            creditsText += categoryData.category + ':\n';
            categoryData.name.forEach(name => {
                creditsText += '    ' + name + '\n';
            });
            creditsText += '\n'; // Add a blank line between categories
        });

        //style credits text
        const creditsTextStyle = {
            fontSize: '18px',
            fill: '#000',
            wordWrap: { width: 600, useAdvancedWrap: true }
        };

        // Add specific content for the manual popup
        if (this.popupContainer) {
            const headerText = this.add.text(50, 0, 'Credits', { fontSize: '24px', fill: '#000' });
            this.addContentToPopup(0.5, 0.005, headerText, true); // Positioning text at 5% from the top-left corner
            // Create the multiline text object
            this.add.text(100, 100, creditsText, creditsTextStyle);
        } else {
          console.error('Popup container is not initialized');
        }
    }
}
