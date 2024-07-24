import BaseScene from './BaseScene';

export default class TraditionalActivityMinigameScene extends BaseScene {
    constructor() {
        super({ key: 'TraditionalActivityMinigameScene' });
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
        console.log("activity data: ", this.activityData);
        this.activityId = this.activityData.id;
        console.log("activity id: ", this.activityId);
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
        
        this.instructionFontStyle = {
            fontFamily: 'Arial',
            fontSize: `${this.canvasWidth * 0.03}px`,
            fill: '#000',
            wordWrap: { width: this.canvasWidth * 0.5 },
            align: 'left' // Align the font to the left
        };
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

        //show title
        this.showTitle();
        
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
    }

    /*
    Function to show the title of the activity.

    */
    showTitle() {
        // Show title
        
        const titleKey = `name${this.userLanguage}`;
        const titleText = this.activityData[titleKey] || this.activityData.nameE; // Fallback to English if the desired language is not available
        console.log("showTitle: ", titleText);
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
                            this.showInstruction(this.currentStep);
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
    showInstruction(stepIndex) {
        const instruction = this.instructions[stepIndex];
        if (!instruction) return;
        
        console.log("showInstruction: ", instruction);
        if(this.instructions[stepIndex].addItems){
            console.log("stepIndex: ", stepIndex, "; this.instructions[stepIndex].addItems: ", this.instructions[stepIndex].addItems);
            this.addImages(this.instructions[stepIndex].addItems); //add all new scene items 
        }

        // Clear previous instruction text if it exists
        if (this.currentInstructionText) {
            this.currentInstructionText.destroy();
        }

        // Display the instruction text
        const instructionString = this.getInstructionText(instruction);
        this.currentInstructionText = this.add.text(this.canvasWidth * 0.25, this.canvasHeight * 0.15, instructionString, this.instructionFontStyle);

        // Handle interaction based on actionType
        if (instruction.actionType === 'drag') {
            this.setupDragInteraction(instruction);
        } else if (instruction.actionType === 'select') {
            this.setupSelectInteraction(instruction);
        } else if (instruction.actionType === 'special') {
            this.setupSpecialInteraction(instruction);
        } else if (this.instructions.actionType === 'end'){
            this.endActivity(instruction)
        }
    }

    /*
    Function to get the instruction text based on the user's language preference.
    Parameters:
        - instruction (object): The instruction object containing text in different languages.
    Returns:
        - (string): The instruction text in the user's preferred language.
    */
    getInstructionText(instruction){
        this.userLanguage = this.playerDataManager.getUserLanguage();

        // console.log(this.userLanguage);
        const dialogueTextKey = `text${this.userLanguage}`;
        console.log("dialogueText: ", instruction[dialogueTextKey]);
        return instruction[dialogueTextKey];
    } 
    
    /*
    Function to setup the drag interaction.
    Parameters:
        - instruction (object): The instruction object containing the correct tool and destination.
    */
    setupDragInteraction(instruction) {
        // Setup drag interaction
        const toolVocabItem = this.activityVocabulary.find(item => item.id === instruction.correctTool.id);
        const destinationVocabItem = this.activityVocabulary.find(item => item.id === instruction.correctDestination.id);
    
        if (toolVocabItem && destinationVocabItem) {
            const toolImgKey = toolVocabItem.image.split('.').slice(0, -1).join('.'); // Remove file extension
            const destinationImgKey = destinationVocabItem.image.split('.').slice(0, -1).join('.'); // Remove file extension
    
            const originalToolImage = this.textures.get(toolImgKey).getSourceImage();
            const originalToolWidth = originalToolImage.width;
            const originalToolHeight = originalToolImage.height;
    
            const screenWidth = this.cameras.main.width;
            const screenHeight = this.cameras.main.height;
            const desiredToolWidth = (instruction.correctTool.xPercent) * screenWidth;
            const toolAspectRatio = originalToolHeight / originalToolWidth;
            const desiredToolHeight = desiredToolWidth * toolAspectRatio;
    
            const toolStartX = instruction.correctTool.position[0] * screenWidth;
            const toolStartY = instruction.correctTool.position[1] * screenHeight;
    
            const tool = this.add.image(toolStartX, toolStartY, toolImgKey).setInteractive();
            tool.setDisplaySize(desiredToolWidth, desiredToolHeight); // Set tool size
            this.input.setDraggable(tool);
            
            const originalDestinationImage = this.textures.get(destinationImgKey).getSourceImage();
            const originalDestinationWidth = originalDestinationImage.width;
            const originalDestinationHeight = originalDestinationImage.height;
    
            const desiredDestinationWidth = (instruction.correctDestination.xPercent) * screenWidth;
            const destinationAspectRatio = originalDestinationHeight / originalDestinationWidth;
            const desiredDestinationHeight = desiredDestinationWidth * destinationAspectRatio;
    
            const destinationX = instruction.correctDestination.position[0] * screenWidth;
            const destinationY = instruction.correctDestination.position[1] * screenHeight;
    
            // Create the destination image but keep it invisible until needed
            const destination = this.add.image(destinationX, destinationY, destinationImgKey).setInteractive();
            destination.setDisplaySize(desiredDestinationWidth, desiredDestinationHeight); // Set destination size
            // destination.setVisible(false); // Hide the destination image initially
            
            this.input.on('dragstart', (pointer, gameObject) => {
                // Ensure the size remains consistent during drag
                gameObject.setDisplaySize(desiredToolWidth, desiredToolHeight);
                gameObject.setDepth(1); // Bring the object to the front
            });
    
            this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
                gameObject.x = dragX;
                gameObject.y = dragY;
            });
    
            this.input.on('dragend', (pointer, gameObject) => {
                // Ensure the size remains consistent after drag
                gameObject.setDisplaySize(desiredToolWidth, desiredToolHeight);
    
                // Show the destination image and check for correct drop
                destination.setVisible(true);
                if (this.isCorrectDrop(gameObject, destination)) {
                    gameObject.x = destinationX;
                    gameObject.y = destinationY;
                    this.chainFollowUp(instruction);
                } else {
                    // Return to start position if drop is incorrect
                    gameObject.x = toolStartX;
                    gameObject.y = toolStartY;
                }
                gameObject.setDepth(0); // Reset the depth after drop
            });
        } else {
            console.error('Tool or destination vocabulary item not found');
        }
    }

    /*
    Function to setup the select interaction.
    Parameters:
        - instruction (object): The instruction object containing the correct text.
    */
    setupSelectInteraction(instruction) {
        // Setup select interaction
        const correctText = this.add.text(300, 300, instruction.correctText, { fontSize: '24px', fill: '#000' }).setInteractive();
        correctText.on('pointerdown', () => {
            this.onCorrectDrop(instruction);
        });
    }

    /*
    Function to setup the special interaction.
    Parameters:
        - instruction (object): The instruction object containing the feedback.
    */
    setupSpecialInteraction(instruction) {
        // Handle special interaction
        this.showFeedback(instruction.feedback);
        this.nextStep();
    }

    /*
    Function to check if the drop is correct.
    Parameters:
        - gameObject (object): The game object that was dropped.
        - correctDestination (object): The correct destination for the game object.
    Returns:
        - (boolean): True if the drop is correct, false otherwise.
    */
    isCorrectDrop(gameObject, correctDestination) {
        // Check if the drop is correct
        const distance = Phaser.Math.Distance.Between(
            gameObject.x, gameObject.y,
            correctDestination.x, correctDestination.y
        );

        // Define a threshold distance for a correct drop
        const threshold = 50;

        console.log(`Distance: ${distance}, Threshold: ${threshold}`);
        console.log(`GameObject Position: (${gameObject.x}, ${gameObject.y})`);
        console.log(`Destination Position: (${correctDestination.x}, ${correctDestination.y})`);

        /*NOTE: THIS ISNT RELIABLY RETURNING THE CORRECT DROP*/
        return distance <= threshold;
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
    chainFollowUp(instruction){
        const executeNext = () => {
            if (instruction.removeItems) {
                if (this.removeImages(instruction.removeItems)) {
                    executeNext();
                }
                return;
            }
            if (instruction.addItems) {
                if (this.addImages(instruction.addItems)) {
                    executeNext();
                }
                return;
            }
            if (instruction.feedback) {
                if (this.showFeedback(instruction.feedback)) {
                    executeNext();
                }
                return;
            }
            if (instruction.nextStep === "end") {
                this.endActivity(instruction);
            } else {
                this.nextStep();
            }
        };

        executeNext();
    }
    

    /*
    Function to move to the next step.
    */
    nextStep() {
        this.currentStep++;
        this.showInstruction(this.currentStep);
    }

    /*
    Function to show the feedback to the player.
    Parameters:
        - feedback (string): The feedback to be shown to the player.
    */
    showFeedback(feedback) {
        // Display feedback to the player
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
                        }
                    });
                });
            }
        });
        return false; // Function is not complete until the tween finishes
    }

    /*
    Function to add images to the scene.
    Parameters:
        - images (object): The object containing images to be added to the scene.
    */
    addImages(images) {
        console.log("addImages: ", images);
        if (typeof images !== 'object' || images === null) {
            console.error('addImages: images is not an object or is null');
            return false; // Function is not complete
        }

        console.log(images);
        for (const key in images) {
            if (images.hasOwnProperty(key)) {
                const vocabItem = this.activityVocabulary.find(item => item.id === key);
                if (vocabItem) {
                    const imageKey = vocabItem.image.split('.').slice(0, -1).join('.'); // Remove file extension
                    const originalImage = this.textures.get(imageKey).getSourceImage();
                    const originalWidth = originalImage.width;
                    const originalHeight = originalImage.height;

                    // Calculate the width as a percentage of the screen width
                    const screenWidth = this.cameras.main.width;
                    const desiredWidth = (vocabItem.width / 100) * screenWidth;

                    // Calculate the height to maintain the aspect ratio
                    const aspectRatio = originalHeight / originalWidth;
                    const desiredHeight = desiredWidth * aspectRatio;

                    const image = this.add.image(vocabItem.position[0], vocabItem.position[1], imageKey).setInteractive();
                    image.setDisplaySize(desiredWidth, desiredHeight); // Set the display size to maintain aspect ratio
                }
            }
        }
        return true; // Function is complete
    }

    /*
    Function to remove images from the scene.
    Parameters:
        - images (array): The array of images to be removed from the scene.
    */
    removeImages(images){
        for(let i = 0; i < images.length; i++){
            this.remove.image(images[i].x, images[i].y, images[i].key);
        }
        return true; // Function is complete
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
}