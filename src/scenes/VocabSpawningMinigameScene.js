import BaseScene from './BaseScene';
import VocabSprite from '../utils/VocabSprite';

export default class VocabSpawningGameScene extends BaseScene {
    constructor() {
        super({ key: 'VocabSpawningGameScene' });

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
    }

    init(data) {
        super.init(data);
        // this.gameMode = data.gameMode || 'challenge';
        // this.isTimed = data.isTimed || false;
        this.dataManager = this.game.dataManager;
        this.minigameData = data.reference.vocabMinigame;
        this.vocabulary = data.reference.vocabulary;
        // this.vocabulary = minigameData.vocabulary;
        // this.vocabulary = vocabularySelection("noun", "animal");

        // console.log("minigame data: ", this.minigameData);
        this.minigameId = this.minigameData.id;
        // console.log("activity id: ", this.activityId);
        if (!this.minigameData) {
            console.error(`Minigame with ID ${this.minigameId} not found`);
        }
    }

    preload() {
        super.preload();
        if (this.minigameData) {
            const fileName = this.minigameData.backgroundFilename;
            this.load.image('background', `assets/Images/vocabularyMinigameBackgrounds/${fileName}`);
            
            // Load vocabulary images
            if (this.minigameData.vocabulary) {
                this.minigameData.vocabulary.forEach(vocabItem => {
                    if (vocabItem.imageFilename) {
                        const imageKey = vocabItem.imageFilename.split('.').slice(0, -1).join('.'); // Remove file extension
                        this.load.image(imageKey, `assets/Images/vocabulary/${vocabItem.imageFilename}`);
                    }
                    console.log(`Loaded image for vocabItem: ${vocabItem} ; imageKey: ${imageKey}`);
                });
            }
        }
    }

    /**
     * Creates the minigame
     * sets the number of slices, creates the slices, and starts the timer
     * 
    */
    create() {
        super.create();
        this.numVocab = this.minigameData.vocabulary.length;
        console.log("this.numVocab: ", this.numVocab);
        
        this.destroyAllSpawned();
        // if (this.isTimed) {
        //     this.startTimer();
        // }
        // setupInputEvents(this);
        this.vocabText = this.add.text(this.canvas.width / 2, this.canvas.height *0.1, 'Hello', { fontSize: '32px', fill: '#000' });
        this.createEndGameButton();

        this.startSpawning();
        // Create end game button
        
    }

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
    }

    /**
     * Starts the spawning of vocabulary items
     * 
    */
    startSpawning() {
        if(this.gameMode === 'challenge') {
            // Get 3 unique random vocab items
            const randomVocab = Phaser.Utils.Array.Shuffle(this.minigameData.vocabulary.slice()).slice(0, 3);
            
            this.spawnChallengeVocabs(randomVocab);
        }
        else {
            // Spawn all vocabulary items
            // Get a single random vocab item
            const randomVocab = Phaser.Utils.Array.GetRandom(this.minigameData.vocabulary);
            const xPosition = Phaser.Math.Between(this.canvasWidth*0.1, this.canvasWidth*0.9);
            // Spawn the random vocab item
            this.spawnVocabSprite(randomVocab, xPosition);
            this.displayWordForVocabSprite(randomVocab);
        }
    }

    /**
     * Spawns the challenge vocab items
     * @param {*} randomVocabs : the array of 3 vocab items to spawn
    */
    spawnChallengeVocabs(randomVocabs) {
        for (let i = 0; i < randomVocabs.length; i++) {
            const spawnPosition = this.getSpawnPosition(i+1);
            this.spawnVocabSprite(randomVocabs[i], spawnPosition);
        }
        this.correctVocabToSelect = randomVocabs[0]; //set the correct vocab to select as the first vocab item in array of shuffled 3 vocab items
        this.displayWordForVocabSprite(this.correctVocabToSelect.nameH); //display the word for the correct vocab to select
    }

    /**
     * Spawns a single vocab sprite
     * @param {*} vocab : the vocab item to spawn
    */
    spawnSingleVocabSprite(vocab) {
        const position = this.getSpawnPosition(4); //4 allows pos to be anywhere on canvas
        const vocabSprite = new VocabSprite(this, position.x, position.y, vocab);
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
                pos.x = this.canvasWidth * 0.1;
                pos.y = randPosInBounds.y;
                break;
            case "upward":
                pos.x = randPosInBounds.x;
                pos.y = canvasHeight * 0.1;
                break;
            case "downward":
                pos.x = randPosInBounds.x;
                pos.y = canvasHeight * 0.9;
                break;
            case "rightward":
                pos.x = this.canvasWidth * 0.9;
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
                bounds.topY = this.canvasWidth/3;
                bounds.bottomY = (this.canvasWidth/3)*2;
                break;
            case 3:
                bounds.leftX = (this.canvasWidth/3)*2;
                bounds.rightX = this.canvasWidth;
                bounds.topY = (this.canvasWidth/3)*2;
                bounds.bottomY = this.canvasWidth;
                break;
            case 4:
                bounds.leftX = 0;
                bounds.rightX = this.canvasWidth;
                bounds.topY = 0;
                bounds.bottomY = this.canvasHeight;
                break;
        }
        bounds.leftX = bounds.leftX + (this.canvasWidth * margins);
        bounds.rightX = bounds.rightX - (this.canvasWidth * margins);
        bounds.topY = bounds.topY - (this.canvasHeight * margins);
        bounds.bottomY = bounds.bottomY + (this.canvasHeight * margins);
    
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
        const x = Phaser.Math.Between(bounds.leftX, bounds.rightX);
        const y = Phaser.Math.Between(bounds.topY, bounds.bottomY);
        return {
            x: x,
            y: y
        };
    }

    /**
     * Handles the selection of a vocab sprite in practice mode
     * @param {*} vocabSprite : the vocab sprite that was selected
    */
    selectedInPractice(vocabSprite) {
        vocabSprite.disableInteractive();
        this.vocabViewed.push(vocabSprite);
        this.vocabText.text = ""; //clear the spawn word text
        this.time.delayedCall(1000, () => {
            this.destroyAllSpawned();
            this.startSpawning();
        });
    }

    /**
     * Handles the selection of a vocab sprite in challenge mode
     * @param {*} vocabSprite : the vocab sprite that was selected
    */
    selectedInChallenge(vocabSprite) {
        this.vocabSpawned.forEach(vocab => {
            vocab.disableInteractive();
        });
        // Check if the vocabSprite is in the vocabCorrect array
        if(vocabSprite.id === this.correctVocabToSelect.id) {
            this.vocabCorrect.push(vocabSprite);
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
    displayWordForVocabSprite(vocabSprite) {
        const word = vocabSprite.vocabData.word;
        console.log("word: ", word);
        this.vocabText.text = word;
    }

    /**
     * Ends the game
     * 
    */
    endGame() {
        this.destroyAllSpawned();
        //update playerData
        this.game.scene.stop('VocabSpawningGameScene');
        this.game.scene('VocabMinigameScene');
        this.endGameButton.destroy();
        this.backButton = new BackButton(this, this.canvasWidth, this.canvasHeight, this.game.sceneManager);
    }
}
