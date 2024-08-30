import PopupScene from './PopupScene';
import ActivitiesLeftPage from '../../utils/ActivitiesLeftPage';
import ActivitiesRightPage from '../../utils/ActivitiesRightPage';
import PageNavButton from '../../utils/PageNavButton';

export default class RecipeBookPopupScene extends PopupScene {
    constructor(config) {
        super('RecipeBookPopupScene');
        this.currentPageIndex = 0; // Initialize the current page index
    }

    /*
    Load images for the popup background and the background for the page navigation buttons
    */
    preload() {
        this.load.image('recipe_book_background', './assets/UI/recipe_book_background.png'); // Load recipe book background image
        this.load.image('blueButtonBackground', './assets/UI/blank_blue_button.jpeg');

        // Load all activity thumbnails
        this.activities = this.dataManager.getAllTraditionalActivities();
        console.log(this.activities);
        this.unlockedActivityIDs = this.game.playerDataManager.getUnlockedTraditionalActivities();
        console.log(this.unlockedActivityIDs);
        this.unlockedActivities = this.activities.filter(activity => this.unlockedActivityIDs.includes(activity.id));
        console.log(this.unlockedActivities);

        this.unlockedActivities.forEach(activity => {
            const filepath = `./assets/UI/${activity.thumbnailFilename}`;
            this.load.image(activity.thumbnailFilename, filepath);
            console.log(filepath);
        });

        //load all resource thumbnails
        this.resources = this.dataManager.getAllResources();
        this.resources.forEach(resource => {
            const filepath = `./assets/Images/vocabulary/${resource.imageFilename}`;
            this.load.image(resource.imageFilename, filepath);
            console.log(filepath);
        });
    }

    /*
    Construct popup
    */
    create() {
        //set key for background image for super PopupScene to set
        
        this.backgroundKey = 'recipe_book_background';
        console.log(`background image key", ${this.backgroundKey}`);

        //Create PopupScene
        super.create();
        this.recipeBookStyles = this.fontStyles.recipeBookStyles;
        
        //get the user's language... will be concatenated to get text in data objects.
        this.userLanguage = this.playerDataManager.getUserLanguage();
        console.log(this.userLanguage);

        //get player inventory. will be added to ResourceCards in ActivitiesLeftPage
        this.playerInventory = this.playerDataManager.getInventory();
        console.log(this.userLanguage);

        console.log(`this.unlockedActivities[this.currentPageIndex]`, this.unlockedActivities[this.currentPageIndex]);
        //Construct the left page of the RecipeBookPopup
            // takes: scene (this), x position, right position, page container width, page container height, the currect activity object, the user's selected language, the player's inventory, and the dataManager
        this.leftPage = new ActivitiesLeftPage(this, this.popupContainer.x, this.popupContainer.y, this.popupContainer.width, this.popupContainer.height, this.unlockedActivities[this.currentPageIndex], this.userLanguage, this.playerInventory, this.dataManager);
        
        //Construct the right page of the RecipeBookPopup
            // takes: scene (this), x position, right position, page container width, page container height, the currect activity object, and the user's selected language
        this.rightPage = new ActivitiesRightPage(this, this.popupContainer.width*0.5, this.popupContainer.y, this.popupContainer.width, this.popupContainer.height, this.unlockedActivities[this.currentPageIndex], this.userLanguage);
        //add both page objects to this scene
        this.popupContainer.add([this.leftPage, this.rightPage]);
        // this.updatePageContent();
        
        // Add next and previous buttons
        this.addNavigationButtons();
    }

    /*
    Construct PageNavButton for navigating between activity spreads
    Parameters: None
    */
    addNavigationButtons() {
        if(this.unlockedActivities.length > 1){
            this.addForwardNavButton();
        }
    }

    addBackNavButton(){
        this.prevPageButton = new PageNavButton(this, this.popupContainer.width*0.01, this.popupContainer.height*0.5, "< prev", () => {
            console.log("clicked page back button");
            this.changePage(-1); 
            });
        this.popupContainer.add(this.prevPageButton);
    }

    addForwardNavButton(){
        this.nextPageButton = new PageNavButton(this, this.popupContainer.width*0.85 + this.popupContainer.x, this.popupContainer.height*0.5, "next >",
            () => {
            console.log("clicked page next button");
            this.changePage(1); 
            });
        this.popupContainer.add(this.nextPageButton);
    }

    removeBackNavButton(){
        this.prevPageButton.destroy();
        this.popupContainer.remove(this.prevPageButton);
    }

    removeForwardNavButton(){
        this.nextPageButton.destroy();
        this.popupContainer.remove(this.nextPageButton);
    }

    /*
    Navigate to the next or previous activity
    Parameters:
        - Direction (number): -1 to go to previous page, 1 to go to next page
    Function set as callback in this.addNavigationButtons
    Function called from PageNavButton on pointer down
    */
    changePage(direction) {
        //set currentPageIndex to next, if direction = 1 and the current index isn't the highest index value in the array
        if(direction === 1){
            if (this.currentPageIndex < this.unlockedActivities.length - 1) {
                this.currentPageIndex++;
            }
            else{
                return;
            }
        }
        
        //set currentPageIndex to previous, if direction = -1 and there is an element in the previous index of the activities array
        else if(direction === -1){
            if (this.currentPageIndex > 0) {
                this.currentPageIndex--;
            }
            else{
                return;
            }
        }

        if(this.currentPageIndex === 0){
            this.removeBackNavButton();
        }
        else{
            if(!this.prevPageButton){
                this.addBackNavButton();
            }
        }

        if(this.currentPageIndex === this.unlockedActivities.length - 1 || this.unlockedActivities.length === 1){
            this.removeForwardNavButton();
        }
        else{
            if(!this.nextPageButton){
                this.addForwardNavButton();
            }
        }
        //Update element content in the left and right pages of the spread by passing in the current activity object at the currentPageIndex of the activities array
        this.leftPage.updatePage(this.unlockedActivities[this.currentPageIndex]);
        this.rightPage.updatePage(this.unlockedActivities[this.currentPageIndex]);
    }

    shutdown() {
        // Clean up event listeners
        this.leftPage.destroy();
        this.rightPage.destroy();
    }
}