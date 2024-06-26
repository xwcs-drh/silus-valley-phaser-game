import DialogueBox from '../utils/DialogueBox';

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
        this.currentEntryIndex = 0;
    }

    initDialogue(){
        this.sceneKey = this.scene.sys.settings.key; //get reference to scene that will be cross-referenced with scene_constructor_key in dialogue.json
        console.log("Scene key: ", this.sceneKey); // Debugging output

        //Console log to check this.allDialogueData is an array and not undefined
        this.sceneDialogue = this.getSceneDialogueData();
    }

    /*
    Function returns the Dialogue for the scene (json data)
    */
    getSceneDialogueData(){
        // Ensure this.allDialogueData is an array and not undefined
        if (Array.isArray(this.allDialogueData)) {
            console.log(this.sceneKey);
            const dialogueEntry = this.allDialogueData.find(dialogue => 
                dialogue.sceneConstructor_identifier === this.sceneKey);
            if (dialogueEntry) {
                console.log("Dialogue Manager - Scene dialogue data found: ", dialogueEntry); // Debugging output
            } else {
                console.error("Dialogue Manager - Scene dialogue data notfound: ", this.sceneKey);
            }
            return dialogueEntry;
        } else {
            console.error("allDialogueData is not an array or is undefined");
            return null;
        }
    }

    create(){
        // Create the dialogue box if dialogue exists for the scene
        if(this.sceneDialogue != null){
            this.createDialogueBox();
        }
    }

    /*
    Create the graphic container that the text will need to be displayed in.
    Not sure about the size or position of this yet... need to discuss with team
    */
    createDialogueBox(){
        console.log("Dialogue Manager - created dialogue box");
        //create dialogue box and set to active

        //declare `processNextEntry()` function callback to be called by the button in 'dialogue box' 
        const boundCallback = this.processNextEntry.bind(this);
        
        //add text to dialogue box
        this.dialogueBox = new DialogueBox(this.scene, 400, 200, boundCallback);
        console.log(this.dialogueBox);
        // this.add(this.dialogueBox);

        // Change the text after 2 seconds
        this.scene.time.delayedCall(2000, () => {
            this.processNextEntry(); //trigger next line of dialogue + associated functions
        });
    }

    /*
    Return next line of dialogue or "no more lines"
    - "no more lines" will be replaced with something else after debugging
    */
    processNextEntry() {
        const entry = "no more text";
        // console.log("Dialogue Manager - Scene Dialogue at current entry index: ", this.sceneDialogue.dialogues[this.currentEntryIndex]);
        // console.log("Dialogue Manager - line should read: ", this.sceneDialogue.dialogues[this.currentEntryIndex].textE);
        // console.log("Dialogue Manager - scene dialogue length: ", this.sceneDialogue.dialogues.length);

        if (this.currentEntryIndex < this.sceneDialogue.dialogues.length) {
            // console.log('dialogue manager - passing length');
            const entry = this.sceneDialogue.dialogues[this.currentEntryIndex]; //current line of dialogue being shown

            if (this.checkConditions(entry.conditions)) {
                // console.log('dialogue manager - passing dialogue conditions');
                    this.showDialogueText(entry.textE);
                    this.currentEntryIndex++;  
                };
            //if the last line of dialogue, destroy 'next line' button
            if(this.currentEntryIndex === this.sceneDialogue.dialogues.length){
                console.log("destroy the next dialogue button");
                this.dialogueBox.destroyButton();

                //destroy dialogue box 4 seconds after last line of text is displayed... may change this
                this.scene.time.delayedCall(4000, () => {
                    console.log("destroy the dialogue box");
                    this.dialogueBox.destroyBox();
                    this.currentEntryIndex = 0; //reset index for next scene
                });
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
    showDialogueText(text) {
        console.log("set next text to: ", text);
        this.dialogueBox.setText(text);
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
}
export default DialogueManager; // Export a singleton instance: use shared inventory manager across the game
