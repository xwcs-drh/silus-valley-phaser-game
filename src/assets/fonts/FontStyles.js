import WebFontLoader from 'webfontloader'

export default class FontStyles {
    constructor(scene) {
        this.scene = scene;
		this.canvasWidth = this.scene.game.canvas.width;
		this.canvasHeight = this.scene.game.canvas.height;
        console.log(this.canvasWidth, this.canvasHeight);

        // Add resize listener
        window.addEventListener('resize', this.updateFontResolution.bind(this));
    }

    /*Load Google fonts using WebFont Loader
    */
    load() {
        // Clear the cache to ensure fonts are reloaded
        this.scene.cache.binary.remove('lushootseed');
        this.scene.cache.binary.remove('bcsans');
        this.scene.cache.binary.remove('degruyter');

        // Preload the TTF files
        // this.scene.load.addFile(new Phaser.Loader.FileTypes.BinaryFile(this.scene.load, 'lushootseed', './assets/fonts/Lushootseed-School.ttf'));
        this.scene.load.addFile(new Phaser.Loader.FileTypes.BinaryFile(this.scene.load, 'bcsans', './assets/fonts/2023_01_01_BCSans-Regular_2f.ttf'));
        this.scene.load.addFile(new Phaser.Loader.FileTypes.BinaryFile(this.scene.load, 'degruyter', './assets/fonts/De-Gruyter-Sans-Regular.ttf'));
        // this.scene.load.addFile(new Phaser.Loader.FileTypes.BinaryFile(this.scene.load, 'fih5ldl', 'https://use.typekit.net/fih5ldl.css'));

        this.scene.load.on('complete', () => {
            const config = {
                google: {
                    families: ['Fira Sans', 'Radio Canada', 'Montserrat Alternates', 'Varta', 'Signika', 'Cabin', 'Maven Pro', 'Noto Sans']
                },
                active: () => {
                    this.setupGlobalFontStyles();
                    this.addLocalFontsSequentially(); // Call the new method to add fonts sequentially
                    this.scene.events.emit('fonts-loaded'); // Emit an event when fonts are loaded
                }
            };

            WebFontLoader.load(config);
        });

        this.scene.load.start(); // Start the loading process
    }

    addLocalFontsSequentially() {
        const fonts = [
            // { name: 'Lushootseed', dataName: 'lushootseed' },
            { name: 'BCSans', dataName: 'bcsans' },
            { name: 'De Gruyter', dataName: 'degruyter' }
        ];

        const loadFont = (index) => {
            if (index >= fonts.length) return;

            const { name, dataName } = fonts[index];
            console.log(`Loading font: ${name}`);
            this.addLocalFont(name, dataName).then(() => {
                console.log(`Successfully loaded font: ${name}`);
                loadFont(index + 1);
            }).catch((error) => {
                console.error(`Failed to load font ${name}:`, error);
                loadFont(index + 1); // Continue with the next font even if one fails
            });
        };

        loadFont(0); // Start loading the first font
    }

    addLocalFont(fontName, fontDataName) {
        return new Promise((resolve, reject) => {
            const fontData = this.scene.cache.binary.get(fontDataName); // Access the cache from the scene
            if (!fontData) {
                console.error(`Font data for ${fontDataName} not found in cache.`);
                return reject(`Font data for ${fontDataName} not found in cache.`);
            }

            const blob = new Blob([fontData], { type: 'font/ttf' });
            const fontUrl = URL.createObjectURL(blob);

            const fontFace = new FontFace(fontName, `url(${fontUrl})`);
            fontFace.load().then((loadedFace) => {
                document.fonts.add(loadedFace);
                console.log(`Font ${fontName} loaded and added to document.`);
                resolve();
            }).catch((error) => {
                console.error(`Failed to load font ${fontName}:`, error);
                reject(error);
            });
        });
    }

	/**
	 * Create a font style object
	 * Assumes fontFamily is 'Radio Canada', defaulting to Arial and then sans-serif'
	 * @param {*} fontSizePercent : % of container / canvas width / height (0-1)
	 * @param {*} color : color of the font
	 * @param {*} align : 'center', 'left', 'right'
	 * @returns 
	 */
	createFontStyle(fontSizePercent, color, align, strokeThickness ) {
        const fontStyle = {
			fontFamily: 'bcsans, degruyter',
			fontSize: `${Math.min(this.canvasWidth, this.canvasHeight) * fontSizePercent}px`,
			fill: color,
			align: align,
            stroke: color,
			strokeThickness: strokeThickness,
			resolution: window.devicePixelRatio,
			padding: { top: this.canvasHeight * fontSizePercent, bottom: this.canvasHeight * fontSizePercent }
		};
		return fontStyle;
	}

    setupGlobalFontStyles() {
        console.log("setting setup global font styles");
        if (!this.scene.game.global) {
            this.scene.game.global = {};
        }
        if (!this.scene.game.global.baseSceneGenericStyles) {
            this.scene.game.global.baseSceneGenericStyles = {};
        }
        this.scene.game.global.baseSceneGenericStyles = {
                headerFontStyle: this.createFontStyle(0.1, '#000080', 'center', 2),
                bodyFontStyle: this.createFontStyle(0.02, '#000000', 'center', 1),
                popupHeaderFontStyle: this.createFontStyle(0.03, '#000080', 'center', 1),
                popupBodyFontStyle: this.createFontStyle(0.02, '#000000', 'center', 1),
                buttonFontStyle: this.createFontStyle(0.04, '#ffffff', 'center', 0),
                dialogueFontStyle: this.createFontStyle(0.04, '#000000', 'center', 0)
        };
        // console.log(this.scene.game.global.baseSceneGenericStyles);
    }

    /**
     * Create a custom text object
     * @param {*} x : x position of the text
     * @param {*} y : y position of the text
     * @param {*} text : string to display
     * @param {*} baseStyle : from this.scene.game.global.baseSceneGenericStyles
     * @returns 
     */
    getCustomText(x, y, text, baseStyle) {
        const specialFontStyle = {
            ...baseStyle,
            fontFamily: 'Times New Roman',
        };

        let offsetX = 0;
        const container = this.scene.add.container(x, y);
        let buffer = '';

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const nextChar = text[i + 1];

            // Check if the current character is an apostrophe that should be stacked on the preceding character
            if (char === '’') {
                // Create a text object for the buffer if it exists
                if (buffer) {
                    const bufferText = this.scene.add.text(offsetX, 0, buffer, baseStyle);
                    offsetX += bufferText.width;
                    container.add(bufferText);
                    buffer = '';
                }

                // Create a text object for the apostrophe with the special font style
                const charText = this.scene.add.text(offsetX, 0, char, specialFontStyle);
                offsetX += charText.width;
                container.add(charText);
            } else {
                // Append the current character to the buffer
                buffer += char;

                // If the next character is an apostrophe, create a text object for the buffer
                if (nextChar === '’') {
                    const bufferText = this.scene.add.text(offsetX, 0, buffer, baseStyle);
                    offsetX += bufferText.width*0.9;
                    container.add(bufferText);
                    buffer = '';
                }
            }
        }

        // Create a text object for any remaining buffer
        if (buffer) {
            const bufferText = this.scene.add.text(offsetX, 0, buffer, baseStyle);
            container.add(bufferText);
        }

        return container;
    }

    updateFontResolution() {
        const styles = this.scene.game.global.baseSceneGenericStyles;
        for (let key in styles) {
            if (styles.hasOwnProperty(key)) {
                styles[key].resolution = window.devicePixelRatio;
            }
        }
        console.log("font resolution updated", styles); // Log the updated styles

        // Function to recursively update text resolution
        const updateTextResolution = (element) => {
            if (element.type === 'Text') {
                element.setResolution(window.devicePixelRatio);
                element.updateText(); // Force the text to re-render with the new resolution

                // Force re-render by slightly modifying the text content
                const originalText = element.text;
                element.setText(originalText + ' ');
                element.setText(originalText);
            } else if (element.list && element.list.length > 0) {
                element.list.forEach(child => updateTextResolution(child));
            }
        };

        // Iterate through all scenes in the game
        this.scene.game.scene.scenes.forEach(scene => {
            // Update the resolution of all existing text elements in each scene
            scene.children.list.forEach(child => updateTextResolution(child));
        });
    }
}