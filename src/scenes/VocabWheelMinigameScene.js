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
        this.numDropped = 0;
    }

    
    init(data) {
        super.init(data);
        // this.gameMode = data.gameMode || 'challenge';
        // this.isTimed = data.isTimed || false;
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
                    }
                    if (vocabItem.targetImage) {
                        const imageKey = vocabItem.targetImage.split('.').slice(0, -1).join('.'); // Remove file extension
                        this.load.image(imageKey, `assets/Images/vocabulary/${vocabItem.targetImage}`);
                    }
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
        this.numSlices = this.minigameData.vocabulary.length;
        console.log("this.numSlices: ", this.numSlices);
        
        this.destroyAllWheelSlices();
        this.createSlices();
        // if (this.isTimed) {
        //     this.startTimer();
        // }
        setupInputEvents(this);
        this.numDropped = 0;
    }

    /**
     * Destroys all wheel slices
     */
    destroyAllWheelSlices() {
        this.wheelSlices.forEach(slice => {
            slice.destroy();
        });
        this.wheelSlices = [];
    }

    /**
     * Starts a timer for the minigame
     * Not currently implemented... will add when requested by team
     */
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

    
    /**
     * Creates the slices of the wheel
     * calculates the radius of the wheel, length of the chord of the arc, the spawn location of the draggable slices, and the angle of the wheel slices
     * for each object in minigameData.vocabulary, it creates a draggable and target slice and adds them to the wheelSlices and draggableSlices arrays
     * then it calls distributeDraggableSlices to distribute the draggable slices in the option zone
     * then it calls fanWheelSlices to fan the wheel slices out from the center
     */
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
        // setupInputEvents(this);

        this.distributeDraggableSlices(chordLength, draggableRadius);
        this.fanWheelSlices(angle);
    }

    /**
     * distributes draggable slices on 2 rows in a random order evenly in the option zone
     * @param {*} chordLength : the length of the chord of the arc
     * @param {*} radius : the radius of the wheel
     */
    distributeDraggableSlices(chordLength, radius) {
        // Create a copy of the wheelSlices array
        const shuffledSlices = this.draggableSlices;
        // Shuffle the array using Fisher-Yates algorithm
        for (let i = shuffledSlices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledSlices[i], shuffledSlices[j]] = [shuffledSlices[j], shuffledSlices[i]];
        }
        const xDist = (((this.minigameData.optionZone[2] - this.minigameData.optionZone[0]) / (this.numSlices/2))*0.1) * this.canvasWidth;
        let x = (this.canvasWidth * this.minigameData.optionZone[0]) + chordLength/2 + xDist;
        let y = (this.canvasHeight * this.minigameData.optionZone[1]) + radius*1.1;
        // Distribute the slices in their new random order
        let i = 0;

        shuffledSlices.forEach((slice) => {
            slice.distribute(x, y);
            if(i != ((shuffledSlices.length/2)-1)){
                x += xDist + chordLength;
            }
            else{
                x = (this.canvasWidth * this.minigameData.optionZone[0]) + chordLength/2 + xDist;
                y = (this.canvasHeight * this.minigameData.optionZone[3]) - radius*0.1;
            }
            i++;
        });
    }
    
    /**
     * Fans the wheel slices out from the center
     * @param {*} anglePerSlice : the angle of each slice
     */ 
    fanWheelSlices(anglePerSlice){
        // Rotate each slice 360/numSlices - passing value as radians
        this.wheelSlices.forEach((slice, index) => {
            slice.rotateSlice(anglePerSlice * (index + 1));
            slice.setHomePosition(slice.x, slice.y);
        });
    }

    /**
     * Gets the spawn location of the draggable slices
     * @returns {Object} : the spawn location of the vertex of the draggable slices
     */
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

    /**
     * Adds a challenge drop to the incorrectDrops array
     * @param {*} draggable : the draggable slice
     * @param {*} target : the target slice
     */
    addChallengeDrop(draggable, target){
        this.numDropped++;
        this.slicesFilled.push([draggable, target]);
        if(draggable.id !== target.id){
            this.incorrectDrops.push([draggable, target]);
        }
    }

    /**
     * Adds a challenge drop to the incorrectDrops array
     * @param {*} draggable : the draggable slice
     * @param {*} target : the target slice
     */
    addIncorrectDropData(draggable, target){
        this.incorrectDrops.push([draggable, target]);
    }

    /**
     * Validates the challenge drops
     * Highlights the the incorrect slices
     */
    validateChallengeDrops(){
        let score = 0;
        for (let i = 0; i < this.slicesFilled.length; i++) {
            const [draggable, target] = this.slicesFilled[i];
            if (draggable.id === target.id) {
                score++;
            }
            else{
                draggable.highlight();
                //do something to indicate wrongness
            }
        }
        console.log(`Challenge score: ${score} out of ${this.slicesFilled.length}`);
        this.showScore(score);
        // return score;   
    }

    /**
     * Deactivates the slices interactivity
     */
    deactivateSlices(){
        this.draggableSlices.forEach(slice => {
            slice.deactivate();
        });
    }

    /**
     * Ends the timer
     * not currently implemented
     */
    endTimer() {
        console.log("this.sliceFilled: ", this.sliceFilled);
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
    
    /**
     * Shows the score
     * Displays number of correct drops / total number of drops
     * Displays texts of incorrect drops if any  
     */
    showScore() {
        const score = this.numDropped;
        let scoreText = `Score: ${score} / ${this.numSlices}`;
        
        if (score !== this.numSlices) {
            scoreText += "\n\nIncorrect Responses:";
            this.incorrectDrops.forEach(([draggable, target]) => {
                console.log("draggable label: ", draggable.label);
                console.log("target label: ", target.label);
                scoreText += `\n${draggable.label} -> ${target.label}`;
            });
        }

        const scoreTextObject = this.add.text(this.canvasWidth * 0.5, this.canvasHeight * 0.5, scoreText, { 
            fontSize: '32px', 
            fill: '#000',
            align: 'left'
        });
        scoreTextObject.setOrigin(0.5, 0.5);
    }

}