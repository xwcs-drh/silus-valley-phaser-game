export default class SceneManager {
    constructor(scene, game, dataManager) {
        this.scene = scene;
        this.game = game;
        this.dataManager = dataManager; // Use DataManager to access global data
        this.sceneHistory = []; // Initialize the scene history stack
        this.currentSceneData = null;
        this.currentUISceneKey = "";
        this.currentScene = this.scene;
        this.uiScenes = {};
        this.popupScenes = {};
        this.currentPopupSceneKey = "";
        this.popupSceneHistory = [];
        this.currentUIScene = null;
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
        // console.log("Scene Manager - scenes: ", scenes);
        for (const [key, sceneClass] of Object.entries(scenes)) {
            if (!this.uiScenes[key]) {
                key.includes("Popup")? this.popupScenes[key] = sceneClass : this.uiScenes[key] = sceneClass;
                if (!this.isSceneLoaded(key)) {
                    // console.log("UI Manager - adding key: ", key);
                    this.game.scene.add(key, sceneClass);
                }
            }
        }
        // console.log("ui scenes: ", this.uiScenes);
        // console.log("popup scenes: ", this.popupScenes);
    }

    // Check if a scene is loaded
    isSceneLoaded(sceneKey) {
        const index = this.game.scene.getIndex(sceneKey);
        // console.log(`SceneManager: Checking if scene ${sceneKey} is loaded: ${index !== -1}`);
        return index !== -1;
    }

    // Start new scene, based on scene key or reference name (specifically implemented for biomes)
    changeScene(newSceneKey, reference = null) {

        let sceneData = this.getSceneData(newSceneKey, reference);
        if (!sceneData) {
            sceneData = this.uiManager.uiScenes[newSceneKey];
        }
        // console.log("scene manager - scene data at change scene: ", sceneData);

        if (sceneData) {
            const currentSceneKey = this.currentSceneData.constructor_identifier;
            // console.log("SceneManager: Stopping current scene:", this.currentScene);
            // console.log(`SceneManager: Stopping current scene key: ${this.currentSceneData.constructor_identifier}`);

            this.currentReference = reference;
            this.sceneHistory.push({ sceneKey: currentSceneKey, reference: this.currentReference });

            this.game.scene.stop(currentSceneKey);
            this.game.scene.start(newSceneKey, { reference: reference });
            this.currentScene = this.game.scene.getScene(newSceneKey);
            // this.checkScenes();
            // console.log(`SceneManager: Started new scene: ${newSceneKey}`);
        } else {
            console.error(`Scene with reference name ${reference} or key ${newSceneKey} not found.`);
        }
        this.hideAllPopupScenes("");
    }

    // Fetch data for a specific scene
    getSceneData(newSceneKey, reference) {
        const allScenesData = this.dataManager.getAllScenesData();
        let sceneData = allScenesData.find(scene => scene.constructor_identifier === newSceneKey);
        if (reference && !sceneData) {
            sceneData = allScenesData.find(scene => scene.reference_name === reference);
        }
        this.currentSceneData = sceneData;
        return sceneData;
    }

    // Set the current scene data for the upcoming scene
    // setCurrentSceneData(sceneData) {
    //     this.currentSceneData = sceneData;
    //     // console.log("set current scene data", this.currentSceneData);
    // }

    updateUIScene(scene, uiSceneKey) {
        // const uiSceneKey = sceneData.UIMenu; //get the name of the specified target UI menu to be run in parallel with game scene
        // console.log("UIManager - ui scene key: ", uiSceneKey);
        this.hideAllUIScenes(scene, uiSceneKey);

        //if the current ui scene isn't empty, and doesn't match the specified target UI scene key
        if (this.currentUISceneKey !== uiSceneKey && uiSceneKey !== "") {
            // console.log(`UIManager - current UI scene key: ${this.currentUISceneKey} and intended ui scene key: ${uiSceneKey}`);
            this.showUIScene(scene, uiSceneKey); //launch the specified target scene key
        }

        else if (this.currentUIScene && this.currentUISceneKey === uiSceneKey){
            // console.log("current ui scene", this.currentUIScene);
            this.currentUIScene.setScene(this.currentUIScene); //set the specified target ui scene key to current ui scene key 
        }

    }

    showUIScene(scene, uiSceneKey) {
        const sceneInstance = this.game.scene.getScene(uiSceneKey);
        // console.log("show ui scene", sceneInstance);

        if (sceneInstance && sceneInstance.scene.isActive()) {
            // console.log(`SceneManager: hiding scene key: ${uiSceneKey}`);
            sceneInstance.scene.setVisible(true);
            // sceneInstance.scene.pause();
            this.checkScenes();
            return;
        }
        if (sceneInstance && !sceneInstance.scene.isActive()) {
            // console.log(`SceneManager: hiding scene key: ${uiSceneKey}`);
            scene.launch(uiSceneKey);
            sceneInstance.scene.setVisible(true);
            // sceneInstance.scene.pause();
            this.checkScenes();
            return;
        }
        this.currentUIScene = sceneInstance;
    }

    hideUIScene(scene, uiSceneKey) {
        const sceneInstance = this.game.scene.getScene(uiSceneKey);
        if (sceneInstance && sceneInstance.scene.isActive()) {
            // console.log(`SceneManager: hiding scene key: ${uiSceneKey}`);
            sceneInstance.scene.setVisible(false);
            sceneInstance.scene.pause();
        }
    }

    hideAllUIScenes(scene, exceptScene){
        for (const key of Object.keys(this.uiScenes)) {
            if(key != exceptScene){
                this.hideUIScene(scene, key);
            }
        }
    }

    getCurrentSceneData(){
        return this.currentSceneData;
    }

    getSceneBackground() {
        return this.currentSceneData ? this.currentSceneData.background_image : null;
    }

    getSceneUIName() {
        return this.currentSceneData ? this.currentSceneData.UIMenu : null;
    }

    getSceneReference(){
        return this.currentSceneData.reference_name;
    }

    showPopupScene(scene, popupSceneKey) {
        // console.log("show popup scene", scene);
        // console.log("popup scene key", popupSceneKey);
        const sceneInstance = this.game.scene.getScene(popupSceneKey);

        // console.log("show popup scene", sceneInstance);

        if (sceneInstance && sceneInstance.scene.isActive()) {
            // console.log(`SceneManager: settings popup visible: ${popupSceneKey}`);
            sceneInstance.scene.setVisible(true);
            // this.checkScenes();
            return;
        }

        if (sceneInstance && !sceneInstance.scene.isActive()) {
            // console.log(`SceneManager: launching popup scene: ${popupSceneKey}`);
            scene.launch(popupSceneKey);
            // console.log(`SceneManager: launch popup: ${popupSceneKey}`);
            sceneInstance.scene.setVisible(true);
            // this.checkScenes();
            return;
        }
    }

    hidePopupScene(scene, popupSceneKey) {
        const sceneInstance = this.game.scene.getScene(popupSceneKey);

        if (sceneInstance && sceneInstance.scene.isActive()) {
            // console.log(`SceneManager: hiding scene key: ${uiSceneKey}`);
            sceneInstance.scene.setVisible(false);
            this.popupSceneHistory.pop(popupSceneKey);
        }
    }

    hideAllPopupScenes(scene, exceptScene){
        for (const key of Object.keys(this.popupScenes)) {
            if(key != exceptScene){
                this.hideUIScene(scene, key);
            }
        }
    }

    // Go back to the previous scene
    goBack() {
        if (this.sceneHistory.length > 0) {
            const previousScene = this.sceneHistory.pop();
            // console.log(`SceneManager: Returning to previous scene: ${previousScene.sceneKey} with reference: ${previousScene.reference}`);

            this.currentReference = previousScene.reference;

            this.game.scene.stop(this.game.scene.keys[0]);
            this.game.scene.start(previousScene.sceneKey, { reference: previousScene.reference });
        } 
        else {
            // console.error('SceneManager: No previous scene to return to.');
        }
    }
}