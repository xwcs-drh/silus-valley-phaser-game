import PopupScene from './PopupScene';
import ResourceCard from '../../utils/ResourceCard';

export default class InventoryPopupScene extends PopupScene {
    constructor() {
        super('InventoryPopupScene');
    }

    preload() {
        this.load.image('lockIcon', '../assets/UI/lock_icon.jpeg');
    }

    create() {
        super.create(); //create the popup window
        this.resources = this.getResourcesData();
        this.createResourceGrid();
        this.events.on('showResourceDetails', this.showResourceDetailPopup, this);
    }
    /**
     * Fetches resources data from playerDataManager
     * @returns {Object} - The inventory object containing resource IDs and quantities
 */
    getResourcesData() {
        // Fetch and return resources data from playerDataManager or other source
        return this.game.playerDataManager.getPlayerData().inventory;
    }

    /**
     * Creates a grid of resource cards
     */
    createResourceGrid() {
        const gridConfig = {
            columns: 4,
            cardWidth: 100,
            cardHeight: 100,
            spacing: 10,
        };
        
        //initialize the x and y coordinates for the grid
        let x = gridConfig.cardWidth / 2;
        let y = gridConfig.cardHeight / 2;

        //iterate through each resource in the inventory and create a card for it
        this.resources.forEach((resource, index) => {
            const isUnlocked = this.game.playerDataManager.isResourceAvailable(resource.id);
            const quantity = this.game.playerDataManager.getInventory()[resource.id] || 0;
            const resourceCard = new ResourceCard(this, x, y, resource, quantity, isUnlocked);

            this.add.existing(resourceCard);

            //update the x and y coordinates for the next resource
            x += gridConfig.cardWidth + gridConfig.spacing;

            //if the end of a row is reached, reset the x coordinate and increment the y coordinate
            if ((index + 1) % gridConfig.columns === 0) {
                x = gridConfig.cardWidth / 2;
                y += gridConfig.cardHeight + gridConfig.spacing;
            }
        });
    }

    /**
     * Displays a detailed popup for the selected resource
     * @param {Resource} resource - The resource to display details for
     */
    showResourceDetailPopup(resource) {
        const detailPopup = new ResourceDetailPopup(this, resource);
        this.add.existing(detailPopup);
    }
}