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

    ennemyGroup;
    ennemyPos;
    portal;
    background;
    middleground;
    frontground;

    textCoin;
    textBlock;
    imageCoin;
    imageBlock;

    demence;
    lastDemenceUp;


    constructor() {
        super('Level3');
        this.coinMap = [[550, 155], [920, 300], [550, 555]];
        this.portalPos = [1125, 230];
        this.ennemyPos = [[100, 800]];
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
        this.load.image("tiles2", "../assets/tilesets/tileset.png");
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

        this.load.image('background', '../../assets/images/bg-1.png');
        this.load.image('middleground', '../../assets/images/bg-2.png');
        this.load.image('frontground', '../../assets/images/bg-3.png');

        this.load.tilemapTiledJSON("map3", "../../assets/tilemaps/level-trois.json");

        this.load.image("block", "../../assets/quartz.png");

        this.load.image("demence", "../../assets/demence.png");

        this.load.spritesheet(
            "fireSkull",
            "../../assets/spritesheets/fire-skull.png",
            {
                frameWidth: 96,
                frameHeight: 112,
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
        this.frontground = this.add.tileSprite(0, 0, this.game.config.width as number, this.game.config.height as number, 'frontground');
        this.frontground.setOrigin(0, 0);
        this.frontground.setScrollFactor(0);


        const map = this.make.tilemap({ key: "map3" });
        const tiles = map.addTilesetImage("tileset", "tiles2");

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

        this.ennemyGroup = this.physics.add.staticGroup();
        this.ennemyPos.forEach((element) => {
                let tmp = this.ennemyGroup.create(element[0], element[1], "fireSkull");
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


        this.ennemyGroup.getChildren().forEach(function (enemy) {
            const anims = this.anims;
            anims.create({
                key: "ennemy-run",
                frames: anims.generateFrameNumbers("fireSkull", { start: 0, end: 7 }),
                frameRate: 12,
                repeat: -1
            });
            enemy.anims.play("ennemy-run", true)

        }, this);;

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
    }

    update(time, delta) {
        if (this.lastDemenceUp + 1000 < Date.now()) {
            if (this.demence.scaleX < 0.5) {
                this.demence.scaleX += 0.01;
                this.lastDemenceUp = Date.now();
            }
            else this.player.loose2();
        }


        this.frontground.tilePositionX = this.cameras.main.scrollX * 0.3;
        this.middleground.tilePositionX = this.cameras.main.scrollX * 0.2;
        this.background.tilePositionX = this.cameras.main.scrollX * 0.1;

        this.marker.update();
        this.player.update();

        this.draw();

        this.physics.world.overlap(this.player.sprite, this.coinGroup, this.player.addCoin, null, this);

        this.physics.world.overlap(this.player.sprite, this.portal, this.player.win, null, this);

        this.ennemyGroup.getChildren().forEach(function (enemy) {
            let playerAtTheRight = enemy.body.x < this.player.sprite.x;
            if ((!this.player.lookR && playerAtTheRight) || (this.player.lookR && !playerAtTheRight) ) {
                let speedX = playerAtTheRight ? 1.2 : -1.2;
                let speedY = enemy.body.y > this.player.sprite.y ? -1.2 : 1.2;
                enemy.body.x += speedX;
                enemy.x += speedX;
                enemy.body.y += speedY;
                enemy.y += speedY;
                enemy.flipX = playerAtTheRight;
            }
            else enemy.flipX = !playerAtTheRight;
        }, this);
    }

    draw() {
        const pointer = this.input.activePointer;
        const worldPoint = pointer.positionToCamera(this.cameras.main) as any;
        if (pointer.isDown && this.player.nbTile > 0 && this.marker.canDraw) {
            this.marker.canDraw = false;
            this.player.nbTile--;
            this.textBlock.setText(this.player.nbTile);
            const tile = this.groundLayer.putTileAtWorldXY(109, worldPoint.x, worldPoint.y);
            tile.setCollision(true);
        }
        else if (!pointer.isDown)
            this.marker.canDraw = true;
    }

}
