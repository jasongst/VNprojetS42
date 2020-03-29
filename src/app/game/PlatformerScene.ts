import Player from './Player';
import Ennemy from './Ennemy';
import MouseTileMarker from './MouseTileMarker';
import { debug } from 'util';

export default class PlatformerScene extends Phaser.Scene {
    groundLayer;
    public player;
    coinGroup;
    marker;
    coinMap;
    portalPos;


    portal;
    background;
    middleground;

    textCoin;
    textBlock;
    imageCoin;
    imageBlock;

    demence;
    lastDemenceUp;

    horseGroup;
    horsePos;

    constructor() {
        super('Level1');
        this.coinMap = [[80, 410], [955, 100], [700, 410]];
        this.portalPos = [1100, 260];
        this.horsePos = [575, 260];
        this.lastDemenceUp = 0;
    }
    preload() {
        this.load.spritesheet(
            "player",
            "../../assets/spritesheets/furry_jump.png",
            {
                frameWidth: 256,
                frameHeight: 256,
                margin: 0,
            }
        );
        this.load.image("spike", "../assets/images/0x72-industrial-spike.png");
        this.load.image("tiles", "../assets/tilesets/tilesets.png");
        this.load.image("coin", "../../assets/coin.png");

        this.load.spritesheet(
            "portal",
            "../../assets/portail.png",
            {
                frameWidth: 128,
                frameHeight: 130,
                margin: 0,
            }
        );

        this.load.image('background', '../../assets/images/background.png');
        this.load.image('middleground', '../../assets/images/middleground.png');

        this.load.tilemapTiledJSON("map", "../../assets/tilemaps/platformer-deux.json");

        this.load.image("block", "../../assets/quartz.png");

        this.load.image("demence", "../../assets/demence.png");

        this.load.spritesheet(
            "horse",
            "../../assets/spritesheets/horse.png",
            {
                frameWidth: 144,
                frameHeight: 96,
                margin: 0,
            }
        );
    }

    create() {

        this.background = this.add.tileSprite(0, 0, this.game.config.width as number, this.game.config.height as number, 'background');
        this.middleground = this.add.tileSprite(0, 0, this.game.config.width as number, this.game.config.height as number, 'middleground');
        this.middleground.setOrigin(0, 0);
        this.middleground.setScrollFactor(0);
        this.background.setOrigin(0, 0);
        this.background.setScrollFactor(0);


        const map = this.make.tilemap({ key: "map" });
        const tiles = map.addTilesetImage("tileset", "tiles");

        map.createDynamicLayer("Background", tiles);
        this.groundLayer = map.createDynamicLayer("Ground", tiles);
        const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point") as any;
        this.player = new Player(this, spawnPoint.x, spawnPoint.y, 10);


        this.coinGroup = this.physics.add.staticGroup();

        this.coinMap.forEach((element) => {
            let tmp = this.coinGroup.create(element[0], element[1], "coin");
            tmp.setSize(0.1, 0.1);
            tmp.scale = 0.05;
        }
        );

        this.groundLayer.setCollisionByProperty({ collides: true });
        this.physics.world.addCollider(this.player.sprite, this.groundLayer);

        this.cameras.main.startFollow(this.player.sprite);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.marker = new MouseTileMarker(this, map);

        var light = this.lights.addLight(500, 250, 200);
        this.lights.enable().setAmbientColor(0x555555);

        const anims = this.anims;

        this.portal = this.physics.add.sprite(this.portalPos[0], this.portalPos[1], "portal");
        anims.create({
            key: "walk",
            frames: anims.generateFrameNumbers("portal", { start: 10, end: 30 }),
            frameRate: 12,
            repeat: -1
        });
        this.portal.anims.load('walk');
        this.portal.anims.play("walk", true);
        this.portal.body.allowGravity = false;
        this.portal.setSize(80, 90);

        this.add
            .text(16, 100, "Utilise les flèches pour te déplacer \n Pour poser des blocs, utilise le clic gauche", {
                font: "16px monospace",
                fill: "#ffffff",
                padding: { x: 20, y: 10 },
            });

        this.imageCoin = this.add.image(100, 100, "coin");
        this.imageCoin.scale = 0.05;
        this.imageCoin.setScrollFactor(0);

        this.textCoin = this.add.text(130, 90, "0/" + this.coinMap.length, {
            font: "24px monospace",
            fill: "#ffffff",
        }).setScrollFactor(0);

        this.imageBlock = this.add.image(this.game.config.width as number - 100, 100, "block").setScrollFactor(0);
        this.imageBlock.scale = 0.1;

        this.textBlock = this.add.text(this.game.config.width as number - 150, 90, this.player.nbTile, {
            font: "24px monospace",
            fill: "#ffffff",
        }).setScrollFactor(0);

        this.demence = this.add.sprite(220, 100, 'demence');
        this.demence.setScrollFactor(0);
        this.demence.scaleX = 0.0;
        this.demence.scaleY = 0.02;
        this.demence.setOrigin(0, 0.5);



        this.horseGroup = this.physics.add.staticGroup();
        this.horsePos.forEach((element) => {
            let tmp = this.horseGroup.create(element[0], element[1], "horse");
            tmp.allowGravity = false;
            tmp.flipX = true;
            tmp.originX = 0.5;
            tmp.setScale(0.5);
            tmp.setSize(50, 50);
            tmp.x -= 20;
            tmp.y -= 30;
            console.log(tmp);
        }
        );
    }

    update(time, delta) {
        if (this.lastDemenceUp + 1000 < Date.now()) {
            if (this.demence.scaleX < 0.5) {
                this.demence.scaleX += 0.01;
                this.lastDemenceUp = Date.now();
            }
            else this.player.loose2();
        }

        this.middleground.tilePositionX = this.cameras.main.scrollX * 0.2;
        this.background.tilePositionX = this.cameras.main.scrollX * 0.1;

        this.marker.update();
        this.player.update();   

        this.draw();

        this.physics.world.overlap(this.player.sprite, this.coinGroup, this.player.addCoin, null, this);



        this.physics.world.overlap(this.player.sprite, this.portal, this.player.win, null, this);      
    }

    draw() {
        const pointer = this.input.activePointer;
        const worldPoint = pointer.positionToCamera(this.cameras.main) as any;
        if (pointer.isDown && this.player.nbTile > 0 && this.marker.canDraw) {
            this.marker.canDraw = false;
            this.player.nbTile--;
            this.textBlock.setText(this.player.nbTile);
            const tile = this.groundLayer.putTileAtWorldXY(166, worldPoint.x, worldPoint.y);
            tile.setCollision(true);
        }
        else if (!pointer.isDown)
            this.marker.canDraw = true;
    }

}
