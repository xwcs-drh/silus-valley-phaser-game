import BaseScene from './BaseScene';
import DialogueManager from '../managers/DialogueManager';
import LargeTextButton from '../utils/LargeTextButton';

export default class OpeningIntroductionScene extends BaseScene {
    /*
    This is the second scene the player will see
        runs when they click the "Start" button in the StartMenuScene
    MainUIScene will not run in parallel with this, to avoid cognitive overload for the player
        and to not mess with the display of popups or create redundant buttons
    */
    constructor() {
        super('OpeningIntroductionScene');
        // console.log("OpeningIntroductionScene: constructor called");
    }

    /*
    Prepare data and initializes in the extended scene (BaseScene)
        - all scene data... this probably isnt necessary to be passed in, since it's global??
        - all dialogue data... have to think about this
    */
    init(data) {
        // console.log("OpeningIntroductionScene: init called with data: ", data); // Debugging output
        // this.dialogue = data.allDialogue //may have to manage this differently??
        super.init(data); //?? initialize BaseScene with data passed into scene on start, in this case it only contains `allScenesData`.
    }

    //run BaseScene preload
    preload() {
        super.preload(); //run BaseScene preload()
        // console.log('OpeningIntroductionScene: preload');
    }

    /*
    Run create() in BaseScene
    Create variables for 
        - sceneKey (str)
        - currentDialogueIndex (number)... may move to dialogue manager
    Create a return button to go back to start scene (may modify to employ a navigation manager)
    Create dialogue assistant (dialogueManager)
    */
    create() {
        super.create(); //run BaseScene create()

        // Accessing the scene's key 
        this.sceneKey = this.sys.settings.key;
        // console.log('Scene key is:', this.sceneKey);

        //sets index to 0, start of scene dialogue
        //? should this go in dialogue manager?
        this.currentDialogueIndex = 0;

        //hides dialogue at start
        this.isDialogueBoxActive = false;

        //create button to take player to the Main Map scene
        this.createMapButton();

    }

    update(time, delta) {
        //potentially use for dialogue function... not sure yet
    }

    /*
    MAP button. 
    This will likely be different from the Map Button in MainUI, because it'll lead to a map SCENE, not trigger the biome buttons to appear. 
    Takes player to Map Scene when clicked.
    Should be initially set to not visible... will later be called by a dialogue instance
    */
    createMapButton(){
        console.log('OpeningIntroductionScene: createmapButton');
        //Create Map button => Starts MainMapScene

        this.mainMapButton = new LargeTextButton(this, this.gameWidth*0.5, this.gameHeight*0.8, "Map", () => {
            // console.log(text,' button clicked');
            this.arrowService.hideArrow();

            //start OpeningIntroductionScene scene when the button is clicked on. don't need to pass in 'reference' as it will be set by default in BaseScene
            this.scene.start('MainMapScene', { allScenesData: this.allScenesData});
        });
        this.mainMapButton.setVisible(false);
    }   

    /*
    Sets the Map button to visible 
        This is called by a dialogue instance
    */
    showMapButton(){
        this.mainMapButton.setVisible(true);
         
        //set arrow to point at the map button
        this.arrowService.pointAtObject(this.mainMapButton);
    }
    
}
