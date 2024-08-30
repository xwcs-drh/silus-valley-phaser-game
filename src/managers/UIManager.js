export default class UIManager{
    constructor(game) {
        this.game = game;
        this.currentUISceneKey = null;
        this.uiScenes = {};
        // this.popupScenes = {};

        // Placeholder for SceneManager methods
        this.sceneManager = null;
    }

    setSceneManager(sceneManager) {
        this.sceneManager = sceneManager;
    }

    checkScenes() {
        const allScenes = this.game.scene.getScenes();
        console.log('All Scenes:', allScenes);

        const activeScenes = this.game.scene.getScenes(true);
        console.log('Active Scenes:', activeScenes);

        const inactiveScenes = this.game.scene.getScenes(false);
        console.log('Inactive Scenes:', inactiveScenes);
    }

    registerAndLaunchUIScenes(scenes) {
        console.log("UI Manager - scenes: ", scenes);
        for (const [key, sceneClass] of Object.entries(scenes)) {
            if (!this.uiScenes[key]) {
                this.uiScenes[key] = sceneClass;
                if (!this.isSceneLoaded(key)) {
                    console.log("UI Manager - adding key: ", key);
                    this.game.scene.add(key, sceneClass);
                }
            }
            this.sceneManager.launchUIScene(key);
            this.hideUIScene(key);
            console.log("UI Manager - is scene loaded: ", this.isSceneLoaded(key));
        // this.checkScenes();
        }
        console.log("UI Manager - completed register and launch");
        // this.checkScenes();
    }

    // Check if a scene is loaded
    isSceneLoaded(sceneKey) {
        return this.game.scene.getIndex(sceneKey) !== -1;
    }


    updateUI(scene, uiSceneName) {
        const uiSceneKey = sceneData.UIMenu; //get the name of the specified target UI menu to be run in parallel with game scene
        console.log("UIManager - ui scene key: ", uiSceneKey);

        if (uiSceneKey === "") { //if there's no specified target UI scene, ie empty string, loop through all uiScenes and hide them
            for (const key of Object.keys(this.uiScenes)) {
                // this.sceneManager.hideUIScene(key);
            }
            this.currentUISceneKey = null; //set currentui scene to none and end function
            return;
        }

        //if the current ui scene isn't empty, and doesn't match the specified target UI scene key
        if (this.currentUISceneKey !== uiSceneKey) {
            console.log(`UIManager - current UI scene key: ${this.currentUISceneKey} and intended ui scene key: ${uiSceneKey}`);
            if (this.currentUISceneKey) { //and , and there is a current ui scene key (check is for debugging purposes), hide the current ui scene
                // this.sceneManager.hideUIScene(this.currentUISceneKey);
            }
            this.sceneManager.launchUIScene(scene, uiSceneKey); //launch the specified target scene key
            this.currentUISceneKey = uiSceneKey; //set the specified target ui scene key to current ui scene key 
        }
    }

    showUIScene()sceneKey){

    }

    hideUIScene(sceneKey) {
        this.sceneManager.hideUIScene(sceneKey);
    }

    showPopupScene(popupSceneKey) {
        if (!this.sceneManager.isSceneLoaded(popupSceneKey)) {
            this.sceneManager.launchPopupScene(popupSceneKey);
            console.log("popup scene not loaded");
        } else {
            this.sceneManager.setPopupSceneVisible(popupSceneKey, true);
            console.log("setting popup scene visible");
        }
    }

    hidePopupScene(sceneKey) {
        this.sceneManager.setPopupSceneVisible(sceneKey, false);
    }
}