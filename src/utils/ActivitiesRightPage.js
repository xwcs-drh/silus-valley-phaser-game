import Phaser from 'phaser';

//This is constructed from RecipeBookPopupScene
export default class ActivitiesRightPage extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, height, activity, userLanguage) {
        super(scene, x, y);
        this.scene = scene;
        this.width = width;
        this.height = height;
        this.activity = activity;
        this.userLanguage = userLanguage;

        //Style for paragraph text
        this.h3Style = this.textStyle = {
            fontFamily: 'Unbounded',
            fontSize: '14px',
            fill: '#000',
            strokeThickness: 0.5,
            resolution: window.devicePixelRatio,
            wordWrap: { width: this.width*0.35, useAdvancedWrap: true } // Set word wrap width
        };

        //Style for 2nd level header text
        this.h2Style = this.textStyle = {
            fontFamily: 'Unbounded',
            fontSize: '18px',
            fill: '#000',
            strokeThickness: 0.5,
            resolution: window.devicePixelRatio,
            wordWrap: { width: this.width*0.35, useAdvancedWrap: true } // Set word wrap width
        };

        //Style for title text
        this.h1Style = this.textStyle = {
            fontFamily: 'Unbounded',
            fontSize: '20px',
            fill: '#000',
            strokeThickness: 1,
            resolution: window.devicePixelRatio,
            wordWrap: { width: this.width*0.35, useAdvancedWrap: true } // Set word wrap width
        };
        this.scene.add.existing(this);
        this.initPage();

        // Listen for the languageUpdated event
        this.scene.game.playerDataManager.on('languageUpdated', this.updateLanguage, this);
    }

    initPage() {
        //create the text element for the activity description
        this.descriptionText = this.scene.add.text(this.x +this.width*0.18,this. y+ this.height * 0.1, "", this.h3Style);
        
        //create the text element for the activityinstructions 
        this.instructionsHeader = this.scene.add.text(this.x +this.width*0.18,this. y+ this.height * 0.25, 'Instructions', this.h2Style).setOrigin(0);
        this.instructions = []; 

        //Populate the object with the current activity passed into the constructor
        this.updatePage(this.activity); 
    }

/*
    Populate the object with the new activity
    Parameters:
        - activity (object): activities[currentActivityIndex] from this.game.global.dataManager.allActivityData;
    */
    updatePage(activity) {
        this.activity = activity; //set current activity to activity object passed in
        // console.log(activity.description);
        //set the text in the activity description element
        this.descriptionText.setText(activity.description);
        
        // Clear instructions of previous activity
        this.instructions.forEach(instruction => instruction.destroy()); ///???
        this.instructions = [];

        // Add new instructions
        this.addInstructions(this.activity);
    }

    updateLanguage(newLang) {
        console.log(`ActivitiesLeftPage: Language changed to ${newLang}`);
        this.userLanguage = newLang;
        this.updateText();
    }

    updateText() {
        // Update the text elements based on the new language
        this.descriptionText.setText(this.activity[`description${this.userLanguage}`]);
        this.instructionsHeader.setText(this.activity[`instructionsHeader${this.userLanguage}`]);
        this.addInstructions();
    }

    /*
    Print out array of strings from activity.instructions${userLanguage}
    */
    addInstructions(){
        //set position for first line of instruction
        let instructionY = this.instructionsHeader.y+this.height * 0.1;
        let instructionX = this.instructionsHeader.x;
        console.log(this.activity);
        // for each instruction string, add to instruction text and instruction array, and update y position for next line.
        this.activity.instructions.forEach(instruction => {
            const instructionText = this.scene.add.text(instructionX, instructionY, instruction[`text${this.userLanguage}`], this.h3Style);
            // this.add(instructionText);
            this.instructions.push(instructionText);
            instructionY += instructionText.height + 10;
        });
    }

    destroy() {
        // Clean up event listener
        this.scene.game.playerDataManager.off('languageUpdated', this.updateLanguage, this);
        super.destroy();
    }
}