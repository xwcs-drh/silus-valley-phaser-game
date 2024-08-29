import Phaser from 'phaser';
import textStyles from '../ui/TextStyles'

import 'core-js/stable'

export default class TestScene extends Phaser.Scene {
  // init()
  // {
  //   const loadFont = new LoadFont()
  //   loadFont.injectCSS()
  // }

  constructor() {
    super(
      {key: 'TestScene'}
    )
      // console.log('Bootscene: constructor');

      this.progress = 0;
      this.loaded = false;
    }

    // preload() {
    //   this.load
    //   .addFile(new WebFontFile(this.load, 'Radio-Canada'));
    //   // .script('https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont')
    //   // .setPath('assets/fonts/')
    // }

    create() {
      
      const titleTextString = `Sil̓ə’s Valley θe̓yqʷt aaal̕aaa  aaal̓aaa\n `
      const allCharString = 'p p̓ t t̕ k kʷ k̓ʷ q q̓ qʷ q̓ʷ ʔ t̕ᶿ c c̓ č ƛ̓ θ s š ɬ x xʷ x̌ x̌ʷ h m m̓ n n̓ l l̕ y y̓ w w̓ i i: e e: u u: o: a'
      
      this.add.text(50, 50, titleTextString, textStyles.header) // fontSize: '20px',
        // fontFamily: 'Radio Canada' 

      this.add.text(50, 100, allCharString, {
        fontSize: '20px',
        fontFamily: 'Radio Canada'
      })

      // console.log(typeof(textStyles))
      // let ts = Object(textStyles).entries()
      // console.log(ts)

      // stylesArray.forEach(i => 
      //   console.log(i)
      // )
        // this.add.text(50, 150, i.key)
      this.add.text(50, 150, "popupHeader", textStyles.popupHeader)
      this.add.text(50, 175, "popupBody", textStyles.popupBody)
      this.add.text(50, 125, "button text", textStyles.button)

      const testBCSans = this.add.text(50, 200, 'should be in BC Sans', {
        fontSize: '20px',
        fontFamily: 'BC Sans'
      })


      console.log(testBCSans.style)
    }
  }