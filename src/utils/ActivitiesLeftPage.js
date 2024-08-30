import Phaser from 'phaser';
import ResourceCard from './ResourceCard';
//This is constructed from RecipeBookPopupScene
export default class ActivitiesLeftPage extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, height, activity, userLanguage, inventory, dataManager) {
        super(scene, x, y);
        this.scene = scene;
        this.width = width;
        this.height = height;
        this.activity = activity;
        
        this.userLanguage = this.scene.game.playerDataManager.getUserLanguage();
        this.inventory = inventory; 
        this.dataManager = dataManager;
        this.resources = this.dataManager.getAllResources();

        this.h1Style = {...this.scene.recipeBookStyles.recipeHeader1Style, fontSize: `${this.width * 0.02}px`, wordWrap: { width: this.width*0.35, useAdvancedWrap: true }};
       
        this.h2Style = {...this.scene.recipeBookStyles.recipeHeader2Style, fontSize: `${this.width * 0.012}px`, wordWrap: { width: this.width*0.35, useAdvancedWrap: true }};

        this.h3Style = {...this.scene.recipeBookStyles.recipeHeader3Style, fontSize: `${this.width * 0.012}px`, wordWrap: { width: this.width*0.35, useAdvancedWrap: true }};
    

        //add the ActivitiesLeftPage object to the RecipeBookPopupScene
        this.scene.add.existing(this);
        this.initPage();

        // Listen for the languageUpdated event
        this.scene.game.playerDataManager.on('languageUpdated', this.updateLanguage, this);
    }

    initPage() {
        // Create the name text
        this.nameText = this.scene.add.text(this.x + this.width * 0.4, this.y+ this.height * 0.18, '', this.scene.fontStyles.recipeBookStyles.recipeHeader1Style).setOrigin(1);
        // Create the biome text
        this.biomeText = this.scene.add.text(this.x + this.width * 0.08,this. y+ this.height * 0.4, '', this.scene.fontStyles.recipeBookStyles.recipeHeader3Style).setOrigin(0);

        //create the thumbnail image for the activity
        this.thumbnail = this.scene.add.image(this.x*1.2, this.height * 0.15, this.activity.thumbnailFilename)
            .setOrigin(0.5)
            .setDisplaySize(this.width * 0.22, this.height * 0.22);

        // add the thumbnail to the ActivitiesLeftPage object
        this.add(this.thumbnail);

        //Populate the object with the current activity passed into the constructor
        this.updatePage(this.activity);
    }

    /*
    Populate the object with the new activity
    Parameters:
        - activity (object): activities[currentActivityIndex] from this.game.global.dataManager.allActivityData;
    */
    updatePage(activity){
        this.activity = activity; //set current activity to activity object passed in
        const name = this.activity[`name${this.userLanguage}`]; //set name variable to correspond to the user's selected language  for the activity passed in
        const biome = this.dataManager.getBiomeFromID(this.activity.biome)[`name${this.userLanguage}`]; //set name variable to correspond to the user's selected language for the activity passed in
        // console.log(biome);
        console.log(`Activities Left Page : ${this.activity.thumbnailFilename}`);
        
        this.updateThumbnail(this.activity.thumbnailFilename); 
        this.nameText.setText(name); //set the nameText element to correspond to the name string
        this.biomeText.setText(`Available in the ${biome} biome.`); //set the biomeText element to correspond to the biome string

        // Clear existing resource cards
        this.clearResourceCards();

        this.addRequiredResources(); //populate with the resourceCards indicated to be required for the activity passed in
        this.addAwardedResources(); //populate with the resourceCards indicated to be awarded by the activity passed in
    }

    /*
    Clear all resource cards from the scene
    Parameters: None
    */
    clearResourceCards() {
        // Filter out resource cards and destroy them
        this.list = this.list.filter(child => {
            if (child instanceof ResourceCard) {
                child.destroy();
                return false; // Remove from the list
            }
            return true; // Keep in the list
        });
    }

    // Function to update the thumbnail image
    updateThumbnail(newImageKey) {
        this.thumbnail.setTexture(newImageKey)
        .setOrigin(0.5)
        .setDisplaySize(this.width * 0.22, this.height * 0.22);
            
    }

    /*
    Loop to create `resourceCard`s for the resources required for the current activity
    Parameters: None
    */
    addRequiredResources() {
        const requiredResourcesHeader = this.scene.add.text(this.x + this.width * 0.08, this.y + this.height * 0.45, 'Resources Required', this.scene.fontStyles.recipeBookStyles.recipeHeader2Style);
        // this.add(requiredResourcesHeader);

        const requiredResources = this.activity.requiredResources; //get object of key:value pairs (resourceID:quantity) of resources required for the activity
        if (requiredResources && typeof requiredResources === 'object') {
            console.log(requiredResources);
            // Add resource cards for required resources
            var yPos = this.height * 0.21; //set y position for the resource cards
            // console.log(yPos);
            var xPos = this.x*0.15; //set x position for the first resource card
            for (const [resourceKey, quantity] of Object.entries(requiredResources)) { //loop through key-pair values of resources required for the activity
                // console.log(this.dataManager.getResource(resourceKey));
                const resource = this.dataManager.getResource(resourceKey)
                const resourceCard = new ResourceCard(this.scene, xPos, yPos,this.width * 0.1, this.height * 0.1, resource, quantity); //construct resourceCard
                this.add(resourceCard);//add resourceCard to the scene.
                // yPos += this.height * 0.21; 
                xPos += this.width * 0.055;  //update x value for next resource card
            }
        } else {
            console.error('requiredResources is not an object:', requiredResources);
        }
    }

    /*
    Loop to create `resourceCard`s for the resources awarded by the current activity
    Parameters: None
    */
    addAwardedResources() {
        const headerText = this.scene.add.text(this.x + this.width * 0.08, this.y + this.height * 0.6, 'Resources Awarded', this.scene.fontStyles.recipeBookStyles.recipeHeader2Style);
        // this.add(headerText);
        const awardedResources = this.activity.awardedResources;
        if (awardedResources && typeof awardedResources === 'object') {
            console.log(awardedResources);
            // Add resource cards for required resources
            let yPos = this.height * 0.31;
            console.log(yPos);
            let xPos = this.x*0.15;
            // Add resource cards for awarded resources
            for (const [resourceKey, quantity] of Object.entries(awardedResources)) {
                console.log(this.dataManager.getResource(resourceKey));
                const resourceAvailable = this.scene.game.playerDataManager.isResourceAvailable(resourceKey); 
                const resource = this.dataManager.getResource(resourceKey);
                const resourceCard = new ResourceCard(this.scene, xPos, yPos, this.width * 0.1, this.height * 0.1, resource, quantity, resourceAvailable);
                this.add(resourceCard);
                // yPos += this.height * 0.21; 
                xPos += this.width * 0.055; 
            }
        }
    }

    /*
    Get the quantity of the resource the player has in their inventory
    Parameters: 
        - resourceKey (string): e.g. 'r1' to cross-reference with inventory key
    */
    getInventoryResourceQuantity(resourceKey){
        return this.inventory[resourceKey] || 0;
    }

    updateLanguage(newLang) {
        console.log(`ActivitiesLeftPage: Language changed to ${newLang}`);
        this.userLanguage = newLang;
        this.updatePage(this.activity)
        this.updateText();
    }

    destroy() {
        // Clean up event listener
        this.scene.game.playerDataManager.off('languageUpdated', this.updateLanguage, this);
        super.destroy();
    }
}