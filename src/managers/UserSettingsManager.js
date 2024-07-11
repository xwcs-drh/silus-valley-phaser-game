export default class UserSettingsManager {
    /*
    PlayerData file will be handled in this manager class.
    Specifically accessing and saving user settings and progress data
    */
    constructor() {
        this.playerDataManager = null;
        this.userSettings = null;
    }

    /*
    Returns playerData as stored in PlayerData.json
    */
    getSettings() {
        return this.userSettings;
    }

    /*
    Updates variables in playerDataManager
    */
    updateSettings(newSettings) {
        this.userSettings = { ...this.userSettings, ...newSettings };
        this.playerDataManager.setUserSettings(this.userSettings);
        this.saveSettings();
    }

    /*
    Writes new settings to PlayerData.json as stored in playerDataManager
    */
    saveSettings() {
        localStorage.setItem('userSettings', JSON.stringify(this.userSettings));
    }

    /*
    Read in json data cached in bootscene (change to local storage)
    */
    loadSettings(playerDataManager) {
        this.playerDataManager = playerDataManager;
        console.log("User Settings Manager - playerDataManager: ", this.playerDataManager);

        this.userSettings = this.playerDataManager.getSettings();

        // const settings = localStorage.getItem('userSettings');
        // if (settings) {
        //     this.userSettings = JSON.parse(settings);
        //     this.playerDataManager.setUserSettings(this.userSettings);
        // }
        console.log("User Settings Manager - user settings: ", this.userSettings);
        console.log("User Settings Manager - playerDataManager: ", this.playerDataManager);

    }
}