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

        this.titleFont = {...this.scene.fontStyles.recipeBookStyles.recipeHeader1Style, fontSize: `${this.width * 0.015}px`, wordWrap: { width: this.width*0.35, useAdvancedWrap: true }};
       
        this.instructionsFont = {...this.scene.fontStyles.recipeBookStyles.recipeHeader2Style, wordWrap: { width: this.width*0.35, useAdvancedWrap: true }};
        console.log("font size first: ",this.instructionsFont.fontSize);

        this.scene.add.existing(this);
        this.initPage();

        // Listen for the languageUpdated event
        this.scene.game.playerDataManager.on('languageUpdated', this.updateLanguage, this);
    }

    initPage() {
        //create the text element for the activity description
        // this.descriptionText = this.scene.add.text(this.x +this.width*0.18,this. y+ this.height * 0.1, "", this.h3Style);
        
        //create the text element for the activityinstructions 
        this.instructionsHeader = this.scene.add.text(this.x +this.width*0.16,this. y+ this.height * 0.09, 'Instructions', this.titleFont).setOrigin(0);
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
        // this.descriptionText.setText(activity.description);
        
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
        // this.descriptionText.setText(this.activity[`description${this.userLanguage}`]);
        this.instructionsHeader.setText(this.activity[`instructionsHeader${this.userLanguage}`]);
        this.addInstructions();
    }

    /*
    Print out array of strings from activity.instructions${userLanguage}
    */
    addInstructions(){

         // Calculate the font size based on the number of instructions and available height
         const maxLines = this.activity.instructions.length;
         const availableHeight = this.height * 0.8; // Adjust as needed
         const fontSize = Math.min(this.width * 0.013, availableHeight / maxLines);
 
        this.instructionsFont = {
             ...this.scene.fontStyles.recipeBookStyles.recipeHeader2Style,
             fontSize: `${fontSize}px`,
             wordWrap: { width: this.width * 0.35, useAdvancedWrap: true }
        };
        console.log("font size second: ",this.instructionsFont.fontSize);

        //set position for first line of instruction
        let instructionY = this.instructionsHeader.y+this.height*0.05;
        let instructionX = this.instructionsHeader.x;
        console.log(this.activity);
        // for each instruction string, add to instruction text and instruction array, and update y position for next line.
        this.activity.instructions.forEach(instruction => {
            const instructionText = this.scene.add.text(instructionX, instructionY, instruction[`text${this.userLanguage}`], this.instructionsFont);
            // this.add(instructionText);
            this.instructions.push(instructionText);
            instructionY += instructionText.height*0.4;
        });
    }

    destroy() {
        // Clean up event listener
        this.scene.game.playerDataManager.off('languageUpdated', this.updateLanguage, this);
        super.destroy();
    }
}