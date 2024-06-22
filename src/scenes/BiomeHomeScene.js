import BaseScene from './BaseScene';
// import BackButton from '../utils/BackButton';
// console.log("OpeningIntroductionScene defined: ", BaseScene); // Check if BaseScene is defined
import DialogueManager from '../managers/DialogueManager';
// console.log("OpeningIntroductionScene defined: ", DialogueManager); // Check if BaseScene is defined

export default class BiomeHomeScene extends BaseScene {
    constructor() {
        super('BiomeHomeScene');
        console.log("BiomeHomeScene: constructor called");
    }

    init(data) {
        this.allScenesData = data.allScenesData;
        console.log("BiomeHomeScene init reference: ", data.reference);
        this.reference = data.reference;
        console.log("BiomeHomeScene: init called with data: ", data); // Debugging output
        super.init(data);
        // this.dialogue = data.allDialogue
    }

    preload() {
        super.preload();
        console.log('BiomeHomeScene: preload');
    }

    create() {
        super.create(); //set up base scene's background and border
        this.scene.launch("MainUIScene", {data: this.allScenesData}); //launch MainUIScene to run in parallel... currently no elements appear, but it debug shows it to be launched
        
        // Accessing the scene's key 
        this.sceneKey = this.sys.settings.key;
        console.log('Scene key is:', this.sceneKey);

        //sets index to 0, start of scene dialogue
        //? should this go in dialogue manager?
        this.currentDialogueIndex = 0;

        //hides dialogue at start
        this.isDialogueBoxActive = false;

        this.createDialogueAssistant();
    }

    update(time, delta) {
        // game logic
    }

    createReturnButton(){
        console.log('BiomeHomeScene: createReturnButton');
        const buttonText = "<-";
        const buttonX = this.canvasWidth*0.2;
        const buttonY = this.canvasHeight*0.2;

        new BackButton(this, buttonX, buttonY, buttonText,() => {
            console.log(buttonText,' button clicked');

            //start or launch indicated scene
            this.scene.start('StartMenuScene', { allScenesData: this.allScenesData});
        });
    }

    /*DIALOGUE*/
    createDialogueAssistant(){
        const allDialogueData = this.registry.get('allDialogueData'); // Retrieve from registry
        console.log("All Dialogue Data: ", allDialogueData);
        this.dialogueManager = new DialogueManager(this, allDialogueData);
        this.dialogueManager.initDialogue();
        console.log("BiomeHomeScene: Dialogue Manager created: ", this.dialogueManager ? "true" : "false");
    }
}
