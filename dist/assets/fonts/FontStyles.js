import WebFontLoader from 'webfontloader'

export default class FontStyles {
    constructor(scene) {
        this.scene = scene;
		this.canvasWidth = this.scene.game.canvas.width;
		this.canvasHeight = this.scene.game.canvas.height;
        // console.log(this.canvasWidth, this.canvasHeight);
        // this.loadFonts();
        this.fontFamily = 'Radio-Canada';
        this.setupGlobalFontStyles();
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
			fontFamily: this.fontFamily,
			fontSize: `${Math.min(this.canvasWidth, this.canvasHeight) * fontSizePercent}px`,
			fill: color,
			align: align,
            stroke: color,
			strokeThickness: strokeThickness,
			resolution: window.devicePixelRatio,
			padding: { top: this.canvasHeight * 0.05 }
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
        this.baseSceneGenericStyles = {
                headerFontStyle: this.createFontStyle(0.1, '#000080', 'center', 0.5),
                bodyFontStyle: this.createFontStyle(0.02, '#000000', 'center', 1),
                popupHeaderFontStyle: this.createFontStyle(0.04, '#000080', 'center', 1),
                popupBodyFontStyle: this.createFontStyle(0.03, '#000000', 'center', 0.35),
                buttonFontStyle: this.createFontStyle(0.04, '#ffffff', 'center', 0),
                dialogueFontStyle: this.createFontStyle(0.04, '#000000', 'center', 0)
        };
        this.baseInventoryStyles = {
            inventoryWordStyle: this.createFontStyle(0.03, '#ffffff', 'center', 0),
            inventoryQuantityStyle: this.createFontStyle(0.03, '#000000', 'center', 0.4)
        };
        this.recipeBookStyles = {
            recipeHeader1Style: this.createFontStyle(0.03, '#000080', 'center', 0),
            recipeHeader2Style: this.createFontStyle(0.03, '#000000', 'left', 0),
            recipeHeader3Style: this.createFontStyle(0.03, '#000000', 'left', 0),
            recipeHeader4Style: this.createFontStyle(0.03, '#000000', 'left', 0),

        };  
        // console.log(this.scene.game.global.baseSceneGenericStyles);
    }
    
    
}