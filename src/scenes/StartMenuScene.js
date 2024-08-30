import BaseScene from './BaseScene';
console.log("BaseScene defined: ", BaseScene); // Check if BaseScene is defined

import LargeTextButton from '../utils/LargeTextButton';

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

        // /*Load Google fonts using WebFont Loader
        // currently using Noto Sans... would like to find a better font that works with APA
        // */
        // this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
        // WebFont.load({
        //   google: {
        //     families: ['Fira Sans',  'Radio Canada', 'Montserrat Alternates', 'Varta', 'Signika', 'Cabin', 'Maven Pro']
        //   }
        // });
    
    }

    /*
    Create Start menu header text and buttons (Start, Credits, Manual, Settings)
    */
    create() {
        super.create();
        console.log('StartMenuScene: create');

        // Calculate responsive font size
        const fontSize = `${Math.min(this.canvasWidth, this.canvasHeight) * 0.1}px`;
        // Check if the title text has already been created
        if (!this.titleText) {
            // Create title text
            // this.titleText = this.add.text(this.canvasWidth * 0.4, this.canvasHeight * 0.4, 'Sil̓ə’s Valley θe̓yqʷt', { fontSize: fontSize, fontFamily: 'Radio Canada, Arial, sans-serif', fill: '#000080', padding: { top: this.canvasWidth * 0.05, bottom: this.canvasWidth * 0.1 }, resolution:2, stroke: '#000080', strokeThickness: 2});
            // console.log(this.game.global, this.game.baseSceneGenericStyles);
            console.log(this.fontStyles.baseSceneGenericStyles);
            
            const titleTextString = 'Sil̓ə’s Valley θe̓yqʷt';

            this.titleText = this.add.text(this.canvasWidth * 0.4, this.canvasHeight * 0.4, titleTextString, this.fontStyles.baseSceneGenericStyles.headerFontStyle);
            // this.titleText = this.fontStyles.getCustomText(this.canvasWidth * 0.4, this.canvasHeight * 0.4, titleTextString, {...this.game.fontStyles.baseSceneGenericStyles.headerFontStyle, fontSize: fontSize});
            this.add.existing(this.titleText);
            // console.log(this.titleText.x, this.titleText.y);
        }

        this.titleTextCreated = false;


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
        // console.log('StartMenuScene: create ', text, ' button');
        // console.log('buttonX: ', x);
        // console.log('buttonY: ', y);

        // Create the settings button

        new LargeTextButton(this, x, y, text, () => {
            // console.log(text,' button clicked');

            //start or launch indicated scene
            // console.log("popup to launch: ", popupToLaunch);
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
            // console.log(text, ' button clicked');
            //start OpeningIntroductionScene scene when the button is clicked on. don't need to pass in 'reference' as it will be set by default in BaseScene
            this.titleText.destroy();
            this.titleText = null;

            this.game.sceneManager.changeScene('MainMapScene');
            // this.game.sceneManager.changeScene('OpeningIntroductionScene');
            // this.game.sceneManager.changeScene('VocabMinigamesMenuScene');
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

        // const gameWidth = this.sys.game.config.width;
        // const gameHeight = this.sys.game.config.height;
        // const canvasWidth = this.sys.game.canvas.width;
        // const canvasHeight = this.sys.game.canvas.height;
        // // Get Phaser resolution setting
        // const gameResolution = this.sys.game.config.resolution;
        // Get device pixel ratio
        // const devicePixelRatio = window.devicePixelRatio;
        // Calculate and set the game aspect ratio
        // const gameAspectRatio = gameWidth / gameHeight;
        const cameraWidth = this.cameras.main.width;
        const cameraHeight = this.cameras.main.height;

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const fontSize = `${Math.min(this.canvasWidth, this.canvasHeight) * 0.02}px`; // Adjust the multiplier as needed

        // Display DPI information on screen
        this.add.text(this.canvasWidth*0.05, this.canvasHeight*0.1, `Device Pixel Ratio: ${this.devicePixelRatio}`, { fontSize: fontSize, fill: '#000' });
        // this.add.text(10, 30, `Game Resolution: ${gameResolution}`, { fontSize: '16px', fill: '#000' });

        // Display actual browser dimensions
        this.add.text(this.canvasWidth*0.05, this.canvasHeight*0.15, `Browser Width: ${windowWidth}`, { fontSize: fontSize, fill: '#000' , resolution: 2});
        this.add.text(this.canvasWidth*0.05, this.canvasHeight*0.2, `Browser Height: ${windowHeight}`, { fontSize: fontSize, fill: '#000' , resolution: 2});
        this.add.text(this.canvasWidth*0.05, this.canvasHeight*0.25, `Browser Aspect Ratio: ${windowWidth / windowHeight}`, { fontSize: fontSize, fill: '#000' , resolution: 2});

        this.add.text(this.canvasWidth*0.05, this.canvasHeight*0.3, `Game Width: ${this.gameWidth}`, { fontSize: fontSize, fill: '#000' , resolution: 2});
        this.add.text(this.canvasWidth*0.05, this.canvasHeight*0.35, `Game Height: ${this.gameHeight}`, { fontSize: fontSize, fill: '#000' , resolution: 2});
        // Display canvas dimensions
        this.add.text(this.canvasWidth*0.05, this.canvasHeight*0.4, `Canvas Width: ${this.canvasWidth}`, { fontSize: fontSize, fill: '#000' , resolution: 2});
        this.add.text(this.canvasWidth*0.05, this.canvasHeight*0.45, `Canvas Height: ${this.canvasHeight}`, { fontSize: fontSize, fill: '#000' , resolution: 2});
    
        this.add.text(this.canvasWidth*0.05, this.canvasHeight*0.5, `Game resolution: ${this.gameResolution}`, { fontSize: fontSize, fill: '#000' , resolution: 2});

        this.add.text(this.canvasWidth*0.05, this.canvasHeight*0.55, `Camera width: ${cameraWidth}`, { fontSize: fontSize, fill: '#000' , resolution: 2});
        this.add.text(this.canvasWidth*0.05, this.canvasHeight*0.6, `Camera height: ${cameraHeight}`, { fontSize: fontSize, fill: '#000' , resolution: 2});
        }
}