"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Player_1 = require("./Player");
var MouseTileMarker_1 = require("./MouseTileMarker");
var PlatformerScene = /** @class */ (function (_super) {
    __extends(PlatformerScene, _super);
    function PlatformerScene() {
        var _this = _super.call(this, 'Level1') || this;
        _this.coinMap = [[80, 410], [955, 100], [700, 410]];
        _this.portalPos = [1100, 260];
        _this.horsePos = [575, 260];
        _this.lastDemenceUp = 0;
        return _this;
    }
    PlatformerScene.prototype.preload = function () {
        this.load.spritesheet("player", "../../assets/spritesheets/furry_jump.png", {
            frameWidth: 256,
            frameHeight: 256,
            margin: 0,
        });
        this.load.image("spike", "../assets/images/0x72-industrial-spike.png");
        this.load.image("tiles", "../assets/tilesets/tilesets.png");
        this.load.image("coin", "../../assets/coin.png");
        this.load.spritesheet("portal", "../../assets/portail.png", {
            frameWidth: 128,
            frameHeight: 130,
            margin: 0,
        });
        this.load.image('background', '../../assets/images/background.png');
        this.load.image('middleground', '../../assets/images/middleground.png');
        this.load.tilemapTiledJSON("map", "../../assets/tilemaps/platformer-deux.json");
        this.load.image("block", "../../assets/quartz.png");
        this.load.image("demence", "../../assets/demence.png");
        this.load.spritesheet("horse", "../../assets/spritesheets/horse.png", {
            frameWidth: 144,
            frameHeight: 96,
            margin: 0,
        });
    };
    PlatformerScene.prototype.create = function () {
        var _this = this;
        this.background = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background');
        this.middleground = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'middleground');
        this.middleground.setOrigin(0, 0);
        this.middleground.setScrollFactor(0);
        this.background.setOrigin(0, 0);
        this.background.setScrollFactor(0);
        var map = this.make.tilemap({ key: "map" });
        var tiles = map.addTilesetImage("tileset", "tiles");
        map.createDynamicLayer("Background", tiles);
        this.groundLayer = map.createDynamicLayer("Ground", tiles);
        var spawnPoint = map.findObject("Objects", function (obj) { return obj.name === "Spawn Point"; });
        this.player = new Player_1.default(this, spawnPoint.x, spawnPoint.y, 10);
        this.coinGroup = this.physics.add.staticGroup();
        this.coinMap.forEach(function (element) {
            var tmp = _this.coinGroup.create(element[0], element[1], "coin");
            tmp.setSize(0.1, 0.1);
            tmp.scale = 0.05;
        });
        this.groundLayer.setCollisionByProperty({ collides: true });
        this.physics.world.addCollider(this.player.sprite, this.groundLayer);
        this.cameras.main.startFollow(this.player.sprite);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.marker = new MouseTileMarker_1.default(this, map);
        var light = this.lights.addLight(500, 250, 200);
        this.lights.enable().setAmbientColor(0x555555);
        var anims = this.anims;
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
        this.textCoin = this.add.text(130, 90, "0 / " + this.coinMap.length, {
            font: "24px monospace",
            fill: "#ffffff",
        }).setScrollFactor(0);
        this.imageBlock = this.add.image(this.game.config.width - 100, 100, "block").setScrollFactor(0);
        this.imageBlock.scale = 0.1;
        this.textBlock = this.add.text(this.game.config.width - 150, 90, this.player.nbTile, {
            font: "24px monospace",
            fill: "#ffffff",
        }).setScrollFactor(0);
        this.demence = this.add.sprite(220, 100, 'demence');
        this.demence.setScrollFactor(0);
        this.demence.scaleX = 0.0;
        this.demence.scaleY = 0.02;
        this.demence.setOrigin(0, 0.5);
        this.horseGroup = this.physics.add.staticGroup();
        this.horsePos.forEach(function (element) {
            var tmp = _this.horseGroup.create(element[0], element[1], "horse");
            tmp.allowGravity = false;
            tmp.flipX = true;
            tmp.originX = 0.5;
            tmp.setScale(0.5);
            tmp.setSize(50, 50);
            tmp.x -= 20;
            tmp.y -= 30;
            console.log(tmp);
        });
    };
    PlatformerScene.prototype.update = function (time, delta) {
        if (this.lastDemenceUp + 1000 < Date.now()) {
            if (this.demence.scaleX < 0.5) {
                this.demence.scaleX += 0.01;
                this.lastDemenceUp = Date.now();
            }
            else
                this.player.loose2();
        }
        this.middleground.tilePositionX = this.cameras.main.scrollX * 0.2;
        this.background.tilePositionX = this.cameras.main.scrollX * 0.1;
        this.marker.update();
        this.player.update();
        this.draw();
        this.physics.world.overlap(this.player.sprite, this.coinGroup, this.player.addCoin, null, this);
        this.physics.world.overlap(this.player.sprite, this.portal, this.player.win, null, this);
    };
    PlatformerScene.prototype.draw = function () {
        var pointer = this.input.activePointer;
        var worldPoint = pointer.positionToCamera(this.cameras.main);
        if (pointer.isDown && this.player.nbTile > 0 && this.marker.canDraw) {
            this.marker.canDraw = false;
            this.player.nbTile--;
            this.textBlock.setText(this.player.nbTile);
            var tile = this.groundLayer.putTileAtWorldXY(166, worldPoint.x, worldPoint.y);
            tile.setCollision(true);
        }
        else if (!pointer.isDown)
            this.marker.canDraw = true;
    };
    return PlatformerScene;
}(Phaser.Scene));
exports.default = PlatformerScene;
//# sourceMappingURL=PlatformerScene.js.map