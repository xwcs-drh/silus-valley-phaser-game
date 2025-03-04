import { Scene, GameObjects } from 'phaser';
import { WoodFrameButton, WoodFrameTextPanel, WoodFrameTextSequence } from './ui/Panel'
// import { titleText, buttonStyle } from './ui/TextStyles';
// import { Menu, Buttons, TextBox, RoundRectangle, CustomShapes, Sizer } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import { UIPlugin } from 'phaser3-rex-plugins/templates/ui/ui-plugin'

function test (): void {
    console.log("clicked :)")
}

export class MainMenu extends Scene
{
    rexUI: UIPlugin;
    background: GameObjects.Image;
    title: GameObjects.Container;
    credits: GameObjects.Container;
    menu: Menu;


    constructor ()
    {
        super('MainMenu');

    }
    preload () {
    }
   
    create ()
    {
        this.scene.start('Introduction')
        this.background = this.add.image(500, 500, 'background');

        const startButton = new WoodFrameButton(
            this, 150, 150, 150, 100, "Start", () => this.scene.start('Map'))

        const textPanel = new WoodFrameTextPanel(this, 550, 150, 450, 200, "sil̕ə valley")

        this.add.existing(textPanel)
        this.add.existing(startButton)
    }
}

export class Introduction extends Scene
{
    constructor ()
    {
        super('Introduction');
    }

    preload () {
    }
    create ()
    {
        const startButton = new WoodFrameButton(
            this, 150, 400, 150, 100, "Start", () => this.scene.start('Map'));
        this.add.existing(startButton);

        const openingTextSequence = new WoodFrameTextSequence(
            this, 'dialogue', 50, 50, 700, 250
        )
        this.add.existing(openingTextSequence)
    }

}