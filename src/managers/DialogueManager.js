class DialogueManager {
    /*
    This uses the dialogue data from Dialogue.json
    Contains the functionality to identify and run the dialogue for the current scene
    Contains additional functions, eg.
     - checking conditions for whether a line of dialogue should be displayed or not
     - progressing to the next line of dialogue
     - playing the corresponding audio (not implemented! potentially in the future)
     - highlighting objects in the scene
     - having an arrow point to objects in the scene
    */
    constructor(scene, allDialogueData) {
        this.scene = scene; //the scene using DialogueManager
        this.allDialogueData = allDialogueData; //all dialogueData that the current scene's dialogue will be found in
        this.dialogueData = []; //store relevant dialogue for the scene using the DialogueManager
    }

    initDialogue(){
        //make sure this works if there are 2 scenes running in parallel
        const sceneKey = this.scene.sys.settings.key; //get reference to scene that will be cross-referenced with scene_constructor_key in dialogue.json

        //declare variable for dialogue just for this scene
        // this.dialogueData = this.allDialogueData.find(dialogue => 
        //     dialogue.sceneConstructor_identifier === sceneKey)
        //     .dialogues;
        // this.currentLineIndex; //will be incremented as dialogue objects are run

        console.log("Scene key: ", sceneKey); // Debugging output

        //Console log to check this.allDialogueData is an array and not undefined
        this.checkSceneDialogueExists();
    }

    /*
    Function checks whether the json data has been properly cached and loaded into DialogueManager
    */
    checkDialogueExists(){
        // Ensure this.allDialogueData is an array and not undefined
        if (Array.isArray(this.allDialogueData)) {
            const dialogueEntry = this.allDialogueData.find(dialogue => 
                dialogue.sceneConstructor_identifier === sceneKey);
            if (dialogueEntry) {
                this.dialogueData = dialogueEntry.dialogues;
                console.log("Dialogue data found: ", this.dialogueData); // Debugging output
            } else {
                console.error("Dialogue entry not found for sceneKey: ", sceneKey);
            }
        } else {
            console.error("allDialogueData is not an array or is undefined");
        }
    }


    /*
    Begins to display dialogue
    */
    startDialogue(dialogueData) {
        this.dialogueData = dialogueData;
        this.currentEntryIndex = 0; //this exists in the scene that uses Dialogue Manager... maybe remove from there
        this.showNextEntry();
    }

    showNextEntry() {
        if (this.currentEntryIndex < this.dialogueData.length) {
            const entry = this.dialogueData[this.currentEntryIndex];
            if (this.checkConditions(entry.conditions)) {
                this.scene.showDialogueText(entry.text, () => {
                    this.processFunctionReferences(entry.function);
                    this.currentEntryIndex++;
                    this.showNextEntry();
                });
            } else {
                this.currentEntryIndex++;
                this.showNextEntry();
            }
        }
    }

    /*
    Checks any conditions for the current line of dialogue, returns bool
        cross-references (sceneDialogue[currentEntryIndex].conditions).. need to work out more
    */
    checkConditions(conditions) {
        // Check conditions to determine if the dialogue entry should be shown
        return true; // Example: Replace with actual condition checking
    }

    /*
    Execute any functions assocaiated with the line of dialogue
    */
    processFunctionReferences(functionRef) {
        if (functionRef && functionRef.functionReference) {
            functionRef.functionReference.forEach(ref => {
                const [funcName, param] = ref.split(',');
                if (this.scene[funcName]) {
                    this.scene[funcName](param);
                }
            });
        }
    }

    /*
    Create text associated with the line of dialogue (sceneDialogue[currentEntryIndex].conditions)
    shows textE or textH based on this.game.global.userLang... (hard set to "textE" in BootScene; will be in SettingsPopupScene)
        - Ternary not coded yet
    */
    showDialogueText(text, callback) {
        // Display the dialogue text and call callback when ready to proceed
        this.add.text(100, 100, text, { font: '16px Arial', fill: '#fff' }).setScrollFactor(0);
        this.input.once('pointerdown', callback);
    }

    /*
    Create the graphic container that the text will need to be displayed in.
    Not sure about the size or position of this yet... need to discuss with team
    */
    createDialogueBox(){
        //create dialogue box and set to active

        //add text to dialogue box
        this.dialogueText = this.add.text(100, 100, '', { font: '16px Arial', fill: '#ffffff' });

        this.updateDialogue();

        // Add an interactive area or button for progressing dialogue/
        // There will be 
        this.input.on('pointerdown', () => {
            if (this.isDialogueBoxActive) {
                this.progressDialogue();
            }
        });
    }

    /*
    Display next line of dialogue if there is one, and run any indicated corresponding functions
    Redundant?
    */
    updateDialogue(){
        if (this.currentDialogueIndex < this.sceneDialogue.length) { //if for redundance
            let currentDialogue = this.sceneDialogue[this.currentDialogueIndex];
            this.dialogueText.setText(currentDialogue.textE); // Assuming English text for now... change to global curr language from settings
            //do currentDialogue.functionReference
        }
    }

    /*
    Check for next line of dialogue and call if any
    */
    progressDialogue() {
        this.currentDialogueIndex++; // Move to the next dialogue entry
        if (this.currentDialogueIndex >= this.dialogueData.length) {
            this.isDialogueBoxActive = false; // No more dialogue to show
            console.log('End of conversation.'); //indicate end of dialogue in console statement
        } 
        else {
            this.updateDialogue();
        }
    }
}
export default DialogueManager; // Export a singleton instance: use shared inventory manager across the game
