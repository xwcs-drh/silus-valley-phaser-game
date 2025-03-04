import '/static/style.css';
/// <reference types="Phaser" path=”../node_modules/phaser/types/phaser.d.ts”/>
/// <reference types="Phaser" path=”../node_modules/phaser/types/phaser.d.ts”/>
import { Boot } from './scenes/Boot';
import { MainMenu, Credits, Introduction } from './scenes/MainMenu';
import { Preloader } from "./scenes/Preloader";
import { Map } from "./scenes/Map";
// import { Introduction } from "./scenes/Introduction";
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import { PhaserNavMeshPlugin } from "phaser-navmesh";

const originalWidth = 800;
const originalHeight = 600;
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
        scene: [
            {
            key: 'rexUI',
            plugin: UIPlugin,
            mapping: 'rexUI'
            },
        {
            key: "PhaserNavMeshPlugin",
            plugin: PhaserNavMeshPlugin,
            mapping: "navMeshPlugin",
            start: true
        }]
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        Introduction,
        Map,
        // Credits
        // Demo
    ],
    physics: {
        default: "arcade",
        arcade: {
            gravity: {
                x: 0,
                y: 0
            },
            debug: true
        }
    },
    
}

export default new Phaser.Game(config);
