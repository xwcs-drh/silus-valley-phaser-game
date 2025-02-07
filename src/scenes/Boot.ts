import { Scene } from 'phaser';
// import { UI } from 'phaser3-rex-plugins';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        this.load.image('window-bg', 'assets/img/ui/yellow_wash_background.jpg')
        this.load.image('background', 'assets/img/ui/silu_valley_fun.jpg')
        // this.load.scenePlugin('rexuiplugin', )
    }

    create ()
    {
        this.scene.start('Preloader')
    }
}
