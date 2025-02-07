import WebFontLoader from 'webfontloader'
import textStyle = Phaser.Types.GameObjects.Text.TextStyle

export const titleText: textStyle = {
    fontFamily: 'Radio-Canada',
    fontSize: '32px',
    fontStyle: 'bold',
    color: '#333333',
    align: 'center'
}

export const headerStyle: textStyle = {
    fontFamily : 'Radio-Canada',
    fontSize: '16px',
    color: '#222222'
}

// export const headerFont: Phaser
                // headerFontStyle: this.createFontStyle(0.1, '#000080', 'center', 0.5),
                // bodyFontStyle: this.createFontStyle(0.02, '#000000', 'center', 1),
                // popupHeaderFontStyle: this.createFontStyle(0.04, '#000080', 'center', 1),
                // popupBodyFontStyle: this.createFontStyle(0.03, '#000000', 'center', 0.35),
                // buttonFontStyle: this.createFontStyle(0.04, '#ffffff', 'center', 0),
                // dialogueFontStyle: this.createFontStyle(0.04, '#000000', 'center', 0)