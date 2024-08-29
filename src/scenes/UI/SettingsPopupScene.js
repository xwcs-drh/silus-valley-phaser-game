import Phaser from 'phaser';
import PopupScene from './PopupScene';
import LangRadioButtons from '../../utils/LangRadioButtons';

export default class SettingsPopupScene extends PopupScene {
    constructor() {
        super({ key: 'SettingsPopupScene' });
    }

    preload(){
        this.load.image('yellow_wash_background', './assets/UI/yellow_wash_background.jpg'); // Load recipe book background image
        this.load.image('blueButtonBackground', './assets/UI/blank_blue_button.jpeg');
    }

    create() {
        //set key for background image for super PopupScene to set
        this.backgroundKey = 'yellow_wash_background';
        console.log(`background image key", ${this.backgroundKey}`);

        super.create(); //create the popup window

        this.playerDataManager = this.game.playerDataManager;
        const userSettings = this.playerDataManager.getSettings();

        //Style for Setting header text
        this.h1Style = this.textStyle = {
            fontFamily: 'Unbounded',
            fontSize: `${this.popupWidth * 0.025}px`,
            fill: '#000',
            strokeThickness: 0.5,
            wordWrap: { width: this.width*0.35, useAdvancedWrap: true } // Set word wrap width
        };

        //Style for Setting label text
        this.h2Style = this.textStyle = {
            fontFamily: 'Unbounded',
            fontSize: `${this.popupWidth * 0.02}px`,
            fill: '#000',
            strokeThickness: 0.5,
            wordWrap: { width: this.width*0.35, useAdvancedWrap: true } // Set word wrap width
        };

        // Create UI elements for each setting
        this.add.text(this.popupX + this.popupWidth * 0.5, this.popupY + this.popupHeight*0.1, 'Settings', this.h1Style)
        .setOrigin(0.5);

        // this.createToggleButton(100, 200, 'Audio Enabled', userSettingsManager.audioEnabled, value => {
        //     this.userSettingsManager.updateSettings({ audioEnabled: value });
        // });
        this.add.text(this.popupX + this.popupWidth * 0.05, this.popupY + this.popupHeight*0.22, 'UI Language', this.h2Style);

        this.createLangRadioButtons(this.popupX + this.popupWidth * 0.5, this.popupY + this.popupHeight*0.2);

    }

    /*
    This will be used to change binary playerData settings, 
    eg:
        prefered user language, 
        if the user wants to see dialogue, 
        if the user wants audio enabled
    */
    createLangRadioButtons(x, y) {
        const lang1 = 'English';
        const lang2 = 'Hən͗q͗əmin͗əm͗';
        const defaultLang = this.playerDataManager.getUserLanguage() === "E" ? lang1 : lang2;
        const radioButtonPair = new LangRadioButtons(this, x, y, lang1, lang2, defaultLang, (language) => {
            this.updateUserLanguage(language);
        }, 'blueButtonBackground');

        this.add.existing(radioButtonPair);
    }

    updateUserLanguage(language) {
        if (language === 'English') {
            this.playerDataManager.updateUserLanguage('E');
        } else if (language === 'hən̓q̓əmin̓əm̓') {
            this.playerDataManager.updateUserLanguage('H');
        }
        console.log(`User language updated to: ${language}`);
        console.log(this.playerDataManager.getUserLanguage());
    }

}