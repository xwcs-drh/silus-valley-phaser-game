import InventoryManager from './InventoryManager';

class PlayerData {
  constructor(scene) {
    this.scene = scene;
    this.inventoryManager = null;
    this.inventory = {}; // Initialize inventory as an empty object
    this.unlockedTraditionalActivities = [];
    this.userLang = "nameE"; // Default language
    this.loadPlayerData();
  }

  loadPlayerData() {
    console.log('PlayerData: load player data');
    const playerData = this.scene.cache.json.get('allPlayerData')[0];
    console.log(playerData.id);
    
    if (playerData) {
      this.inventory = playerData.inventory;
      this.unlockedTraditionalActivities = playerData.unlockedTraditionalActivities || [];
      this.userLang = playerData.userLang || "nameE";

      // Initialize InventoryManager with inventory data
      this.inventoryManager = new InventoryManager(this.scene, this.inventory);
    } else {
      console.error('No player data found in cache.');
    }
  }
}

export default PlayerData;