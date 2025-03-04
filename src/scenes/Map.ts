import { Scene, Tilemaps, Input } from 'phaser';
import { Player } from '/src/entities/player/player.ts';
import { HUD } from '/src/scenes/ui/UI.ts';
import { PhaserNavMeshPlugin } from "phaser-navmesh";

export class Map extends Scene
{
    player = Player
    controls = Input
    hud = HUD
    navMesh = PhaserNavMeshPlugin

    constructor ()
    {
        super('Map');
        this.player = new Player(this)
    }

    preload ()
    {
        this.load.spritesheet(this.player.spritesheet)
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/silus-valley.tmj')
        this.load.image('tiles', 'assets/tilemaps/tiles/silus-valley.png')
        this.load.json('startSequenceDialogue', 'assets/data/dialogue.json')
    }


    create ()
    {
        
        this.player = new Player(this)
        const tilemap = this.make.tilemap({ key: 'map' })
        const tileset = tilemap.addTilesetImage('silu-valley', 'tiles')
        const background = tilemap.createLayer('background', tileset, 0, 0)
        const foregroundCollision = tilemap.createLayer('foreground-collision', tileset, 0, 0)
        foregroundCollision.setCollisionBetween(0, 1000, true, true)

        this.player.createSprite(this)
        this.physics.add.collider(this.player.sprite, foregroundCollision)
        this.navMesh = this.navMeshPlugin.buildMeshFromTilemap("mesh", tilemap, [foregroundCollision], false, 21)
        console.log(this.navMesh)
        
        this.cameras.main.setBounds(0, 0, tilemap.widthInPixels, tilemap.heightInPixels)
        this.cameras.main.setZoom(1.5)
        this.cameras.main.startFollow(this.player.sprite, true, .5, .5)
        

    }

    update ()
    {
        // this.player.debug(this)
        // this.player.spriteFacingUpdate(this)
        this.player.cursorControlUpdate(this)
        this.player.pointerControlUpdate(this, this.navMesh)
    }
}
