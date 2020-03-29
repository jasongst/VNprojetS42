import Player from './Player';
import MouseTileMarker from './MouseTileMarker';

export default class Level2 extends Phaser.Scene {
    groundLayer;
    public player;
    coinGroup;
    marker;
    coinMap;
    portalPos;
    portal;
    background;
    nbCoin;

    textCoin;
    textBlock;
    imageCoin;
    imageBlock;

    ennemyPos;
    ennemyGroup;

    demence;
    lastDemenceUp;

    constructor() {
        super('Level2');
        this.coinMap = [[65, 35], [900, 500], [700, 40]];
        this.portalPos = [1050, 200];
        this.ennemyPos = [[100, 800]];
        this.nbCoin = 0;
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
        this.load.spritesheet(
            "fireSkull",
            "../../assets/spritesheets/fire-skull.png",
            {
                frameWidth: 96,
                frameHeight: 112,
                margin: 0,
            }
        );
        this.load.image("spike", "../assets/images/0x72-industrial-spike.png");
        this.load.image("tiles2", "../assets/tilesets/tileset2.png");
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

        this.load.image('background', '../../assets/images/test.jpg');

        this.load.tilemapTiledJSON("map2", "../../assets/tilemaps/level-deux.json");

        this.load.image("block", "../../assets/quartz.png");

        this.load.image("demence", "../../assets/demence.png")
    }

    create() {

        this.demence = this.add.sprite(220, 100, 'demence');
        this.demence.setScrollFactor(0);
        this.demence.scaleX = 0.0;
        this.demence.scaleY = 0.02;
        this.demence.setOrigin(0, 0.5);

        this.background = this.add.tileSprite(0, 0, this.game.config.width as number, this.game.config.height as number, 'background');
        this.background.setOrigin(0, 0);
        this.background.setScrollFactor(0);


        const map = this.make.tilemap({ key: "map2" });
        const tiles = map.addTilesetImage("tileset", "tiles2");

        map.createDynamicLayer("Background", tiles);
        map.createDynamicLayer("Foreground", tiles);
        this.groundLayer = map.createDynamicLayer("Ground", tiles);
        const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point") as any
        this.player = new Player(this, spawnPoint.x, spawnPoint.y,15);

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



        let config = {
            key: 'walk',
            frames: this.anims.generateFrameNumbers('portal', { start: 0, end: 25 }),
            frameRate: 6,
            yoyo: false,
            repeat: -1
        };

        let anim = this.anims.create(config);
        this.portal = this.physics.add.sprite(this.portalPos[0], this.portalPos[1], "portal");
        this.portal.anims.load('walk');
        this.portal.anims.play('walk');
        this.portal.body.allowGravity = false;
        this.portal.setSize(80, 90);
        console.log(this.portal);

        this.imageCoin = this.add.image(100, 100, "coin");
        this.imageCoin.scale = 0.05;
        this.imageCoin.setScrollFactor(0);


        this.nbCoin = 0;
        this.textCoin = this.add.text(130, 90, this.nbCoin.toString(), {
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

        this.background.tilePositionX = this.cameras.main.scrollX * 0.1;

        this.marker.update();
        this.player.update();

        this.draw();

        this.physics.world.overlap(this.player.sprite, this.coinGroup, this.player.addCoin, null, this);

        this.physics.world.overlap(this.player.sprite, this.portal, this.player.win, null, this);

        this.physics.world.overlap(this.player.sprite, this.ennemyGroup, this.player.loose, null, this);


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
            const tile = this.groundLayer.putTileAtWorldXY(166, worldPoint.x, worldPoint.y);
            tile.setCollision(true);
        }
        else if (!pointer.isDown)
            this.marker.canDraw = true;
    }

}
