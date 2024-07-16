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
    constructor(game, dataManager) {
        this.game = game;
        this.dataManager = dataManager;
        this.allDialogueData = this.game.dataManager.getAllDialogueData(); //all dialogueData that the current scene's dialogue will be found in
        this.currentDialogueData = []; //store relevant dialogue for the scene using the DialogueManager
        this.currentEntryIndex = 0;

        this.game.playerDataManager.on('languageUpdated', this.updateLanguage, this);

    }

    create(){
    }
    /*
    Call function to declare dialogue for the current scene
    Call function to create the dialogue box container
    Call function to begin displaying the dialogue and running associated functions

    Parameters
        - scene (scene): game scene that the dialogue box will be added to, and the functions will be associated with
        - sceneReference (string): aka. `scene.reference_name` to compare with `dialogue.scene_reference_name`
    */
    startSceneDialogue(scene, sceneReference){
        this.setSceneDialogueData(sceneReference);
        // console.log("dialogue manager: scene dialogue data:", this.currentDialogueData);
        if(this.currentDialogueData){
            // console.log("dialogue manager:", this.currentDialogueData);
            this.createDialogueBox(scene);
            this.processNextEntry(scene);
        }
    }

    /*
    Function sets the Dialogue for the scene (json data)
     Parameters
        - sceneReference (string): aka. `scene.reference_name` to compare with `dialogue.scene_reference_name`
    */
    setSceneDialogueData(sceneReference){
        // Ensure this.allDialogueData is an array and not undefined
        // console.log(typeof this.allDialogueData);
        if (Array.isArray(this.allDialogueData)) {
            //console.log(`Dialogue Manager - scene key: ${this.sceneKey} ; reference: ${this.sceneReference}`);
            const sceneDialogue = this.allDialogueData.find(dialogue => 
                dialogue.scene_reference_name === sceneReference);
            if (sceneDialogue) {
                // console.log("Dialogue Manager - Scene dialogue data found: ", sceneDialogue); // Debugging output
            } else {
                // console.error(`Dialogue Manager - Scene dialogue data notfound for scene: ${this.sceneKey} ; reference: ${this.sceneReference}`);
            }

            this.currentDialogueData = sceneDialogue;
            this.currentEntryIndex = 0;
        } else {
            // console.error("allDialogueData is not an array or is undefined");
            this.currentDialogueData = null;
        }
    }

    /*
    Returns value of the current line of dialogue in the current scene's dialogue display
    */
    getCurrentEntryIndex(){
        return this.currentEntryIndex;
    }

    /*
    Create the graphic container that the text will be displayed in.
    Set the depth to 102 (above game scene elements but below UI and service elements)
    */
    createDialogueBox(scene){
        //declare `processNextEntry()` function callback to be called by the button in 'dialogue box' 
        const boundCallback = this.processNextEntry.bind(this);
        
        //add text to dialogue box
        this.dialogueBox = new DialogueBox(scene, 400, 200, boundCallback);
        this.dialogueBox.setDepth(102);
    }

    /*
    Displays the next line of text if passes conditions associated with the dialogue line object.
    Processes any functions associated with the dialogue line object based on sequence.

    Return next line of dialogue or "no more text" if the last line of dialogue
    - "no more lines" will be replaced with something else after debugging
    */
    processNextEntry(scene) {
        const entry = "no more text";
        // console.log("Dialogue Manager - Scene Dialogue at current entry index: ", this.currentDialogueData.dialogues[this.currentEntryIndex]);
        // console.log("Dialogue Manager - line should read: ", this.currentDialogueData.dialogues[this.currentEntryIndex].textE);
        // console.log("Dialogue Manager - scene dialogue length: ", this.currentDialogueData.dialogues.length);
        // console.log(` current index: ${this.currentEntryIndex}, dialogue length ${ this.currentDialogueData.dialogues.length}`);
        if (this.currentEntryIndex < this.currentDialogueData.dialogues.length) {
            // console.log('dialogue manager - passing length');
            const entry = this.currentDialogueData.dialogues[this.currentEntryIndex]; //current line of dialogue being shown
            // console.log("Dialogue Manager - entry: ", entry);

            if (this.checkConditions(entry.conditions)){
                // console.log('dialogue manager - passing dialogue conditions');

                // Execute "during" functions
                this.executeFunctions(scene, entry.functions, 'during');

                this.showDialogueText(entry);
                
                scene.time.delayedCall(2000, () => {
                    // Execute "after" functions with 2 second delay
                    this.executeFunctions(scene, entry.functions, 'after');
                });

                this.currentEntryIndex++;

            };

            //if the last line of dialogue, destroy 'next line' button
            if(this.currentEntryIndex === this.currentDialogueData.dialogues.length){
                // console.log("destroy the next dialogue button");
                this.dialogueBox.destroyButton();

                //destroy dialogue box 4 seconds after last line of text is displayed... may change this
                scene.time.delayedCall(6000, () => {
                    //console.log("destroy the dialogue box");
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
    Paramaters:
        - function (array[function object]): 
            [{
              "sequence": "after",
              "functionReference": "showMapButton",
              "args": [""]
            }]
        - sequence (string): sequence status to run. ie. run all functions identified as "before"
    */
    executeFunctions(scene, functions, sequence) {
        if (functions) {
          functions.forEach(func => {
            if (func.sequence === sequence) {
                const resolvedArgs = func.args.map(arg => this.resolveArgument(scene, arg));
                this.executeFunctionByName(scene, func.functionReference, ...resolvedArgs);            }
          });
        }
    }

    /*
    Returns value of argument by adding "this.scene..." to argument value if necessary
    */
    resolveArgument(scene, arg) {
        // console.log(arg);
        if (typeof arg === 'string') {
            //console.log(this.scene[arg]);
            const gameObject = scene.children.getByName(arg);
            // console.log(gameObject);
            if(gameObject){
                // console.log(typeof arg);
                return gameObject;
            }
        }
        // console.log(typeof arg);
        return arg;
    }

    resolveArgument(scene, arg) {
        if (typeof arg === 'string') {
            const gameObject = scene.children.getByName(arg);
            if (gameObject) {
                return gameObject;
            }
        }
        return arg;
    }

    /*
    Executes a function based on its name and arguments
    Paramaters:
        - function name (string): name of the function being called, and potentially an associated object
            assumes the function exists in the scene in which the dialoguemanager instance was created, or an imported object.
            e.g. highlightService.highlight; showMapButton
        - arguments (various): any arguments required by the function to be executed
    */
    executeFunctionByName(scene, functionName, ...args) {
        //split functionName into object and function. 
            //Object would be a service like HighlightService or ArrowService.   
        const [object, func] = functionName.split('.');
        //console.log(`object is ${object} and function is ${func}(${args})`);
        //if there's an object and function indicated, execute the function associated with that object as imported into the scene passed into DialogueManager.
        if (func && scene[object] && typeof scene[object][func] === 'function') {
          return scene[object][func](...args);
        } 

        //if there isn't an object and function indicated, execute the function associated with the scene passed into the DialogueManager.
        else if (typeof scene[functionName] === 'function') {
          return scene[functionName](...args);
        } 

        //throw error if functionName cannot be located
        else {
          throw new Error(`Function ${functionName} does not exist in the scene or services`);
        }
    }

    /*
    Update the language of the dialogue text
    */
    updateLanguage(newLang) {
        // console.log(`DialogueManager: Language changed to ${newLang}`); //outputs properly
        // Update the displayed text based on the new language
        // console.log("entry" ,this.currentDialogueData.dialogues[this.currentEntryIndex]);
        
        if (this.currentDialogueData.dialogues.length > 0) {
            // console.log("DialogueManager: Updating dialogue text via listener");
            this.showDialogueText(this.currentDialogueData.dialogues[this.currentEntryIndex]); //this function doesnt run
        }
    }
    
    /*
    Create text associated with the line of dialogue (sceneDialogue[currentEntryIndex].conditions)
    Shows textE or textH based on this.game.playerData.settings.language. (player will be able to edit language in SettingsPopupScene)
    */
    showDialogueText(entry) {
        this.userLanguage = this.game.playerDataManager.getUserLanguage();

        // console.log(this.userLanguage);
        const dialogueTextKey = `text${this.userLanguage}`;
        // console.log(entry);
        if (this.dialogueBox) {
            // console.log("Set next text to: ", entry[dialogueTextKey]);
            this.dialogueBox.setText(entry[dialogueTextKey]);
        } 
    }
}
export default DialogueManager; // Export a singleton instance: use shared inventory manager across the game
