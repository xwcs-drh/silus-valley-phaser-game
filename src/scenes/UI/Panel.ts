import { Scene, GameObjects, Game } from 'phaser';
import { titleText, buttonStyle } from './TextStyles'

export class WoodFrameButton extends GameObjects.Container {
    panel: WoodFrame
    panelText: GameObjects.Text
    hitbox: Phaser.Geom.Rectangle
    callback: Function

    constructor (
        scene: Scene,
        x: number = 100,
        y: number = 100,
        width: number = 400,
        height: number = 200,
        text: string,
        callback: {(): void}
    ) {
        super(scene, x, y, [])
        this.panel = new WoodFrame(scene, 0, 0, width, height)
        this.panelText = scene.make.text(
                {x: 0,
                y: 0,
                text: text,
                origin: { x: 0.5, y: 0.5 },
                style: buttonStyle
            }
        )

        this.hitbox = scene.add.rectangle(0, 0, width, height).setOrigin(0.5, 0.5)
        this.add([this.panel, this.panelText, this.hitbox])
        
        this.setSize(width, height)
        this.setInteractive(
            {
                useHandCursor: true
            }
        )
        this.on('pointerdown', callback)

    }
}

export class WoodFrameTextPanel extends GameObjects.Container {
    panel: woodFrame
    panelText: GameObjects.Text

    constructor (
        scene: Scene,
        x: number = 100,
        y: number = 100,
        width: number = 400,
        height: number = 200,
        text: string,
    ) {
        super(scene, x, y, [])
        this.panel = new WoodFrame(scene, 0, 0, width, height)
        this.panelText = scene.make.text(
                {x: 0,
                y: 0,
                text: text,
                origin: { x: 0.5, y: 0.5 },
                style: buttonStyle
            }
        )

        this.add([this.panel, this.panelText])
    }
}

export class WoodFrame extends GameObjects.NineSlice {

    constructor (
        scene: Scene,
        x: number = 100,
        y: number = 100,
        width: number = 400,
        height: number = 200,
        ) {
        super(scene, x, y, 'wood-frame', undefined, width, height, 32, 32, 32, 32)
    }
}
export class WoodFrameTextSequence extends GameObjects.Container {
    textSequence: Array<Object>
    textArea: GameObjects.Text
    textPanel: WoodFrame
    nextButton: WoodFrameButton
    prevButton: WoodFrameButton

    constructor (
        scene: Scene,
        textSequenceKey: String,
        x: number = 100,
        y: number = 100,
        width: number = 600,
        height: number = 400
    ) {

        super(scene, x, y, [])
        this.setSize(width, height)
        this.textPanel =  new WoodFrame(scene, 0, 0, width, height);
        this.textPanel.setOrigin(0, 0);
        
        let textArea = scene.make.text(
            {x: width / 2,
            y: height / 2,
            text: "yo",
            origin: {x: 0.5, y: 0.5}// {x: 0.5, y: 0.5 }
            }
        )
        this.textArea = textArea

        this.nextButton = new WoodFrameButton(
            scene,
            0,
            height - 25,
            0,
            30,
            "next",
            () => this.nextText
        )


        console.log(this.nextButton)

        this.add([this.textPanel, this.textArea, this.nextButton])


        const textSequence = scene.cache.json.get(textSequenceKey);
        this.textSequence = textSequence;

        console.log(textSequence['sequence'])


        this.textArea.setText("changed!")
    };

    nextText () {
        console.log(this.textSequence)
        console.log("next")
    }

}