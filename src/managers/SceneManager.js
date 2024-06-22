export default class SceneManager {
    /*
    Manages the changing between scenes, and passing of any necessary data
    !need to add navigation system to handle scene paths the user has taken, 
        to allow for better back button functionality
    Do I need sceneData to be a parameter here?
    */
    constructor(game, sceneData) {
        this.game = game;
        this.sceneData = sceneData;
    }

    //fetch data for specific scene
    getSceneData(newSceneKey, reference) {
        const allScenesData = this.game.global.allScenesData;
        let sceneData = allScenesData.find(scene => scene.constructor_identifier === newSceneKey);
        if (reference && !sceneData) {
            sceneData = allScenesData.find(scene => scene.reference_name === reference);
        }
        return sceneData;
    }

    //start new scene, based on scene key or reference name (specifically implemented for biomes)
    changeScene(newSceneKey, reference = null) {
        const sceneData = this.getSceneData(newSceneKey, reference);
        if (sceneData) {
            this.game.scene.start(sceneData.constructor_identifier, { allScenesData: this.game.global.allScenesData, reference: reference });
        } else {
            console.error(`Scene with reference name ${reference} not found.`);
        }
    }
}