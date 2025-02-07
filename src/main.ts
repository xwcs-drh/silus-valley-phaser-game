/// <reference types="Phaser" path=”../node_modules/phaser/types/phaser.d.ts”/>
/// <reference types="Phaser" path=”../node_modules/phaser/types/phaser.d.ts”/>
import { Boot } from './scenes/Boot';
import { MainMenu, Credits } from './scenes/MainMenu';
import { Preloader } from "./scenes/Preloader";
import UIPlugin from './phaser3-rex-plugins/templates/ui/ui-plugin.js';

const originalWidth = 2032;
const originalHeight = 1016;
const aspectRatio = originalWidth / originalHeight;

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: originalWidth,
    height: originalHeight,
    parent: 'game-container',
    backgroundColor: '#cbd6e8',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    plugins: {
        scene: [{
            key: 'rexUI',
            plugin: UIPlugin,
            mapping: 'rexUI'
        }]
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        Credits
        // Demo
    ]

}

export default new Phaser.Game(config);
