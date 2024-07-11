import Phaser from 'phaser';
import PopupScene from './PopupScene';

export default class SettingsPopupScene extends PopupScene {
    constructor() {
        super({ key: 'SettingsPopupScene' });
    }

    create() {
        super.create(); //create the popup window
        this.userSettingsManager = this.game.userSettingsManager;
        const userSettings = this.userSettingsManager.getSettings();

        // Create UI elements for each setting
        this.add.text(100, 100, 'Settings', { fontSize: '32px', fill: '#000' });

        // this.createToggleButton(100, 200, 'Audio Enabled', userSettingsManager.audioEnabled, value => {
        //     this.userSettingsManager.updateSettings({ audioEnabled: value });
        // });

        this.createToggleButton(100, 300, 'Show Dialogue', this.userSettingsManager.showDialogue, value => {
            this.userSettingsManager.updateSettings({ showDialogue: value });
        });

        this.createToggleButton(100, 400, 'Show Instructions', this.userSettingsManager.showInstructions, value => {
            this.userSettingsManager.updateSettings({ showInstructions: value });
        });

    }

    /*
    This will be used to change binary playerData settings, 
    eg:
        prefered user language, 
        if the user wants to see dialogue, 
        if the user wants audio enabled
    */
    createToggleButton(x, y, label, initialState, onChange) {
        const button = this.add.text(x, y, `${label}: ${initialState ? 'On' : 'Off'}`, { fontSize: '24px', fill: '#000' })
            .setInteractive()
            .on('pointerdown', () => {
                initialState = !initialState;
                button.setText(`${label}: ${initialState ? 'On' : 'Off'}`);
                onChange(initialState);
            });
    }
}