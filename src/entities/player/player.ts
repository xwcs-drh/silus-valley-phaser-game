import { GameObjects, Types, Scene, Input, Loader, Math, Physics } from 'phaser'
import { NavMesh } from 'phaser-navmesh';
import { Map } from '/src/entities/map/map.ts';

interface Controls {
    up: Phaser.Input.Keyboard.Key
    down: Phaser.Input.Keyboard.Key
    left: Phaser.Input.Keyboard.Key
    right: Phaser.Input.Keyboard.Key
    pointer: Phaser.Input.Pointer
}

interface Path {
    [index: number]: {type: any; x: number; y: number}
}



export class Player extends GameObjects.Group
{
    sprite: Physics.Arcade.Sprite;
    spritesheet: Types.Loader.FileTypes.SpriteSheetFileConfig
    controls: Controls
    path: Path
    destination: Math.Vector2
    lastDistance: number
    debugText: GameObjects.Text
    
    constructor (scene: Map) {
        super(scene);
        this.spritesheet = {
            key: 'player',
            url: 'assets/sprites/player.png',
            frameConfig: {
                frameWidth: 32, frameHeight: 32
            }
        }
        // console.log(this.cursors)
    };

    createSprite(scene: Scene, x: number = 200, y: number = 200): GameObjects.Sprite {
        this.sprite = new Physics.Arcade.Sprite(
            this.scene,
            x,
            y,
            'player',
            0
        )
        scene.add.existing(this.sprite)
        scene.physics.add.existing(this.sprite)
        scene.children.add(this.sprite)
        this.sprite.setCollideWorldBounds(true)
        const cursors = scene.input.keyboard.createCursorKeys();
        const pointer = {pointer: scene.input.activePointer}
        this.controls = { ...cursors, ...pointer}
    };

    cursorControlUpdate(scene: Scene) {
        if (this.destination) {
            return
        }
            this.sprite.setVelocity(0);
        if (this.controls.up.isDown)
        {
            this.sprite.setVelocityY(-125)
            this.sprite.setFrame(1)
        } else if (this.controls.down.isDown)
        {
            this.sprite.setVelocityY(125)
            this.sprite.setFrame(0)
        };

        if (this.controls.left.isDown)
        {
            this.sprite.setVelocityX(-125)
            this.sprite.setFrame(2)
        };
        if (this.controls.right.isDown)
        {
            this.sprite.setVelocityX(125)
            this.sprite.setFrame(3)
        }
    }

    spriteFacingUpdate(scene: Scene) {
        const XVel = this.sprite.body.velocity['x']
        const YVel = this.sprite.body.velocity['y']
        if (XVel == 0 && YVel == 0) {
            return
        } else if (this.sprite.body.deltaAbsY() > this.sprite.body.deltaAbsX()) {
            if (YVel < 0) {
                this.sprite.setFrame(1)
            } else if (YVel > 0) {
                this.sprite.setFrame(0)
            }
        } else {
            if (XVel < 0) {
                this.sprite.setFrame(2)
            } else {
                this.sprite.setFrame(3)
            }
        }

    }

    pointerControlUpdate(scene: Scene, navMesh: NavMesh) {

        if (this.destination) {

            const distance = (
                Math.Distance.Between(
                    this.sprite["x"], this.sprite["y"],
                    this.destination["x"], this.destination["y"]))
            
            // check if something has gone wrong with the pathing; update  dsetination if needed
            if (this.lastDistance >= distance) {
                this.path = navMesh.findPath(
                    { x: this.sprite["x"], y: this.sprite["y"] },
                    { x: this.destination["x"], y: this.destination["y"] }
                )
            } else if (distance < 10) {
                this.destination = this.path.shift()
                if (!this.destination) {
                    this.sprite.setVelocity(0, 0)
                } else {
                    scene.physics.moveTo(this.sprite,
                        this.destination["x"],
                        this.destination["y"], 150
                    )
                }
            }
        }

        if (this.controls.pointer.isDown) {
            const position = this.controls.pointer.positionToCamera(scene.cameras.main)
            // console.log(position)
            const path = navMesh.findPath(
                { x: this.sprite["x"], y: this.sprite["y"] }, { x: position["x"], y: position["y"]})
            if (path == null) { return }
            // navMesh.debugDrawPath(path)
            this.path = path.slice(1)
            this.destination = path[1]

            console.log(this.destination)
            scene.physics.moveTo(this.sprite,
                this.destination["x"],
                this.destination["y"], 150)
            
            };
        }

    debug(scene: Scene) {
        if (this.debugText) {
            this.debugText.destroy()
        }
        if (this.path) {
            const debugString = JSON.stringify(this.path, undefined, "\n")

            for (const [key, value] of Object.entries(this.path)) {
                console.log(JSON.stringify(value, undefined, " "))
            }
            this.debugText = new GameObjects.Text(scene, 300, 100, debugString, {fontSize: "12pt"})
        }
        scene.add.existing(this.debugText)
        // }
        // this.debugText = scene.add.text(400, 100, "hi")
        // // // this.debugText = 
        // console.log(String(this.path))
        // console.log(this.debug)
        // const sceneDebug = scene.add.text(400, 200, this.path)
    }
    }
