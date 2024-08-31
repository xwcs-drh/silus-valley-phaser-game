import BaseScene from './BaseScene';
import VocabSprite from '../utils/VocabSprite';

export default class VocabSpawningGameScene extends BaseScene {
    constructor() {
        super({ key: 'VocabSpawningMinigameScene' });

        this.gameMode = 'challenge'; // 'practice' or 'challenge'
        this.isTimed = false;
        this.incorrectDrops = [];
        this.timer = null;
        this.numDropped = 0;
        this.vocabViewed = []; //used in practice mode, updates playerData when game ends
        this.vocabCorrect = []; //used in challenge mode, updates playerData when game ends
        this.vocabIncorrect = []; //used in challenge mode, updates playerData when game ends
        this.vocabSpawned = []; //populated with active sprites
        this.correctVocabToSelect = null; //only used in challenge mode. This is the vocab item that the player must select to be correct        
        this.outOfBoundsCalled = false; // Flag to track if spriteOutOfBounds has been called
        this.activeTweens = [];
        this.score = 0;
    }

    init(data) {
        super.init(data);
        // this.gameMode = data.gameMode || 'challenge';
        // this.isTimed = data.isTimed || false;
        this.dataManager = this.game.dataManager;
        this.minigameData = data.reference.vocabMinigame;
        this.vocabulary = data.reference.gameVocabulary;
        // this.vocabulary = minigameData.vocabulary;
        // this.vocabulary = vocabularySelection("noun", "animal");

        // console.log("minigame data: ", this.minigameData);
        // console.log("vocabulary: ", this.vocabulary);
        this.minigameId = this.minigameData.id;
        // console.log("activity id: ", this.activityId);
        if (!this.minigameData) {
            console.error(`Minigame with ID ${this.minigameId} not found`);
        }
    }

    preload() {
        super.preload();
        this.load.image('spriteImg', "assets/Images/vocabulary/vo4Image.png");
        // if (this.minigameData) {
        //     const fileName = this.minigameData.backgroundFilename;
        //     this.load.image('background', `assets/Images/vocabularyMinigameBackgrounds/${fileName}`);
            
        //     // Load vocabulary images
        //     if (this.minigameData.vocabulary) {
        //         this.minigameData.vocabulary.forEach(vocabItem => {
        //             if (vocabItem.imageFilename) {
        //                 const imageKey = vocabItem.imageFilename.split('.').slice(0, -1).join('.'); // Remove file extension
        //                 this.load.image(imageKey, `assets/Images/vocabulary/${vocabItem.imageFilename}`);
        //             }
        //             console.log(`Loaded image for vocabItem: ${vocabItem} ; imageKey: ${imageKey}`);
        //         });
        //     }
        // }
    }

    /**
     * Creates the minigame
     * sets the number of slices, creates the slices, and starts the timer
     * 
    */
    create() {
        super.create();
        this.numVocab = 8;
        // console.log("this.numVocab: ", this.numVocab);
                // if (this.isTimed) {
        //     this.startTimer();
        // }
        // setupInputEvents(this);
        this.vocabText = this.add.text(this.canvasWidth / 2, this.canvasHeight *0.2, 'Hello', {...this.fontStyles.baseSceneGenericStyles.bodyFontStyle, fontSize: '20px', fill: '#000000'});
        if(this.gameMode === 'challenge') {
            this.scoreText = this.add.text(this.canvasWidth *0.9, this.canvasHeight *0.1, 'Correct: 0', {...this.fontStyles.baseSceneGenericStyles.bodyFontStyle, fontSize: '16px', fill: '#000000'});
        }
        this.createEndGameButton();
        this.destroyAllSpawned();

        this.startSpawning();
        // Create end game button
        
    }

    /**
     * Creates the end game button
     * 
    */
    createEndGameButton() {
        this.endGameButton = this.add.rectangle(
            this.canvasWidth * 0.1,
            this.canvasHeight * 0.1,
            this.canvasWidth * 0.08,
            this.canvasHeight * 0.03,
            0x4a4a4a
        );
        this.endGameButton.setOrigin(0.5);
        this.endGameButton.setInteractive();

        const buttonText = this.add.text(
            this.canvasWidth * 0.1,
            this.canvasHeight * 0.1,
            'end game',
            { fontSize: '16px', fill: '#ffffff' }
        );
        buttonText.setOrigin(0.5);
        // this.endGameButton.add(buttonText);
        this.endGameButton.on('pointerdown', () => {
            this.endGame();
        });
    }
    /**
     * Destroys all spawned vocabulary items
     * clears the spawn word text
    */
    destroyAllSpawned() {
        this.vocabText.text = ""; //reset spawn word text
        this.vocabSpawned.forEach(vocab => {
            vocab.destroy();
        });
        this.vocabSpawned = [];
    }

    /**
     * Starts the spawning of vocabulary items
     * 
    */
    startSpawning() {
        // console.log("vocab spawned: ", this.vocabSpawned);
        this.time.delayedCall(1000, () => {
            if(this.gameMode === 'challenge') {
                // Get 3 unique random vocab items
            const randomVocab = Phaser.Utils.Array.Shuffle(this.vocabulary.slice()).slice(0, 3);
            // console.log("randomVocab: ", randomVocab);
            this.spawnChallengeVocabs(randomVocab);
        }
        else {
            // Spawn all vocabulary items
            // Get a single random vocab item
            const randomVocab = Phaser.Utils.Array.GetRandom(this.vocabulary);
            // Spawn the random vocab item
            this.spawnSingleVocabSprite(randomVocab);
            this.displayWordForVocabSprite(randomVocab.langA);
        }
        });
    }

    /**
     * Spawns the challenge vocab items
     * @param {*} randomVocabs : the array of 3 vocab items to spawn
    */
    spawnChallengeVocabs(randomVocabs) {
        // console.log("this.canvasWidth: ", this.canvasWidth," ; this.canvasHeight: ", this.canvasHeight);
        for (let i = 0; i < randomVocabs.length; i++) {
            const spawnPosition = this.getSpawnPosition(i+1);
            // console.log("spawnPosition: ", spawnPosition);
            const vocabSprite = new VocabSprite(this, spawnPosition.x, spawnPosition.y, randomVocabs[i], this.minigameData.gameformat);
            // console.log("vocabSprite: ", vocabSprite);
            this.vocabSpawned.push(vocabSprite);
            // this.spawnVocabSprite(randomVocabs[i], spawnPosition);
        }
        this.correctVocabToSelect = Phaser.Utils.Array.GetRandom(randomVocabs); 
        console.log("this.correctVocabToSelect: ", this.correctVocabToSelect);
        this.displayWordForVocabSprite(this.correctVocabToSelect.nameE); //display the word for the correct vocab to select
    }

    /**
     * Spawns a single vocab sprite
     * @param {*} vocab : the vocab item to spawn
    */
    spawnSingleVocabSprite(vocab) {
        const position = this.getSpawnPosition(4); //4 allows pos to be anywhere on canvas
        const vocabSprite = new VocabSprite(this, position.x, position.y, vocab, this.minigameData.gameformat);
        this.vocabSpawned.push(vocabSprite);
    }

    /**
     * Get the exact spawn position for the vocab sprite
     * called by spawnChallengeVocabs, 
     * @param {*} region : 1-4 where 1 allows x to be in the first third of the canvas, 2 allows x to be in the second third of the canvas, and 2 allows x to be in the third third of the canvas, 4 allows x to be any xPos on canvas, 2
     * @returns {x: number, y: number} : the exact spawn position for the vocab sprite
    */
    getSpawnPosition(region) {
        const direction = this.minigameData.gameformat.direction;

        let pos = {
            x: 0,
            y: 0
        };
        const randPosInBounds = this.getRandPosInBounds(region);
        switch(direction) {
            case "leftward":
                pos.x = this.canvasWidth * 0.9;
                pos.y = randPosInBounds.y;
                break;
            case "upward":
                pos.x = randPosInBounds.x;
                pos.y = this.canvasHeight*1.1;
                break;
            case "downward":
                pos.x = randPosInBounds.x;
                pos.y = this.canvasHeight * 0.1;
                break;
            case "rightward":
                pos.x = this.canvasWidth * 0.1;
                pos.y = randPosInBounds.y;
                break;
            case "grow":
                pos.x = randPosInBounds.x;
                pos.y = randPosInBounds.y;
                break;
        }
        return pos;
    }

    /**
     * Get the bounds for the spawn position
     * Called by getSpawnPosition
     * @param {*} region : 1-4 where 1 allows x to be in the first third of the canvas, 2 allows x to be in the second third of the canvas, and 2 allows x to be in the third third of the canvas, 4 allows x to be any xPos on canvas, 2
     * @returns {leftX: number, rightX: number, topY: number, bottomY: number} : the bounds for the spawn position
    */
    getBounds(region){
        const direction = this.minigameData.gameformat.direction;
        let bounds = {
            leftX: 0,
            rightX: 0,
            topY: 0,
            bottomY: 0
        };
        const margins = direction === "grow" ? 0.3 : 0.1;
        switch(region) {
            case 1:
                bounds.leftX = 0;
                bounds.rightX = this.canvasWidth/3;
                bounds.topY = 0;
                bounds.bottomY = this.canvasHeight/3;
                break;
            case 2:
                bounds.leftX = this.canvasWidth/3;
                bounds.rightX = (this.canvasWidth/3)*2;
                bounds.topY = this.canvasHeight/3;
                bounds.bottomY = (this.canvasHeight/3)*2;
                break;
            case 3:
                bounds.leftX = (this.canvasWidth/3)*2;
                bounds.rightX = this.canvasWidth;
                bounds.topY = (this.canvasHeight/3)*2;
                bounds.bottomY = this.canvasHeight;
                break;
            case 4:
                bounds.leftX = 0;
                bounds.rightX = this.canvasWidth;
                bounds.topY = 0;
                bounds.bottomY = this.canvasHeight;
                break;
        }
        // console.log("BEFORE MARGINS... bounds.leftX: ", bounds.leftX," ; bounds.rightX: ", bounds.rightX," ; bounds.topY: ", bounds.topY," ; bounds.bottomY: ", bounds.bottomY);
        bounds.leftX +=(this.canvasWidth * margins);
        bounds.rightX -= (this.canvasWidth * margins);
        bounds.topY += (this.canvasHeight * margins);
        bounds.bottomY -= (this.canvasHeight * margins);
    
        return bounds;
    }

    /**
     * Get a random position within the bounds
     * Called by getSpawnPosition
     * @param {*} region : 1-4 where 1 allows x to be in the first third of the canvas, 2 allows x to be in the second third of the canvas, and 2 allows x to be in the third third of the canvas, 4 allows x to be any xPos on canvas, 2
     * @returns {x: number, y: number} : the random position within the bounds
    */
    getRandPosInBounds(region) {
        const bounds = this.getBounds(region);
        // console.log("bounds: ", bounds);
        const x = Phaser.Math.Between(bounds.leftX, bounds.rightX);
        const y = Phaser.Math.Between(bounds.topY, bounds.bottomY);
        // console.log("x: ", x,", y: ", y);
        return {
            x: x,
            y: y
        };
    }

    /**
     * Terminates all active sprites
     * stops all active tweens
     * disables interactive for all vocab sprites
    */
    terminateSprites() {
        this.activeTweens.forEach(tween => tween.stop());
        this.vocabSpawned.forEach(vocab => {
            vocab.disableInteractive();
        });
    }

    updateScore() {
        if(this.gameMode === 'challenge') {
            this.score += 1;
            this.scoreText.text = `Correct: ${this.score}`;
        }
    }

    /**
     * Handles the selection of a vocab sprite in practice mode
     * @param {*} vocabSprite : the vocab sprite that was selected
    */
    selectedInPractice(vocabSprite) {
        this.terminateSprites();
        this.vocabViewed.push(vocabSprite);
        this.time.delayedCall(1000, () => {
            this.displayWordForVocabSprite("");
            this.destroyAllSpawned();
            this.startSpawning();
        });
    }

    /**
     * Handles the selection of a vocab sprite in challenge mode
     * @param {*} vocabSprite : the vocab sprite that was selected
    */
    selectedInChallenge(vocabSprite) {
        this.terminateSprites();
        console.log("selectedInChallenge: ", vocabSprite.vocabularyData.id, " ; ", this.correctVocabToSelect.id);

        // Check if the vocabSprite is in the vocabCorrect array
        if(vocabSprite.vocabularyData.id === this.correctVocabToSelect.id) {
            this.vocabCorrect.push(vocabSprite);
            this.updateScore();
            //some sort of feedback
        }
        else {
            this.vocabIncorrect.push(vocabSprite);
            //some sort of feedback
        }
        
        // Wait a second before destroying and spawning again
        this.time.delayedCall(1000, () => {
            this.destroyAllSpawned();
            this.startSpawning();
        });
    }

    /**
     * Displays the word for the vocab sprite
     * @param {*} vocabSprite : the vocab sprite that was selected
    */
    displayWordForVocabSprite(vocabSpriteWord) {
        console.log("displayWordForVocabSprite: ", vocabSpriteWord);
        console.log("this.vocabText: ", this.vocabText);
        this.vocabText.setText(vocabSpriteWord);
    }

    spriteOutOfBounds(){
        this.terminateSprites();
        this.outOfBoundsCalled = true; // Flag to track if spriteOutOfBounds has been called
        this.displayWordForVocabSprite("");
        if(this.vocabSpawned.length > 0){
            this.vocabIncorrect.push(this.correctVocabToSelect);
        }
        this.destroyAllSpawned();
        this.outOfBoundsCalled = false; // Reset the flag

        this.startSpawning();
    }

    /**
     * Ends the game
     * destroys all spawned vocab sprites
     * updates playerData
     * stops the game and goes back to the vocab minigame scene
    */
    endGame() {
        // Stop all active tweens
        this.terminateSprites();

        // Destroy all vocabulary sprites
        this.vocabSpawned.forEach(vocab => vocab.destroy());
        this.vocabSpawned = [];

        // Stop the game scene
        this.game.scene.stop('VocabSpawningGameScene'); 
        // this.endGameButton.destroy();
    }
}
