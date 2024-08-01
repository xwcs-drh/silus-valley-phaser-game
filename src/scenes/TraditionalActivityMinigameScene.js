import BaseScene from './BaseScene';
import InteractiveObject from '../utils/InteractiveObject';
import ClockService from '../utils/ClockService';

export default class TraditionalActivityMinigameScene extends BaseScene {
    constructor() {
        super({ key: 'TraditionalActivityMinigameScene' });
        this.objects = [];
        this.hintsLeft = 3;
    }
    
    /*
    Function to get the instruction text based on the user's language preference.
    Parameters:
        - instruction (object): The instruction object containing text in different languages.
    Returns:
        - (string): The instruction text in the user's preferred language.
    */
    getInstructionText(instruction) {
        this.userLanguage = this.game.playerDataManager.getUserLanguage();
        const instructionTextKey = `text${this.userLanguage}`;
        return instruction[instructionTextKey];
    }

    /*
    Function to initialize the scene with the activity ID.
    Parameters:
        - data (object): The data object containing the activity object.
    */
    init(data) {
        super.init(data);
        this.dataManager = this.game.dataManager;
        this.activityData = data.reference.activity;
        // console.log("activity data: ", this.activityData);
        this.activityId = this.activityData.id;
        // console.log("activity id: ", this.activityId);
        if (!this.activityData) {
            console.error(`Activity with ID ${this.activityId} not found`);
        }
    }

    /*preload any assets you need for the minigame
    */
    preload() {
        super.preload();
        if (this.activityData) {
            const fileName = this.activityData.thumbnailFilename;
            this.load.image('background', `assets/Images/traditionalActivityBackgrounds/${fileName}`);
            
            // Load vocabulary images
            if (this.activityData.vocabulary) {
                this.activityData.vocabulary.forEach(vocabItem => {
                    if (vocabItem.image) {
                        const imageKey = vocabItem.image.split('.').slice(0, -1).join('.'); // Remove file extension
                        this.load.image(imageKey, `assets/Images/vocabulary/${vocabItem.image}`);
                        // console.log("loading vocabulary image: ", imageKey);
                    }
                });
            }
        }
    
    }

    
    /*
    Function to create the scene and load the activity data.
    */
    create() {
        super.create(); //set up base scene's background and border
        this.playerDataManager = this.game.playerDataManager;

        if (!this.activityData) {
            console.error(`Activity with ID ${this.activityId} not found`);
            return;
        }
        this.activityVocabulary = this.activityData.vocabulary;

        this.renderActivity();
        // this.game.dialogueManager.hideDialogueBox();
        
        this.createHintButton();

        // Enable input plugin
        this.input = this.input || this.scene.input;

         // Add drag event listeners
         this.input.on('dragstart', (pointer, gameObject) => {
            // gameObject.setTint(0xff0000);
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragend', (pointer, gameObject) => {
            // gameObject.clearTint();
            this.checkDragEnd(gameObject); //check if the drop is correct 
        });

        //Create the clock service in scene
        this.clockService = new ClockService(this, this.canvasWidth*0.5, this.canvasHeight*0.5, this.canvasWidth*0.3);

        this.instructionFontStyle = {
            fontFamily: 'Arial',
            fontSize: `${this.canvasWidth * 0.03}px`,
            fill: '#000',
            wordWrap: { width: this.canvasWidth * 0.5 },
            align: 'left' // Align the font to the left
        };

        this.createBlocker();
    }

    createBlocker(){
        this.blocker = this.add.rectangle(0, 0, this.canvasWidth, this.canvasHeight, 0x000000, 0);
        this.blocker.setOrigin(0, 0);
        this.blocker.setInteractive();
        this.blocker.setDepth(115); // Ensure the blocker is above the overlay
        this.blocker.setVisible(true);
    }

    /*
    Function to create the hint button.
    */
    createHintButton(){
         // Create hint button
         const canvasWidth = this.cameras.main.width;
         const canvasHeight = this.cameras.main.height;
         this.hintButton = this.add.circle(0.95 * canvasWidth, 0.05 * canvasHeight, 0.15 * canvasWidth, 0xffc0cb)
             .setInteractive()
             .setDisplaySize(0.05 * canvasWidth, 0.05 * canvasWidth)
             .on('pointerdown', () => {
                 if (this.hintPopup && this.hintPopup.visible) {
                     this.hideHint();
                 } else {
                     this.showHint();
                 }
             }, this);
 
         this.hintText = this.add.text(0.95 * canvasWidth, 0.05 * canvasHeight, '?', {
             fontSize: `${this.canvasWidth * 0.03}px`,
             color: '#000000',
             align: 'center'
         }).setOrigin(0.5);
 
         // Create hint popup (hidden initially)
         this.hintPopup = this.add.rectangle(canvasWidth / 2, canvasHeight / 2, 0.8 * canvasWidth, 0.4 * canvasHeight, 0xffffff)
             .setStrokeStyle(2, 0x000000)
             .setOrigin(0.5)
             .setVisible(false);
 
         this.hintPopupText = this.add.text(canvasWidth / 2, canvasHeight / 2, '', {
             fontSize: '24px',
             color: '#000000',
             wordWrap: { width: 0.75 * canvasWidth },
             align: 'left'
         }).setOrigin(0.5)
           .setVisible(false);
 
         // Close hint popup on click
         this.hintPopup.setInteractive().on('pointerdown', () => {
             this.hideHint();

             if (this.hintsLeft === 0) {
                this.hintButton.setFillStyle(0xd3d3d3);
                this.hintText.setColor('#a9a9a9');
                this.hintButton.disableInteractive();
            }
         });
    }

    /*
    Function to show the hint.
    */
    showHint() {
        if (this.hintsLeft > 0) {
            const currentInstruction = this.instructions[this.currentStep];
            this.hintPopupText.setText(this.getInstructionHintText(currentInstruction));
            this.hintPopup.setVisible(true);
            this.hintPopupText.setVisible(true);
            this.hintsLeft--;
        }
    }

    hideHint(){
        this.hintPopup.setVisible(false);
        this.hintPopupText.setText("");    
    }
    
    /*
    Function to render the activity data and handle interactions.
    Parameters:
        - activityData (object): The activity data object.
    */
    renderActivity() {
        const background = this.add.image(this.canvasWidth*0.5, this.canvasHeight*0.5, 'background');
        background.setOrigin(0.5, 0.5);
        background.setDisplaySize(this.canvasWidth, this.canvasHeight); // Set the background to fill the game window
        
        // Remove required resources from player inventory. No visuals associated... may add some
        const requiredResources = this.activityData.requiredResources;
        for (const resource in requiredResources) {
            if (requiredResources.hasOwnProperty(resource)) {
                const quantity = requiredResources[resource];
                this.playerDataManager.removeResource(resource, quantity);
            }
        }

        // Render the instructions and handle interactions
        this.instructions = this.activityData.instructions;
        this.currentStep = 0;

        //show title
        this.showTitle();
    }

    /*
    Function to show the title of the activity.

    */
    showTitle() {
        // Show title
        
        const titleKey = `name${this.userLanguage}`;
        const titleText = this.activityData[titleKey] || this.activityData.nameE; // Fallback to English if the desired language is not available
        // console.log("showTitle: ", titleText);
        const title = this.add.text(this.canvasWidth*0.5, this.canvasHeight*0.15, titleText, { fontSize: `${this.canvasWidth * 0.05}px`, fill: '#000' });
        title.setOrigin(0.5, 0.5);
        title.alpha = 0;

        // Fade in the title
        this.tweens.add({
            targets: title,
            alpha: 1,
            duration: 1000,
            ease: 'Power1',
            onComplete: () => {
                // Fade out the title after a few seconds
                this.time.delayedCall(2000, () => {
                    this.tweens.add({
                        targets: title,
                        alpha: 0,
                        duration: 1000,
                        ease: 'Power1',
                        onComplete: () => {
                            // Start the first instruction
                            this.currentStep = "step1";
                            this.showInstruction();
                        }
                    });
                });
            }
        });
    }

    /*
    Function to show the instruction for the current step.
    Parameters:
        - stepIndex (integer): The index of the current step.
    */
    showInstruction() {
        this.instruction = this.instructions.find(instruction => instruction.id === this.currentStep);
        if (!this.instruction) return;
        
        console.log("showInstruction: ", this.instruction);
        if(this.instruction.addItems){
            console.log("currentStepNumber: ", this.currentStep, "; this.instructions[currentStepNumber].addItems: ", this.instruction.addItems);
            this.addImages(this.instruction.addItems); //add all new scene items 
        }

        // Clear previous instruction text if it exists
        if (this.currentInstructionText) {
            this.currentInstructionText.destroy();
        }

        // Display the instruction text
        const instructionString = this.getInstructionText(this.instruction);
        this.currentInstructionText = this.add.text(this.canvasWidth * 0.25, this.canvasHeight * 0.15, instructionString, this.instructionFontStyle);
        
        //populate scene interactive objects
        // this.updateObjects(instruction);

        // Handle interaction based on actionType
        if (this.instruction.actionType === 'drag') {
            this.setupDragInteraction(this.instruction);
        } else if (this.instruction.actionType === 'select') {
            this.setupSelectInteraction(this.instruction);
        } else if (instruction.actionType === 'special') {
            this.setupSpecialInteraction(instruction);
        } else if (this.instruction.actionType === 'end'){
            this.endActivity(this.instruction)
        }
        this.blocker.setVisible(false);
    }

    /*
    Function to get the instruction text based on the user's language preference.
    Parameters:
        - instruction (object): The instruction object containing text in different languages.
    Returns:
        - (string): The instruction text in the user's preferred language.
    */
    getInstructionText(){
        this.userLanguage = this.playerDataManager.getUserLanguage();

        // console.log(this.userLanguage);
        const dialogueTextKey = `text${this.userLanguage}`;
        // console.log("dialogueText: ", this.instruction[dialogueTextKey]);
        return this.instruction[dialogueTextKey];
    } 
    
    getInstructionHintText(){
        const dialogueTextKey = `textH`;
        // console.log("dialogueText: ", this.instruction[dialogueTextKey]);
        return this.instruction[dialogueTextKey];
    }
    /*
    Function to setup the drag interaction.
    Parameters:
        - instruction (object): The instruction object containing the correct tool and destination.
    */
    setupDragInteraction() {
        this.updateObjects(this.instruction);

    }

    /*
    Function to setup the select interaction.
    Parameters:
        - instruction (object): The instruction object containing the correct text.
    */
    setupSelectInteraction() {
        // Setup select interaction
        this.updateObjects(this.instruction);
        const correctText = this.add.text(300, 300, this.instruction.correctText, { fontSize: '24px', fill: '#000' }).setInteractive();
        correctText.on('pointerdown', () => {
            this.onCorrectDrop(this.instruction);
        });
    }

    /*
    Function to setup the special interaction.
    Parameters:
        - instruction (object): The instruction object containing the feedback.
    */
    setupSpecialInteraction() {
        // Handle special interaction
        this.updateObjects(this.instruction);
        this.showFeedback(this.instruction.feedback);
        this.nextStep();
    }

    /*
    Function to check if the drag end is correct.
    Parameters:
        - draggedObject (object): The game object that was dragged.
    */
    checkDragEnd(draggedObject) {
        const collidedObject = this.getCollidedObject(draggedObject);
        if (this.isDragCorrect(draggedObject, collidedObject)) {
            // console.log('Correct drag!');
            setTimeout(() => {
                this.chainFollowUp();
            }, 1000);
        } else {
            // console.log('Incorrect drag.');
            // Tween the dragged object back to its original position
            this.tweens.add({
                targets: draggedObject,
                x: draggedObject.input.dragStartX,
                y: draggedObject.input.dragStartY,
                duration: 500,
                ease: 'Power2'
            });
        }
    }

    /*
    Function to get the object that the dragged object collided with
    Parameters:
        - draggedObject (object): The game object that was dragged.
    Returns:
        - (object): The game object that the dragged object collided with.
    */
    getCollidedObject(draggedObject) {
        const draggedBounds = draggedObject.getBounds();

        return this.objects.find(obj => {
            if (obj === draggedObject) return false; // Skip the dragged object itself
            const objBounds = obj.getBounds();
            return Phaser.Geom.Intersects.RectangleToRectangle(draggedBounds, objBounds);
        });
    }

    /*
    Function to check if the drag end is correct.
    Parameters:
        - draggedObject (object): The game object that was dragged.
        - collidedObject (object): The game object that the dragged object collided with.
    Returns:
        - (boolean): True if the drop is correct, false otherwise.
    */
    isDragCorrect(draggedObject, collidedObject) {
        // console.log('Is drag correct: draggedObject: ', draggedObject.role, '; collidedObject: ', collidedObject.role   );
        return draggedObject.role === 'agent' && collidedObject && collidedObject.role === 'target';
    }

     /*
    Function to handle the correct drop.
    Parameters:
        - instruction (object): The instruction object containing the feedback, items to be removed, items to be added, and the next step.
    Description:
        This function handles the actions to be taken when a correct drop is made. It performs the following steps:
        1. If there are items to be removed (instruction.removeItems), it calls the removeImages function to remove those items.
        2. If there is feedback to be shown (instruction.feedback), it calls the showFeedback function to display the feedback.
        3. It sets a delay of 1000 milliseconds before proceeding to the next step.
        4. If the next step is the end of the activity (instruction.nextStep === "end"), it calls the endActivity function.
        5. Otherwise, it calls the nextStep function to proceed to the next instruction.
        6. If there are items to be added (instruction.addItems), it calls the addImages function to add those items and sets a delay of 500 milliseconds before executing the next step.
    */
    async chainFollowUp(){
        this.blocker.setVisible(true);
        const executeNext = async () => {
            console.log("Executing next step with instruction:", this.instruction);
            if (this.instruction.functions && this.instruction.functions.length > 0) {
                await this.executeFunctions(this.instruction.functions);
            }

            if (this.instruction.nextStep === "end") {
                this.endActivity(this.instruction);
            } else {
                this.currentStep = this.instruction.nextStep;
                this.nextStep();
            }
        };

        executeNext();
    }
    

    /*
    Function to move to the next step.
    */
    nextStep() {
        this.showInstruction();
    }

    /*
    Function to show the feedback to the player.
    Parameters:
        - feedback (string): The feedback to be shown to the player.
    */
    showFeedback(feedback) {
        return new Promise(resolve => {
            console.log("Feedback: ", feedback);
            // Display feedback to the user
            const feedbackText = this.add.text(400, 400, feedback, { fontSize: '24px', fill: '#000' });
            //fade in and out the feedback text
            this.tweens.add({
                targets: feedbackText,
                alpha: { from: 0, to: 1 }, //fade in 
                duration: 500, //fade-in duration of 500ms
                onComplete: () => {
                    this.time.delayedCall(4000, () => { //wait for 4 seconds
                        this.tweens.add({
                            targets: feedbackText,
                            alpha: { from: 1, to: 0 },
                            duration: 750, //fade-out duration of 750ms
                            onComplete: () => {
                                feedbackText.destroy(); //destroy the feedback text
                                resolve();
                            }
                        });
                    });
                }
            });
        });
    }

    async executeFunctions(functions) {
        if (!functions) return;

        for (const func of functions) {
            const { sequence, functionReference, args } = func;
            console.log("executing function: ", functionReference, " with args: ", args);
            if (sequence === 'after') {
                await this.executeFunctionByName(this, functionReference, ...args);
            }
        }
    }

    executeFunctionByName(context, functionName, ...args) {
        const namespaces = functionName.split('.');
        const func = namespaces.pop();
        for (let i = 0; i < namespaces.length; i++) {
            context = context[namespaces[i]];
        }
        return context[func](...args);
    }

    

    /*
    Function to award resources to the player.
    */
    awardResources(){
        let delay = 0;
        for (const resourceKey in this.activityData.awardedResources) {
            if (this.activityData.awardedResources.hasOwnProperty(resourceKey)) {
                const quantity = this.activityData.awardedResources[resourceKey];

                // Show resource image at center screen
                const resourceImage = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, resourceKey).setScale(0.5);

                // Tween big then small to InventoryButton with delay
                this.time.delayedCall(delay, () => {
                    this.tweens.add({
                        targets: resourceImage,
                        scale: { from: 0.5, to: 1.5 },
                        duration: 500,
                        yoyo: true,
                        onComplete: () => {
                            const inventoryButton = this.scene.get('MainUIScene').inventoryButton;
                            this.tweens.add({
                                targets: resourceImage,
                                x: inventoryButton.x,
                                y: inventoryButton.y,
                                scale: { from: 1.5, to: 0.5 },
                                duration: 500,
                                onComplete: () => {
                                    resourceImage.destroy();
                                }
                            });
                        }
                    });

                    // Add the resource at quantity value to player inventory
                    this.playerDataManager.addResource(resourceKey, quantity);
                });

                delay += 1000; // Adjust the delay as needed
            }
        }
    }

    
    endActivity(instruction){
        this.awardResources();
        //show any newly unlocked activities
        this.showUnlockedActivities();
        //show prompt and button to return to biome or traditional activities home. 
    }

    
    showUnlockedActivities(){
        const unlockedTraditionalActivities = this.dataManager.unlockTraditionalActivities();
        if(unlockedTraditionalActivities.length > 0){
            unlockedTraditionalActivities.forEach(ta => {
                //show card for unlocked traditional activity with delay
            });
        }
    }

    updateObjects(instruction) {
        const newObjectIds = instruction.objects.map(obj => obj.id);

        // Destroy objects not in the new instruction
        this.objects = this.objects.filter(obj => {
            if (!newObjectIds.includes(obj.id)) {
                console.log("destroying object: ", obj.id);
                obj.destroyObject();
                return false;
            }
            return true;
        });

        // Update or create objects
        instruction.objects.forEach(objectData => {
            let obj = this.objects.find(o => o.id === objectData.id);
            if (obj) {
                obj.updateObject(objectData);
            } else {
                obj = new InteractiveObject(this, objectData);
                this.objects.push(obj);
            }
        });
    }
}