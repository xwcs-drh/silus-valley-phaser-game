
class TextStyles {
	createFontStyle(fontSize, color, align, strokeThickness) {
    // cast str of font size without 'px' suffix OR an int
    // to str with 'px' suffix
    let fontSizeStr = `${fontSize}`
    if (fontSizeStr.slice(-2) != 'px') {
      fontSizeStr = `${fontSize}px`
    }

    var fontStyle = {
    fontFamily: 'Radio-Canada',
    fontSize: fontSize,
    fill: color,
    align: align,
    stroke: color,
    strokeThickness: strokeThickness,
    // padding: { top: canvasHeight * fontSizePercent, bottom: canvasHeight * fontSizePercent }
		};

		return fontStyle;
	}

  styles = {
    header: this.createFontStyle('80px', '#000080', 'center', 2),
    body: this.createFontStyle('20px', '#000000', 'center', 1),
    popupHeader: this.createFontStyle('20px', '#000080', 'center', 1),
    popupBody: this.createFontStyle('20px', '#000000', 'center', 1),
    button: this.createFontStyle('40px', '#ffffff', 'center', .75),
    dialogue: this.createFontStyle('20px', '#000000', 'center', 0),
  }; 

}

const textStyles = new TextStyles().styles;
export default textStyles;