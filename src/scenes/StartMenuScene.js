import BaseScene from './BaseScene';
console.log("BaseScene defined: ", BaseScene); // Check if BaseScene is defined

import LargeTextButton from '../utils/LargeTextButton';
import WebFont from 'webfontloader';

export default class StartMenuScene extends BaseScene {
    /*
    This is the first scene the player will see
        runs right after all of the functions in BootScene are complete
    MainUIScene will not run in parallel with this, to avoid cognitive overload for the player
        and to not mess with the display of popups or create redundant buttons
    */
    constructor() {
        super('StartMenuScene');
        // console.log('StartMenuScene: constructor');
    }

    /*
    Prepare data and initializes in the extended scene (BaseScene)
        - all scene data... this probably isnt necessary to be passed in, since it's global??
        - reference: secondary identifier for the scene, for when the scene content loads dynamically
    */
    init(data) {
        // console.log("StartMenuScene: init called with data: ", data); // Debugging output
        //Set SceneData array object locally within this scene
        this.dialogue = data.allDialogue
        super.init(data);
    }

    /*
    Preload images for the start menu buttons
    Loads webfonts... 
    !   I may move this elsewhere to be more acessable to other scripts
    */
    preload() {
        super.preload();
        // console.log('StartMenuScene: preload');

        //preload main icon images... not used yet, currently using text.
        this.load.image('settingsIcon', './assets/UI/cog-icon.jpeg');
        this.load.image('manualIcon', './assets/UI/recipe-book.jpeg');

        this.load.image('blueButtonBackground', './assets/UI/blank_blue_button.jpeg');

        /*Load Google fonts using WebFont Loader
        currently using Noto Sans... would like to find a better font that works with APA
        */
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
        WebFont.load({
          google: {
            families: ['Oswald', 'Roboto Condensed', 'Unbounded', 'Ojuju', 'Andika', 'Noto Sans']
          },
          active: () => {
            this.create(); // Call create method once fonts are loaded
          }
        });
    }

    /*
    Create Start menu header text and buttons (Start, Credits, Manual, Settings)
    */
    create() {
        super.create();
        // console.log('StartMenuScene: create');
        
        // Calculate responsive font size
        const fontSize = Math.min(this.cameras.main.width, this.cameras.main.height) * 0.1;
        // this.add.text(this.cameras.main.width * 0.4, this.cameras.main.height * 0.4, "Sil̕ə's Valley", { fontSize: fontSize, fontFamily: 'Noto Sans', fill: '#000080' });
        // Check if the title text has already been created
        if (!this.titleTextCreated) {
            // Create title text
            this.add.text(this.cameras.main.width * 0.4, this.cameras.main.height * 0.4, "Sil̕ə's Valley", { fontSize: fontSize, fontFamily: 'Noto Sans', fill: '#000080' });
            // Set the flag to true
            this.titleTextCreated = true;
        }

        // this.titleTextCreated = false;


    	//Create Start button => Starts Opening Introduction Scene
        this.createStartButton(this.gameWidth*0.5, this.gameHeight*0.8, 'Start');

        //Create Credits button => launches CreditsPopupScene
        this.createMainButton(this.gameWidth*0.5, this.gameHeight*0.9, 'Credits', 'CreditsPopupScene');

        //Create Manual button => launches ManualPopupScene
        this.createMainButton(this.gameWidth*0.8, this.gameHeight*0.8, 'Manual', 'ManualPopupScene');

        //Create Settings button => launches SettingsPopupScene
        this.createMainButton(this.gameWidth*0.8, this.gameHeight*0.9, 'Settings', 'SettingsPopupScene');
        
        //uncomment to see screen resolution and dimensions
        // this.debugScreen();
    }

	/*
    Create main buttons aside from the Start buttons
    These buttons all trigger popup windows (launch scenes extending from PopupScene)
    Parameters
        - x (Number) = x position of center of button
        - y (Number) = y position of center of button
        - popupToLaunch (string) = name of the popup scene that should be launched on button click
    */
    createMainButton(x,y,text, popupToLaunch){
        console.log('StartMenuScene: create ', text, ' button');
        console.log('buttonX: ', x);
        console.log('buttonY: ', y);

        // Create the settings button
        new LargeTextButton(this, x, y, text, () => {
            console.log(text,' button clicked');

            //start or launch indicated scene
            console.log("popup to launch: ", popupToLaunch);
            this.game.sceneManager.showPopupScene(this.scene, popupToLaunch); //pass in scene to enable launching of another scene
        }, 
            this.canvasWidth * 0.21,
            this.canvasHeight * 0.085
        );

    }

    /*
    Create Start buttons
    Parameters
        - x (Number) = x position of center of button
        - y (Number) = y position of center of button
        - popupToLaunch (string) = name of the popup scene that should be launched on button click
    */
    createStartButton(x,y,text){
        // console.log('StartMenuScene: create ',text,' button');

        // Create the start button
        new LargeTextButton(this, x, y, text, () => {
            console.log(text, ' button clicked');
            //start OpeningIntroductionScene scene when the button is clicked on. don't need to pass in 'reference' as it will be set by default in BaseScene
            this.game.sceneManager.changeScene('MainMapScene');
        }, 
            this.canvasWidth * 0.21,
            this.canvasHeight * 0.085
        );

    }

    /*
    Display DPI and canvas dimensions
    Used for debugging
    */
    debugScreen() {
        // Display DPI information on screen
        this.add.text(10, 10, `Device Pixel Ratio: ${this.devicePixelRatio}`, { fontSize: '16px', fill: '#000' });
        this.add.text(10, 30, `Game Resolution: ${this.gameResolution}`, { fontSize: '16px', fill: '#000' });

        // Display canvas dimensions
        this.add.text(10, 50, `Canvas Width: ${this.canvasWidth}`, { fontSize: '16px', fill: '#000' });
        this.add.text(10, 70, `Canvas Height: ${this.canvasHeight}`, { fontSize: '16px', fill: '#000' });
    }
}