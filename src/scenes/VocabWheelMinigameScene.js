import BaseScene from './BaseScene';
import WheelSlice, { setupInputEvents } from '../utils/WheelSlice';

export default class VocabWheelMinigameScene extends BaseScene {
    constructor() {
        super({ key: 'VocabWheelMinigameScene' });
        this.gameMode = 'practice'; // 'practice' or 'challenge'
        this.isTimed = false;
        this.incorrectDrops = [];
        this.timer = null;
        this.slicesFilled = []
        this.numSlices = 0;
    }

    
    init(data) {
        super.init(data);
        this.gameMode = data.gameMode || 'practice';
        this.isTimed = data.isTimed || false;
        this.dataManager = this.game.dataManager;
        this.minigameData = data.reference.vocabMinigame;
        // console.log("minigame data: ", this.minigameData);
        this.minigameId = this.minigameData.id;
        // console.log("activity id: ", this.activityId);
        if (!this.minigameData) {
            console.error(`Minigame with ID ${this.minigameId} not found`);
        }
    }

    /*
    Preload any assets needed for the minigame
    */
    preload() {
        super.preload();
        if (this.minigameData) {
            const fileName = this.minigameData.backgroundFilename;
            this.load.image('background', `assets/Images/vocabularyMinigameBackgrounds/${fileName}`);
            
            // Load vocabulary images
            if (this.minigameData.vocabulary) {
                this.minigameData.vocabulary.forEach(vocabItem => {
                    if (vocabItem.draggableImage) {
                        const imageKey = vocabItem.draggableImage.split('.').slice(0, -1).join('.'); // Remove file extension
                        this.load.image(imageKey, `assets/Images/vocabulary/${vocabItem.draggableImage}`);
                        // console.log("loading vocabulary image: ", imageKey);
                    }
                    if (vocabItem.targetImage) {
                        const imageKey = vocabItem.targetImage.split('.').slice(0, -1).join('.'); // Remove file extension
                        this.load.image(imageKey, `assets/Images/vocabulary/${vocabItem.targetImage}`);
                        // console.log("loading vocabulary image: ", imageKey);
                    }
                });
            }
        }
    }

    create() {
        super.create();
        this.numSlices = this.minigameData.vocabulary.length;
        console.log("this.numSlices: ", this.numSlices);
        // this.createWheel();
        this.createSlices();
        if (this.isTimed) {
            this.startTimer();
        }

    }

    startTimer() {
        this.timer = this.time.addEvent({
            delay: 60000, // 1 minute
            callback: this.endTimer,
            callbackScope: this
        });
    }

    // Get the angle of the wheel slices in radians
    getWheelAngle() {
        // console.log("this.numSlices: ", this.numSlices);
        return 2 * Math.PI / this.numSlices;
    }

    
    // Create the slices of the wheel
    createSlices() {
        const angle = this.getWheelAngle();
        const draggableSpawnLocation = this.getSpawnLocation();
        const wheelRadius = this.canvasWidth * 0.18;
        const wheelCenterX = this.canvasWidth * 0.2; // Change this value as needed
        const wheelCenterY = this.canvasHeight * 0.5;
        
        const optionZoneWidth = this.minigameData.optionZone[2] - this.minigameData.optionZone[0];
        
        const chordLength = this.canvasWidth * (optionZoneWidth / (this.numSlices / 2)) * 0.85; //get width of arc when pointing upright

        const draggableRadius = chordLength / (2 * Math.sin(angle / 2));

        draggableSpawnLocation.y += draggableRadius/2;
        this.draggableSlices = [];
        this.wheelSlices = [];

        for (let i = 0; i < this.numSlices; i++) {
            let draggableSlice = new WheelSlice(this, draggableSpawnLocation.x, draggableSpawnLocation.y, draggableRadius, angle, this.minigameData.vocabulary[i], "draggable", "E"); 
            this.draggableSlices.push(draggableSlice);

            let targetSlice = new WheelSlice(this, wheelCenterX, wheelCenterY, wheelRadius, angle, this.minigameData.vocabulary[i], "target", "H"); 
            this.wheelSlices.push(targetSlice);
        }
        setupInputEvents(this);

        this.distributeDraggableSlices(chordLength, draggableRadius);
        this.fanWheelSlices(angle);
    }

    distributeDraggableSlices(chordLength, radius) {
        // console.log("canvasWidth: ", this.canvasWidth, "; canvasHeight: ", this.canvasHeight);
        // Create a copy of the wheelSlices array
        const shuffledSlices = this.draggableSlices;
        // console.log("shuffledSlices: ", shuffledSlices);
        // Shuffle the array using Fisher-Yates algorithm
        for (let i = shuffledSlices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledSlices[i], shuffledSlices[j]] = [shuffledSlices[j], shuffledSlices[i]];
        }
        const xDist = (((this.minigameData.optionZone[2] - this.minigameData.optionZone[0]) / (this.numSlices/2))*0.1) * this.canvasWidth;
        let x = (this.canvasWidth * this.minigameData.optionZone[0]) + chordLength/2 + xDist;
        let y = (this.canvasHeight * this.minigameData.optionZone[1]) + radius*1.1;
        // console.log("xDist: ", xDist);
        // Distribute the slices in their new random order
        let i = 0;

        shuffledSlices.forEach((slice) => {
            slice.distribute(x, y);
            if(i != ((shuffledSlices.length/2)-1)){
                x += xDist + chordLength;
            }
            else{
                // console.log("this.canvasWidth * this.minigameData.optionZone[0]: ", this.canvasWidth * this.minigameData.optionZone[0]);
                x = (this.canvasWidth * this.minigameData.optionZone[0]) + chordLength/2 + xDist;
                y = (this.canvasHeight * this.minigameData.optionZone[3]) - radius*0.1;
            }
            // console.log("slice " , i, "after change ;slice x: ", x, "y: ", y);
            // console.log("Final slice position: ", slice.x, slice.y);
            i++;
        });
    }
    
    fanWheelSlices(anglePerSlice){
        // Rotate each slice
        this.wheelSlices.forEach((slice, index) => {
            slice.rotateSlice(anglePerSlice * (index + 1));
        });

        // Log the rotation for debugging
        // console.log(`Rotated ${this.wheelSlices.length} slices by ${anglePerSlice} radians each.`);
    }

    getSpawnLocation(){
        const optionZoneWidth = this.minigameData.optionZone[2] - this.minigameData.optionZone[0];
        const optionZoneHeight = this.minigameData.optionZone[3] - this.minigameData.optionZone[1];
        const spawnX = this.canvasWidth * (this.minigameData.optionZone[0] + (optionZoneWidth/2));
        const spawnY = this.canvasHeight * (this.minigameData.optionZone[1] + (optionZoneHeight/2));
        // const rectangle = this.add.rectangle(spawnX, spawnY, optionZoneWidth*this.canvasWidth, optionZoneHeight*this.canvasHeight, 0x6666ff);
        // rectangle.setOrigin(0.5, 0.5);
        // rectangle.setDepth(100);
        // console.log("rectangle: ", rectangle);
        return {x: spawnX, y: spawnY};
    }

    checkDrop(gameObject) {
        
        const targetSlice = this.getTargetSlice(gameObject);
        
        if (targetSlice) {
            if (this.isCorrectDrop(gameObject, targetSlice)) {
                this.handleCorrectDrop(gameObject, targetSlice);
            } else {
                this.handleIncorrectDrop(gameObject);
            }
        } else {
            this.handleIncorrectDrop(gameObject);
        }
    }
    
    checkDropOnWheel(gameObject) {
        return this.wheelSlices.find(slice => Phaser.Geom.Intersects.RectangleToRectangle(gameObject.getBounds(), slice.getBounds()));
    }

    getTargetSlice(gameObject) {
        return this.wheelSlices.find(slice => Phaser.Geom.Intersects.RectangleToRectangle(gameObject.getBounds(), slice.getBounds()));
    }
    
    isCorrectDrop(gameObject, targetSlice) {
        return gameObject.data.index === targetSlice.data.index;
    }
    
    handleCorrectDrop(gameObject, targetSlice) {
        if (this.gameMode === 'practice') {
           gameObject.tweenBorderColor(0x00ff00);
        } else {
            if(this.gameMode === 'challenge'){
                this.sliceFilled.push(targetSlice);
            }
            if(this.sliceFilled.length === this.minigameData.vocabulary.length){
                this.endTimer();
            }
        }
    }
    
    handleIncorrectDrop(gameObject) {
        if (this.gameMode === 'practice') {
            gameObject.setFillStyle(0xff0000, 1);
            this.time.delayedCall(75, () => {
                gameObject.setFillStyle(0xff0000, 1);
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            });
        } else {
            gameObject.setFillStyle(0xffff00, 1);
        }
        this.incorrectDrops.push(gameObject.id);
    }

    endTimer() {
        if (this.gameMode === 'challenge') {
            this.slicesFilled.forEach(slice => {
                if (this.incorrectDrops.includes(slice.id)) {
                    slice.setBorderColor(0xff0000);
                } else {
                    slice.setBorderColor(0x00ff00);
                }
            });
            this.showScore();
        }
    }
    
    showScore() {
        const score = this.wheelSlices.length - this.incorrectDrops.length;
        const scoreText = this.add.text(this.canvasWidth * 0.5, this.canvasHeight * 0.5, `Score: ${score}`, { fontSize: '32px', fill: '#000' });
        scoreText.setOrigin(0.5, 0.5);
    }

}