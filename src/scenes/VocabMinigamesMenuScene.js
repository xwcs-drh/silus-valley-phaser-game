import BaseScene from "./BaseScene";

/**
 * Scene for the vocabulary minigames menu.
 * Extends the BaseScene class.
 */
export default class VocabMinigamesMenuScene extends BaseScene {
    /**
     * Constructor for the VocabMinigamesMenuScene class.
     * Initializes the scene with a specific key.
     */
    constructor() {
        super({ key: 'VocabMinigamesMenuScene' });
        console.log('VocabMinigamesMenuScene constructor called');
    }

    /**
     * Preloads assets required for the scene.
     * Calls the preload method of the BaseScene class.
     */
    preload() {
        super.preload();
        console.log('VocabMinigamesMenuScene preload called');
        // Preload assets if needed
    }

    /**
     * Creates the scene, setting up the data manager, background, border, and menu UI.
     * Calls the create method of the BaseScene class.
     */
    create() {
        this.dataManager = this.game.dataManager;

        super.create(); // Set up base scene's background and border

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

        this.createDropdowns();
    }

    /**
     * Creates dropdown menus for morphological category, semantic category, and game type.
     * Also creates a "Generate Game" button.
     */
    createDropdowns() {
        let semanticCategories = this.dataManager.getAllVocabularySemanticCategories();

        const buttonWidth = this.canvasWidth * 0.2;
        const buttonHeight = this.canvasHeight * 0.05;
        const initialX = this.canvasWidth * 0.1;
        const gap = this.canvasWidth * 0.22;

        let morphologyDropdown = this.createDropdown("morphological", ["noun", "verb"], initialX, buttonWidth, buttonHeight);
        let morphologyButton = this.createMenuButton("Morphological Category", morphologyDropdown, initialX, buttonWidth, buttonHeight);

        let semanticDropdown = this.createDropdown("semanticCategory", semanticCategories, initialX + gap, buttonWidth, buttonHeight);
        let semanticButton = this.createMenuButton("Semantic Category", semanticDropdown, initialX + gap, buttonWidth, buttonHeight);

        let gameTypeDropdown = this.createDropdown("gameType", ["wheel", "matching", "spawning"], initialX + 2 * gap, buttonWidth, buttonHeight);
        let gameTypeButton = this.createMenuButton("Game Type", gameTypeDropdown, initialX + 2 * gap, buttonWidth, buttonHeight);

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
            dropdown.menuOpen = false;
        }

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
            // console.log('Generate Game button clicked');
            this.generateGame();
        })
        .on('pointerover', () => this.generateButton.setStyle({ fill: '#ff0' }))
        .on('pointerout', () => this.generateButton.setStyle({ fill: '#ffffff' }));
    }

    /**
     * Creates a menu button with a label and associated dropdown.
     * @param {string} label - The label for the button.
     * @param {Object} dropdown - The dropdown associated with the button.
     * @param {number} x - The x-coordinate for the button.
     * @param {number} width - The width of the button.
     * @param {number} height - The height of the button.
     * @returns {Object} The created button with background and text.
     */
    createMenuButton(label, dropdown, x, width, height) {
        let buttonBg = this.add.graphics();
        buttonBg.fillStyle(0xffffff, 1);
        buttonBg.fillRect(x, 100, width, height);
        buttonBg.lineStyle(1, 0x000000, 1);
        buttonBg.strokeRect(x, 100, width, height);

        let buttonText = this.add.text(x + width / 2, 100 + height / 2, label, { ...this.fontStyles.baseSceneGenericStyles.bodyFontStyle, fill: '#000000' })
            .setOrigin(0.5)
            .setVisible(true)
            .setInteractive()
            .on('pointerdown', () => {
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

    /**
     * Creates a dropdown menu with a category and options.
     * @param {string} category - The category of the dropdown.
     * @param {Array} options - The options for the dropdown.
     * @param {number} x - The x-coordinate for the dropdown.
     * @param {number} width - The width of the dropdown.
     * @param {number} height - The height of the dropdown.
     * @returns {Object} The created dropdown with menu items.
     */
    createDropdown(category, options, x, width, height) {
        let dropdown = {
            category: category,
            menuItems: this.createMenuItems(category, options, x, width, height),
            menuOpen: false,
            selectedOption: null
        };
        return dropdown;
    }

    /**
     * Creates menu items for a dropdown.
     * @param {string} category - The category of the dropdown.
     * @param {Array} options - The options for the dropdown.
     * @param {number} x - The x-coordinate for the menu items.
     * @param {number} width - The width of the menu items.
     * @param {number} height - The height of the menu items.
     * @returns {Array} The created menu items.
     */
    createMenuItems(category, options, x, width, height) {
        // console.log(`createMenuItems called for category: ${category}`);
        let menuItems = [];
        // console.log("options:", options);
        const flattenedOptions = options.flat(); // Flatten the array
        const uniqueOptions = [...new Set(flattenedOptions)]; // Ensure unique options
        // console.log("uniqueOptions:", uniqueOptions);
        // console.log("options:", options);
        uniqueOptions.forEach((option, index) => {
            // console.log(`Creating menu item for option: ${option}`);
            // Create a graphics object for the menu item background
            let itemBg = this.add.graphics();
            itemBg.fillStyle(0xffffff, 1);
            itemBg.fillRect(x, 200 + index * height, width, height);
            itemBg.lineStyle(1, 0x000000, 1);
            itemBg.strokeRect(x, 200 + index * height, width, height);
            itemBg.setVisible(false);

            let itemText = this.add.text(x + width / 2, 200 + index * height + height / 2, option, { ...this.fontStyles.baseSceneGenericStyles.bodyFontStyle, fill: '#000000' })
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

    /**
     * Toggles the visibility of a dropdown menu.
     * @param {Object} dropdown - The dropdown to toggle.
     */
    toggleMenu(dropdown) {
        dropdown.menuOpen = !dropdown.menuOpen;
        dropdown.menuItems.forEach(item => {
            item.itemBg.setVisible(dropdown.menuOpen);
            item.itemText.setVisible(dropdown.menuOpen);
        });
    }

    /**
     * Selects an option from the dropdown menu.
     * @param {number} index - The index of the selected option.
     * @param {string} category - The category of the dropdown.
     */
    selectOption(index, category) {
        for (let i = 0; i < this.dropdowns.length; i++) {
            if (this.dropdowns[i].category === category) {
                this.dropdowns[i].selectedOption = this.dropdowns[i].menuItems[index].itemText.text;
                this.updateButtonLabel(this.dropdowns[i], this.menuButtons[i]);
                this.toggleMenu(this.dropdowns[i]); // Close the menu after selection
            }
        }
    }

    /**
     * Updates the label of a button to reflect the selected option of the dropdown.
     * @param {Object} dropdown - The dropdown with the selected option.
     * @param {Object} button - The button to update.
     */
    updateButtonLabel(dropdown, button) {
        button.buttonText.setText(dropdown.selectedOption);
    }

    /**
     * Identifies the appropriate vocabulary minigame based on the selected options.
     * @param {string} morphology - The selected morphological category.
     * @param {string} semanticCategory - The selected semantic category.
     * @param {string} gameType - The selected game type.
     * @returns {Object} The identified vocabulary minigame.
     */
    identifyMinigame(morphology, semanticCategory, gameType) {
        // console.log("morphology:", morphology,", semanticCategory:", semanticCategory,", gameType:", gameType);
        const vocabMinigames = this.dataManager.getAllVocabularyMinigameData();
        const vocabMinigame = vocabMinigames.find(minigame => minigame.morphologicalCategory === morphology && minigame.semanticCategories.includes(semanticCategory) && minigame.gameformat.type === gameType);
        // console.log("vocabMinigame:", vocabMinigame);
        return vocabMinigame;
    }

    /**
     * Generates a new vocabulary minigame based on the selected options.
     * Retrieves the selected morphological category, semantic category,
     * and game type from the dropdowns. Uses these selections to filter
     * and prioritize vocabulary words. Initializes and starts the
     * appropriate minigame scene with the selected vocabulary.
     */
    generateGame() {
        const morphology = this.dropdowns[0].selectedOption;
        const semanticCategory = this.dropdowns[1].selectedOption;
        const gameType = this.dropdowns[2].selectedOption;
        const vocabMinigame = this.identifyMinigame(morphology, semanticCategory, gameType);
        // console.log("vocabMinigame:", vocabMinigame);

        const gameVocabulary = this.selectWordsPriorityQueue(morphology, semanticCategory, gameType);
        // console.log("gameVocabulary:", gameVocabulary);
        // const vocabMinigame = this.dataManager.getVocabularyMinigame("g3");
        // this.game.sceneManager.changeScene('VocabWheelMinigameScene', { vocabMinigame });
        this.game.sceneManager.changeScene(vocabMinigame.SceneConstructor_identifier, { vocabMinigame, gameVocabulary });
    }

    /**
     * Selects words from the vocabulary data based on the selected options.
     * Filters words by morphological category, semantic category, and game type.
     * Creates a priority queue based on the filtered words and selects the top 8 words.
     * @param {string} morphCategory - The selected morphological category.
     * @param {string} semCategory - The selected semantic category.
     * @param {string} gameType - The selected game type.
     * @returns {Array} The selected words for the minigame.
     */
    selectWordsPriorityQueue(morphCategory, semCategory, gameType) {
        const wordBank = this.dataManager.getAllVocabularyData();
        // console.log(`wordBank length: ${wordBank.length}`);

        // console.log(`morphCategory: ${morphCategory}, semCategory: ${semCategory}, gameType: ${gameType}`);
        const filteredWords = wordBank.filter(word =>
            word.morphologicalCategory === morphCategory &&
            word.semanticCategories.includes(semCategory) &&
            word.minigames.includes(gameType)
        );
        // console.log(`filteredWords length: ${filteredWords.length}`);

        const pq = [];
        filteredWords.forEach(word => {
            const priority = [
                word.num_times_incorrect,
                new Date() - new Date(word.last_date_incorrect),
                new Date() - new Date(word.last_date_encountered)
            ];
            pq.push({ priority, word });
        });

        pq.sort((a, b) => a.priority[0] - b.priority[0] || a.priority[1] - b.priority[1] || a.priority[2] - b.priority[2]);

        const selectedWords = pq.slice(0, 8).map(item => item.word);

        if (selectedWords.length < 6) {
            const remainingWords = filteredWords.filter(word => !selectedWords.includes(word));
            selectedWords.push(...remainingWords.slice(0, 6 - selectedWords.length));
        }

        return selectedWords;
    }
}