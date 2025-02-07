import { Scene, GameObjects } from 'phaser';
import { titleText } from './ui/TextStyles';
import { Menu, Buttons, TextBox, RoundRectangle, CustomShapes, Sizer } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import { UIPlugin } from 'phaser3-rex-plugins/templates/ui/ui-plugin'

export class MainMenu extends Scene
{
    rexUI: UIPlugin;
    background: GameObjects.Image;
    title: GameObjects.Container;
    menu: Menu;
    rect1: RoundRectangle;

    constructor ()
    {
        super('MainMenu');
    }
   
    create ()
    {
        this.background = this.add.image(500, 500, 'background');
        
        const title_frame = this.add.nineslice(
            0, 0, 'frame-texture', 0, this.game.canvas.width * .7, 100, 100, 200, 300
        )
        const start = this.add.nineslice(this.game.canvas.width * .2, this.game.canvas.width * .2, )
        const title_text = this.add.text(0, 0, "Sil̓ə’s Valley\nθe̓yqʷt'", titleText)

        this.title = this.add.container(this.game.canvas.width / 2, 80,
            [title_frame, title_text])

        const credits = this.add.rectangle(this.game.canvas.width * .5, 500, 200, 200, 0xeeeeee)
        credits.setInteractive();
        credits.on('pointerup', () => {
            this.scene.run('Credits');
            this.scene.bringToTop('Credits');


        start.setInteractive();
        rect.on('pointerup', () =>
        )
    })
    }
}

export class Credits extends Scene
{
    text: GameObjects.Text

    constructor ()
    {
        super('Credits');
    }

    preload() {
        this.load.json('credits-text', 'assets/data/credits.json')
    }

    create ()
    {

        const rect = this.add.rectangle(0, 0, 400, 400, 0x999999)
        const credits = this.cache.json.get('credits-text');
        const creditsContainer = new GameObjects.Container(
            this, this.game.canvas.width *.8, 600, [rect])

        credits.forEach((category: object, i: int) => {
            creditsContainer.add(this.add.text(0, i * 20, category['category']))
    })
        this.add.existing(creditsContainer)

        rect.setInteractive();
        rect.on('pointerup', () => {
            this.scene.stop()
        })

    }
}
