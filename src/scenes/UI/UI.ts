import { Scene, GameObjects } from 'phaser';
import { WoodFrameButton, WoodFrameTextPanel } from './Panel'

export class HUD extends Scene
{
    inventoryButton: WoodFrameButton
    inventoryPanel: WoodFrameTextPanel

    constructor () {
        const inventoryButton = new WoodFrameButton(this, 50, 50, 100, 50, "Inventory", () => {})
        super('HUD')
    }
}