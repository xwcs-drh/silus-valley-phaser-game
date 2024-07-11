import PopupScene from './PopupScene';
import ResourceCard from '../../utils/ResourceCard';

export default class InventoryPopupScene extends PopupScene {
    constructor() {
        super('InventoryPopupScene');
    }

    preload() {
        this.load.image('lockIcon', '../assets/UI/lock_icon.jpeg');
        // Load other necessary assets
    }

    create() {
        super.create(); //create the popup window
        this.resources = this.getResourcesData();
        this.createResourceGrid();
        this.events.on('showResourceDetails', this.showResourceDetailPopup, this);
    }

    getResourcesData() {
        // Fetch and return resources data from playerDataManager or other source
        return this.game.playerDataManager.getPlayerData().inventory;
    }

    createResourceGrid() {
        const gridConfig = {
            columns: 4,
            cardWidth: 100,
            cardHeight: 100,
            spacing: 10,
        };

        let x = gridConfig.cardWidth / 2;
        let y = gridConfig.cardHeight / 2;

        this.resources.forEach((resource, index) => {
            const isUnlocked = this.game.playerDataManager.isResourceAvailable(resource.id);
            const quantity = this.game.playerDataManager.getInventory()[resource.id] || 0;
            const resourceCard = new ResourceCard(this, x, y, resource, quantity, isUnlocked);

            this.add.existing(resourceCard);

            x += gridConfig.cardWidth + gridConfig.spacing;
            if ((index + 1) % gridConfig.columns === 0) {
                x = gridConfig.cardWidth / 2;
                y += gridConfig.cardHeight + gridConfig.spacing;
            }
        });
    }

    showResourceDetailPopup(resource) {
        // Code to display the detailed popup for the selected resource
        const detailPopup = new ResourceDetailPopup(this, resource);
        this.add.existing(detailPopup);
    }
}