import BaseScene from "./BaseScene";

export default class VocabMinigamesMenuScene extends BaseScene {
    constructor() {
        super({ key: 'VocabMinigamesMenuScene' });
        console.log('VocabMinigamesMenuScene constructor called');
    }

    preload() {
        super.preload();
        console.log('VocabMinigamesMenuScene preload called');
        // Preload assets if needed
    }

    create() {
        this.dataManager = this.game.dataManager;

        super.create(); //set up base scene's background and border

        console.log('VocabMinigamesMenuScene create called');
        const fontWidth = this.canvasWidth * 0.2;
        const fontHeight = this.canvasHeight * 0.07;

        this.menuTextStyle = {
            fontFamily: 'Unbounded',
            fontSize: `${Math.min(fontWidth, fontHeight) * 0.3}px`,
            fill: '#000',
            strokeThickness: 0.3,
            resolution: window.devicePixelRatio
        };

        // console.log('Menu text style set:', this.menuTextStyle);
        this.createDropdowns();

    }

    createDropdowns() {
        // console.log('createDropdowns called');
        let semanticCategories = this.dataManager.getAllVocabularySemanticCategories();
        // console.log('Semantic categories:', semanticCategories);

        const buttonWidth = this.canvasWidth * 0.2;
        const buttonHeight = this.canvasHeight * 0.05;
        const initialX = this.canvasWidth * 0.1;
        const gap = this.canvasWidth * 0.22;

        let morphologyDropdown = this.createDropdown("morphological", ["noun", "verb"], initialX, buttonWidth, buttonHeight);
        let morphologyButton = this.createMenuButton("Morphological Category", morphologyDropdown, initialX, buttonWidth, buttonHeight);
        // console.log('Morphology dropdown and button created');

        let semanticDropdown = this.createDropdown("semanticCategory", semanticCategories, initialX + gap, buttonWidth, buttonHeight);
        let semanticButton = this.createMenuButton("Semantic Category", semanticDropdown, initialX + gap, buttonWidth, buttonHeight);
        // console.log('Semantic dropdown and button created');

        let gameTypeDropdown = this.createDropdown("gameType", ["wheel", "matching"], initialX + 2 * gap, buttonWidth, buttonHeight);
        let gameTypeButton = this.createMenuButton("Game Type", gameTypeDropdown, initialX + 2 * gap, buttonWidth, buttonHeight);
        // console.log('Game type dropdown and button created');

        this.menuButtons = [
            morphologyButton,
            semanticButton,
            gameTypeButton
        ];

        this.dropdowns = [
            morphologyDropdown,
            semanticDropdown,
            gameTypeDropdown
        ];

        for (let dropdown of this.dropdowns) {
            // Track the menu state
            dropdown.menuOpen = false;
            // console.log(`Dropdown for ${dropdown.category} initialized with menuOpen = false`);
        }

        // Create a "Generate Game" button
        const generateButtonWidth = this.canvasWidth * 0.3;
        const generateButtonHeight = this.canvasHeight * 0.1;
        const generateButtonX = this.canvasWidth * 0.5 - generateButtonWidth / 2;
        const generateButtonY = this.canvasHeight * 0.8;

        this.generateButton = this.add.text(generateButtonX, generateButtonY, 'Generate stock wheel game', {
            ...this.fontStyles.baseSceneGenericStyles.bodyFontStyle,
            fill: '#ffffff',
            backgroundColor: '#808080',
            padding: {
                left: 10,
                right: 10,
                top: 5,
                bottom: 5
            }
        })
        .setInteractive()
        .setFixedSize(generateButtonWidth, generateButtonHeight)
        .on('pointerdown', () => {
            console.log('Generate Game button clicked');
            this.generateGame();
        })
        .on('pointerover', () => this.generateButton.setStyle({ fill: '#ff0' }))
        .on('pointerout', () => this.generateButton.setStyle({ fill: '#ffffff' }));

        // console.log('Generate Game button created');
    }

    createMenuButton(label, dropdown, x, width, height) {
        // console.log(`createMenuButton called for label: ${label}`);
        
        // Create a graphics object for the button background
        let buttonBg = this.add.graphics();
        buttonBg.fillStyle(0xffffff, 1);
        buttonBg.fillRect(x, 100, width, height);
        buttonBg.lineStyle(1, 0x000000, 1);
        buttonBg.strokeRect(x, 100, width, height);

        let buttonText = this.add.text(x+width/2, 100+height/2, label, {...this.fontStyles.baseSceneGenericStyles.bodyFontStyle, fill: '#000000'})
            .setOrigin(0.5)
            .setVisible(true)
            .setInteractive()
            .on('pointerdown', () => {
                // console.log(`Menu button for ${label} clicked`);
                this.toggleMenu(dropdown);
            })
            .on('pointerover', () => {
                buttonText.setStyle({ fill: '#808080' });
            })
            .on('pointerout', () => {
                buttonText.setStyle({ fill: '#000000' });
            });
            
        

        return { buttonBg, buttonText, label };
    }

    createDropdown(category, options, x, width, height) {
        // console.log(`createDropdown called for category: ${category} with options:`, options);
        let dropdown = {
            category: category,
            menuItems: this.createMenuItems(category, options, x, width, height),
            menuOpen: false,
            selectedOption: null
        };
        return dropdown;
    }

    createMenuItems(category, options, x, width, height) {
        // console.log(`createMenuItems called for category: ${category}`);
        let menuItems = [];
        const flattenedOptions = options.flat(); // Flatten the array
        const uniqueOptions = [...new Set(flattenedOptions)]; // Ensure unique options
        console.log("uniqueOptions:", uniqueOptions);

        uniqueOptions.forEach((option, index) => {
            // console.log(`Creating menu item for option: ${option}`);
            // Create a graphics object for the menu item background
            let itemBg = this.add.graphics();
            itemBg.fillStyle(0xffffff, 1);
            itemBg.fillRect(x, 200 + index * height, width, height);
            itemBg.lineStyle(1, 0x000000, 1);
            itemBg.strokeRect(x, 200 + index * height, width, height);
            itemBg.setVisible(false);
            

            let itemText = this.add.text(x + width / 2, 200 + index * height + height / 2, option, {...this.fontStyles.baseSceneGenericStyles.bodyFontStyle, fill: '#000000'})
                .setOrigin(0.5)
                .setInteractive()
                .setVisible(false)
                .on('pointerdown', () => {
                    // console.log(`Menu item ${index + 1} for category ${category} clicked`);
                    this.selectOption(index, category);
                })
                .on('pointerover', () => {
                    itemText.setStyle({ fill: '#808080' });
                })
                .on('pointerout', () => {
                    itemText.setStyle({ fill: '#000' });
                });
           

            menuItems.push({ itemBg, itemText });
        });

        return menuItems;
    }

    toggleMenu(dropdown) {
        // console.log(`toggleMenu called for category: ${dropdown.category}`);
        dropdown.menuOpen = !dropdown.menuOpen;
        // console.log(`Menu state for ${dropdown.category} is now ${dropdown.menuOpen ? 'open' : 'closed'}`);
        dropdown.menuItems.forEach(item => {
            item.itemBg.setVisible(dropdown.menuOpen);
            item.itemText.setVisible(dropdown.menuOpen);
        });
    }

    selectOption(index, category) {
        // console.log(`selectOption called for index: ${index} and category: ${category}`);
        // console.log(`Selected option ${index + 1} from ${category}`);
        for( let i = 0; i < this.dropdowns.length; i++){
            if(this.dropdowns[i].category === category){
                this.dropdowns[i].selectedOption = this.dropdowns[i].menuItems[index].itemText.text;
                this.updateButtonLabel(this.dropdowns[i], this.menuButtons[i]);
                this.toggleMenu(this.dropdowns[i]); // Close the menu after selection
            }
        }
    }

    updateButtonLabel(dropdown, button) {
        // console.log(`updateButtonLabel called for category: ${dropdown.category}`);
        button.buttonText.setText(dropdown.selectedOption);
    }

    generateGame(){
        const morphology = this.dropdowns[0].selectedOption;
        const semanticCategory = this.dropdowns[1].selectedOption;
        const gameType = this.dropdowns[2].selectedOption;
        const gameVocabulary = this.selectWordsPriorityQueue(morphology, semanticCategory, gameType);
        // console.log(`SELECTED: morphology: ${morphology} , semanticCategory: ${semanticCategory}, gameType: ${gameType}`);
        // console.log("gameVocabulary priority queue:", gameVocabulary);

        // switch (gameType) {
        //     case 'wheel':
        //         this.scene.start('VocabWheelMinigameScene', { gameVocabulary: gameVocabulary });
        //         break;
        //     case 'matchWords':
        //         this.scene.start('VocabMatchWordsScene', { gameVocabulary: gameVocabulary });
        //         break;
        //     case 'spawning':
        //         this.scene.start('VocabSpawningScene', { gameVocabulary: gameVocabulary });
        //         break;
        //     default:
        //         console.error(`Unknown game type: ${gameType}`);
        //         // Optionally, you could start a default game or show an error message
        //         break;
        // }

        const vocabMinigame = this.dataManager.getVocabularyMinigame("g3");
        this.game.sceneManager.changeScene('VocabWheelMinigameScene', {vocabMinigame});
    }

    selectWordsPriorityQueue(morphCategory, semCategory, gameType) {
        // Get all vocabulary data from the data manager
        const wordBank = this.dataManager.getAllVocabularyData();
        console.log(`wordBank length: ${wordBank.length}`);

        // Filter words based on morphological category, semantic categories, and minigames
        const filteredWords = wordBank.filter(word => 
            word.morphologicalCategory === morphCategory && 
            word.semanticCategories.includes(semCategory) &&
            word.minigames.includes(gameType)
        );
        console.log(`filteredWords length: ${filteredWords.length}`);

        // Create a priority queue based on the filtered words
        const pq = [];
        filteredWords.forEach(word => {
            // Define priority based on times incorrect, time since last incorrect, and time since last encountered
            const priority = [
                word.num_times_incorrect,
                new Date() - new Date(word.last_date_incorrect),
                new Date() - new Date(word.last_date_encountered)
            ];
            pq.push({ priority, word });
        });

        // Sort the priority queue
        pq.sort((a, b) => a.priority[0] - b.priority[0] || a.priority[1] - b.priority[1] || a.priority[2] - b.priority[2]);

        // Select the top 8 words from the priority queue
        const selectedWords = pq.slice(0, 8).map(item => item.word);

        // If less than 8 words are selected, fill the remaining slots with other filtered words
        if (selectedWords.length < 8) {
            const remainingWords = filteredWords.filter(word => !selectedWords.includes(word));
            selectedWords.push(...remainingWords.slice(0, 8 - selectedWords.length));
        }

        return selectedWords;
    }

}