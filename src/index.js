//This is the config file for the active version of Silu's Valley, not the draft code.
//define basic characteristics of the game and import scenes

import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import StartMenuScene from './scenes/StartMenuScene';
import OpeningIntroductionScene from './scenes/OpeningIntroductionScene';
import MainMapScene from './scenes/MainMapScene';
import BiomeHomeScene from './scenes/BiomeHomeScene';

// import gameConfig from './config';

// console.log('Initializing Phaser game...');
alert('index.js loaded');

// Create an array of all scenes including the UI scenes
var config = {
	width: 800,
	height: 600,
	resolution: window.devicePixelRatio || 1,
	backgroundColor: 0x000000,
	scene: [
		BootScene, 
		StartMenuScene,
		OpeningIntroductionScene,
		MainMapScene,
		BiomeHomeScene,
	], //list of all scenes used
	scale: {
	    mode: Phaser.Scale.FIT,
	    autoCenter: Phaser.Scale.CENTER_BOTH
	 },
	parent: 'phaser-example',
};

//pass config in as a parameter of the game
var game = new Phaser.Game(config);

console.log('Phaser game initialized:', game);
console.log('index.js: Phaser game initialized with scenes:', config.scene.map(s => s.name));

