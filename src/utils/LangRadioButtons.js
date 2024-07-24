
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


        // Define colors
        this.unselectedColor = 0x888888; // Gray
        this.selectedColor = 0xffffff; // same color as the button background image
        this.hoverColor = 0xff033e; // Slightly tinted from the button background image


        // Add the radio button background for lang1
        this.button1X = x;
        this.button2X = x + width*1.2;
        this.radioButton1 = this.createRadioButton(-width/4, height/2, this.lang1, () => this.selectLang1());
        this.add(this.radioButton1);

        // Add the radio button background for lang2
        this.radioButton2 = this.createRadioButton(width, height/2, this.lang2, () => this.selectLang2());
        this.add(this.radioButton2);

        this.selectedButton = null;
        // Add the container to the scene
        scene.add.existing(this);

        if(this.defaultLang === this.lang1){
        	this.selectLang1();
        } else{this.selectLang2();}// Select the first language by default
    	console.log(`default lang ${this.defaultLang}, lang1: ${this.lang1}, lang2: ${this.lang2}`)
    }

    createRadioButton(x, y, text, callback) {
        const radioButton = this.scene.add.container(x, y);

        const buttonBackground = this.scene.add.image(0, 0, this.buttonBackground).setOrigin(0.5);
        buttonBackground.setDisplaySize(this.width / 2, this.height);
        buttonBackground.setTint(this.unselectedColor);

        const buttonText = this.scene.add.text(0, 0, text, {
            fontFamily: 'Unbounded',
            fontSize: `${this.width*0.065}px`,
            fill: '#fff',
            strokeThickness: 0.5,
            resolution: window.devicePixelRatio
        }).setOrigin(0.5);

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

    selectLang1() {
        this.radioButton1.getAt(0).setTint(this.selectedColor); // Selected color
        this.radioButton2.getAt(0).setTint(this.unselectedColor); //Unselected color
        this.selectedButton = this.radioButton1;
        console.log(`lang1: ${this.lang1}`);
        this.callback(this.lang1);
    }

    selectLang2() {
        this.radioButton2.getAt(0).setTint(this.selectedColor); // Selected color
        this.radioButton1.getAt(0).setTint(this.unselectedColor); // Unselected color
        this.selectedButton = this.radioButton2;
        console.log(`lang1: ${this.lang2}`);
        this.callback(this.lang2);
    }
}

export default LangRadioButtons;