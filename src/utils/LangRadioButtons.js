import Phaser from 'phaser';

class LangRadioButtons extends Phaser.GameObjects.Container {
    constructor(scene, x, y, lang1, lang2, defaultLang, callback, backgroundKey, width = 220, height = 40) {
        super(scene, x, y);

        this.lang1 = lang1;
        this.lang2 = lang2;
        this.defaultLang = defaultLang;
        this.callback = callback;
        this.width = this.scene.sys.game.config.width*0.2;
        this.height = this.scene.sys.game.config.height*0.07;
        this.buttonBackground = backgroundKey;

        console.log('creating lang radio buttons');
        // Define colors
        this.unselectedColor = 0x888888; // Gray
        this.selectedColor = 0xffffff; // same color as the button background image
        this.hoverColor = 0xff033e; // Slightly tinted from the button background image

        // Add the radio button background for lang1
        this.button1X = x;
        this.button2X = x + this.width*1.2;
        this.radioButton1 = this.createRadioButton(-this.width/4, this.height/2, this.lang1, () => this.selectLang1());
        this.add(this.radioButton1);

        // Add the radio button background for lang2
        this.radioButton2 = this.createRadioButton(this.width/3, this.height/2, this.lang2, () => this.selectLang2());
        this.add(this.radioButton2);

        this.selectedButton = null;
        // Add the container to the scene
        scene.add.existing(this);

        // Set the appropriate button to interactive without changing the language
        this.setInitialSelectedButton();
        console.log(`default lang ${this.defaultLang}, lang1: ${this.lang1}, lang2: ${this.lang2}`)
    }

    /**
     * Function to create a radio button for the language selection
     * @param {*} x 
     * @param {*} y 
     * @param {*} text 
     * @param {*} callback 
     * @returns 
     */
    createRadioButton(x, y, text, callback) {
        const radioButton = this.scene.add.container(x, y);

        const buttonBackground = this.scene.add.image(0, 0, this.buttonBackground).setOrigin(0.5);
        buttonBackground.setDisplaySize(this.width / 2, this.height);
        buttonBackground.setTint(this.unselectedColor);
    

        const buttonFontSize = `${Math.min(buttonBackground.displayWidth, buttonBackground.displayHeight) * 0.4}px`
        const buttonText = this.scene.add.text(0, 0, text, {...this.scene.fontStyles.baseSceneGenericStyles.buttonFontStyle, fontSize: buttonFontSize, fill: '0xffffff'}).setOrigin(0.5);

        radioButton.add(buttonBackground);
        radioButton.add(buttonText);

        radioButton.setSize(this.width / 2, this.height);
        radioButton.setInteractive(new Phaser.Geom.Rectangle(0,0, this.width / 2, this.height), Phaser.Geom.Rectangle.Contains)
            .on('pointerdown', callback)
            .on('pointerover', () => {
                if (this.selectedButton !== radioButton) {
                    buttonBackground.setTint(this.hoverColor);
                }
            })
            .on('pointerout', () => {
                if (this.selectedButton !== radioButton) {
                    buttonBackground.setTint(this.unselectedColor);
                }
            });

        return radioButton;
    }

    /**
     * Function to set the initial selected button
     */
    setInitialSelectedButton() {
        if (this.defaultLang === this.lang1) {
            this.radioButton1.getAt(0).setTint(this.selectedColor); // Selected color
            this.selectedButton = this.radioButton1;
        } else {
            this.radioButton2.getAt(0).setTint(this.selectedColor); // Selected color
            this.selectedButton = this.radioButton2;
        }
    }

    /**
     * Function to attempt a language change
     * @param {*} selectedLang 
     */
    attemptLanguageChange(selectedLang) {
        const scene = this.scene.scene.get('TraditionalActivityMinigameScene');
        if (scene && scene.scene.isActive()) {
            // Show notification
            const notification = this.scene.add.text(
                this.scene.cameras.main.centerX,
                this.scene.cameras.main.centerY,
                'Language cannot be changed during a traditional activity.',
                {
                    fontFamily: 'Arial',
                    fontSize: '24px',
                    fill: '#ffffff',
                    backgroundColor: '#000000',
                    padding: { x: 20, y: 10 }
                }
            ).setOrigin(0.5);

            // Remove notification after 3 seconds
            this.scene.time.delayedCall(3000, () => {
                notification.destroy();
            });
        } else {
            // If not in TraditionalActivityMinigameScene, proceed with language change
            this.changeLanguage(selectedLang);
        }
    }

    /**
     * Function to change the language
     * @param {*} selectedLang 
     */
    changeLanguage(selectedLang) {
        if (selectedLang === this.lang1) {
            this.radioButton1.getAt(0).setTint(this.selectedColor); // Selected color
            this.radioButton2.getAt(0).setTint(this.unselectedColor); // Unselected color
            this.selectedButton = this.radioButton1;
            console.log(`lang1: ${this.lang1}`);
            this.callback(this.lang1);
        } else {
            this.radioButton2.getAt(0).setTint(this.selectedColor); // Selected color
            this.radioButton1.getAt(0).setTint(this.unselectedColor); // Unselected color
            this.selectedButton = this.radioButton2;
            console.log(`lang2: ${this.lang2}`);
            this.callback(this.lang2);
        }
    }

    /**
     * Function to select the language 1
     */
    selectLang1() {
        this.attemptLanguageChange(this.lang1);
    }

    /**
     * Function to select the language 2
     */
    selectLang2() {
        this.attemptLanguageChange(this.lang2);
    }

    /**
     * Function to disable language change
     */
    disableLanguageChange() {
        this.radioButton1.disableInteractive();
        this.radioButton2.disableInteractive();
    }

    /**
     * Function to enable language change
     */
    enableLanguageChange() {
        this.radioButton1.setInteractive();
        this.radioButton2.setInteractive();
    }
}

export default LangRadioButtons;