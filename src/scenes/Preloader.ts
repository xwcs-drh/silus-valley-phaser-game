import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        this.add.image(512, 384, 'background');
        this.add.rectangle(500, 384, 468, 32).setStrokeStyle(1, 0xffffff)
        const bar = this.add.rectangle(500-230, 384, 4, 28, 0xffffff);
        this.load.on('progress', (progress: number) => {
            bar.width = 4 + (460 * progress);
    });

    }

    preload ()
    {
        this.load.setPath('assets/');
        this.load.font('Radio-Canada', 'fonts/RadioCanada-VariableFont_wdth,wght.ttf')
        this.load.image('Carl', 'img/ui/Carl.webp')
        this.load.image('frame-texture', 'img/ui/frame.png')
    }

    create ()
    {
        this.scene.start('MainMenu')
    }

}