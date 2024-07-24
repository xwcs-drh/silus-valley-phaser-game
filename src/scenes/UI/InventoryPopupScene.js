import PopupScene from './PopupScene';
import ResourceCard from '../../utils/ResourceCard';

export default class InventoryPopupScene extends PopupScene {
    constructor() {
        super('InventoryPopupScene');
    }

    preload() {
        this.load.image('lockIcon', '../assets/UI/lock_icon.jpeg');

        this.load.image('darkblue_wash_background', '../assets/UI/darkblue_wash_background.jpg'); // Load recipe book background image
        this.load.image('blueButtonBackground', '../assets/UI/blank_blue_button.jpeg');

        console.log("InventoryPopupScene: inventory: ", this.inventory);

    }

    create() {
        //set key for background image for super PopupScene to set
        this.backgroundKey = 'darkblue_wash_background';
        console.log(`background image key", ${this.backgroundKey}`);

        super.create(); //create the popup window
        
        this.resources = this.dataManager.getAllResources();
        this.inventory = this.getInventoryData();
        this.createResourceGrid();
        this.events.on('showResourceDetails', this.showResourceDetailPopup, this);
    }
    /**
     * Fetches resources data from playerDataManager
     * @returns {Object} - The inventory object containing resource IDs and quantities
 */
    getInventoryData() {
        // Fetch and return resources data from playerDataManager or other source
        return this.game.playerDataManager.getPlayerData().inventory;
    }

    /**
     * Creates a grid of resource cards
     */
    createResourceGrid() {
        const gridConfig = this.calculateGridConfig(this.resources.length);
        console.log('Grid Configuration:', gridConfig);

        const { cardWidth, cardHeight, spacing } = this.calculateCardDimensions(gridConfig);
        console.log('Card Dimensions:', { cardWidth, cardHeight, spacing });

        // Get the dimensions and position of the popup container
        const popupContainer = this.popupContainer;
        const containerX = popupContainer.x;
        const containerY = popupContainer.y;
        const containerWidth = popupContainer.width;
        const containerHeight = popupContainer.height;
        console.log('Popup Container Dimensions:', { containerX, containerY, containerWidth, containerHeight });

        // Calculate the total height of the grid
        const totalGridHeight = gridConfig.rows * cardHeight + (gridConfig.rows - 1) * spacing;
        console.log('Total Grid Height:', totalGridHeight);

        // Initialize the x and y coordinates for the grid relative to the popup container
        let xPos = containerX  + spacing/4;
        let yPos = containerY + (containerHeight - totalGridHeight) / 4 ;
        console.log('Initial Positions:', { xPos, yPos });

        for (const resource of this.resources) {
            const resourceKey = resource.id;
            const quantity = this.inventory[resourceKey] > 0 ? this.inventory[resourceKey] : 0;
            const isUnlocked = this.inventory[resourceKey] > 0;
            const resourceCard = new ResourceCard(this, xPos, yPos, cardWidth, cardHeight, resource, quantity, isUnlocked); // Pass 'this' as the scene context
            this.add.existing(resourceCard); // Add resourceCard to the scene
            console.log('Resource Card Position:', { xPos, yPos });

            xPos += cardWidth/2 + spacing;

            // If the end of a row is reached, reset the x coordinate and increment the y coordinate
            if ((this.resources.indexOf(resource) + 1) % gridConfig.columns === 0) {
                xPos = containerX + spacing/4;
                yPos += cardHeight/2 + spacing;
            }
        }
    }

    /**
     * Calculates the grid configuration based on the total number of resources and the aspect ratio of the popup container.
     * @param {number} totalResources - The total number of resources.
     * @returns {Object} - The grid configuration with rows and columns.
     */
    calculateGridConfig(totalResources) {
        const popupContainer = this.popupContainer;
        const containerWidth = popupContainer.width;
        const containerHeight = popupContainer.height;
        const aspectRatio = containerWidth / containerHeight;

        // Calculate the number of columns and rows based on the aspect ratio
        let columns = Math.ceil(Math.sqrt(totalResources * aspectRatio));
        let rows = Math.ceil(totalResources / columns);

        // Adjust columns and rows to fit the total number of resources
        while (columns * rows < totalResources) {
            columns++;
            rows = Math.ceil(totalResources / columns);
        }

        console.log('Calculated Grid Config:', { columns, rows });
        return { columns, rows };
    }

    /**
     * Calculates the card dimensions and spacing based on the grid configuration.
     * @param {Object} gridConfig - The grid configuration with rows and columns.
     * @returns {Object} - The card dimensions and spacing.
     */
    calculateCardDimensions(gridConfig) {
        const popupContainer = this.popupContainer;
        const containerWidth = popupContainer.width;
        const containerHeight = popupContainer.height;

        console.log('Popup Container Width:', containerWidth);
        console.log('Popup Container Height:', containerHeight);

        const cardWidthPercent = 0.8 / gridConfig.columns;
        // const cardHeightPercent = 0.75 / gridConfig.rows;
        const spacingPercent = cardWidthPercent * 0.08; // 5% of the popup container width

        const cardWidth = containerWidth * cardWidthPercent * (1 - spacingPercent);
        const cardHeight = cardWidth*0.8;
        const spacing = containerWidth * spacingPercent;

        console.log('Calculated Card Dimensions:', { cardWidth, cardHeight, spacing });
        return { cardWidth, cardHeight, spacing };
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