//This is the config file for the active version of Silu's Valley, not the draft code.
//define basic characteristics of the game and import scenes

import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import StartMenuScene from './scenes/StartMenuScene';
import OpeningIntroductionScene from './scenes/OpeningIntroductionScene';
import MainMapScene from './scenes/MainMapScene';
import BiomeHomeScene from './scenes/BiomeHomeScene';
import TraditionalActivitiesMenuScene from './scenes/TraditionalActivitiesMenuScene';
import TraditionalActivityMinigameScene from './scenes/TraditionalActivityMinigameScene';
import VocabMinigamesMenuScene from './scenes/VocabMinigamesMenuScene';
import VocabWheelMinigameScene from './scenes/VocabWheelMinigameScene';

// import gameConfig from './config';

// console.log('Initializing Phaser game...');
// alert('index.js loaded');

// Calculate the aspect ratio based on the original dimensions
const originalWidth = 2032;
const originalHeight = 1016;
const aspectRatio = originalWidth / originalHeight;

// // // Calculate the new height based on the browser's width and the aspect ratio
// const newWidth = window.innerWidth;
// const newHeight = newWidth / aspectRatio;
// console.log('newWidth:', newWidth);
// console.log('newHeight:', newHeight);
// console.log('canvas width:', window.innerWidth);
// console.log('canvas height:', window.innerHeight);
// Create an array of all scenes including the UI scenes
var config = {
	// width: newWidth,
	// height: newHeight,
	// width: 2032,
	// height: 1016,
	width: window.innerWidth,
	height: window.innerWidth/aspectRatio,

	// resolution: window.devicePixelRatio||2,
	// resolution: Math.max(window.innerWidth / 2032, window.innerHeight / 1016),
	backgroundColor: 0x000000,
	scene: [
		BootScene, 
		StartMenuScene,
		OpeningIntroductionScene,
		MainMapScene,
		BiomeHomeScene,
		TraditionalActivitiesMenuScene,
		TraditionalActivityMinigameScene,
		VocabMinigamesMenuScene,
		VocabWheelMinigameScene,
	], //list of all scenes used
	scale: {
		width:2032,
		height:1016,
		// parent:'game-div',
		// mode:Phaser.CANVAS
		// mode:Phaser.Scale.LANDSCAPE,
	    // mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT, 
		// mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
		mode: Phaser.Scale.FIT,
		// mode: Phaser.Scale.ENVELOP,
	    // autoCenter: Phaser.Scale.CENTER_BOTH
		autoCenter:Phaser.Scale.CENTER_HORIZONTALLY
	 },
	// parent: 'game-div',
};

//pass config in as a parameter of the game
var game = new Phaser.Game(config);

// adjustCanvasSize();

function adjustCanvasSize() {
    const canvas = game.canvas;
    const windowAspectRatio = window.innerWidth / window.innerHeight;
    if (windowAspectRatio < aspectRatio) {
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerWidth / aspectRatio}px`;
    } else {
        canvas.style.width = `${window.innerHeight * aspectRatio}px`;
        canvas.style.height = `${window.innerHeight}px`;
    }
}

// Adjust the canvas size on window resize
// window.addEventListener('resize', adjustCanvasSize);
// adjustCanvasSize();

console.log('Phaser game initialized:', game);
console.log('index.js: Phaser game initialized with scenes:', config.scene.map(s => s.name));

