import BaseScene from "./BaseScene";

class TraditionalActivitiesMenuScene extends BaseScene {
    constructor() {
        super({ key: 'TraditionalActivitiesMenuScene' });
    }

    preload() {
        super.preload();

    }

    
    create() {
        super.create(); //set up base scene's background and border

        console.log("TraditionalActivitiesMenuScene - create");
        this.dataManager = this.game.dataManager;
        const currentBiomeID = this.dataManager.getCurrentBiomeID();
        const userLang = this.game.playerDataManager.getUserLanguage(); // Assuming this method exists
        const activities = this.dataManager.getActivitiesForBiome(currentBiomeID);

        let yPosition = 100; // Starting y position for the text

        activities.forEach(activity => {
            const activityName = activity[`name${userLang}`];
            const isUnlocked = activity.activityUnlocked === "true";
            console.log("TraditionalActivitiesMenuScene - activity: ", activity, "isUnlocked: ", isUnlocked);
            const activityText = this.add.text(100, yPosition, activityName, {
                fontSize: '32px',
                fill: isUnlocked ? '#000000' : '#D3D3D3' // Green if unlocked, red if locked
            });

            if (isUnlocked) {
                activityText.setInteractive();
                activityText.on('pointerdown', () => {
                    this.startMinigame(activity);
                });
            }

            yPosition += 50; // Increment y position for the next activity
        });
    }


    startMinigame(activity) {
        console.log("start minigame: ", activity);
        this.game.sceneManager.changeScene('TraditionalActivityMinigameScene', {activity});
    }
}

export default TraditionalActivitiesMenuScene;