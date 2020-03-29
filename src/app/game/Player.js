"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Player = /** @class */ (function () {
    function Player(scene, x, y) {
        this.scene = scene;
        this.lookR = true;
        this.nbTile = 10;
        var anims = scene.anims;
        anims.create({
            key: "player-idle",
            frames: anims.generateFrameNumbers("player", { start: 0, end: 3 }),
            frameRate: 3,
            repeat: -1
        });
        anims.create({
            key: "player-run",
            frames: anims.generateFrameNumbers("player", { start: 4, end: 11 }),
            frameRate: 12,
            repeat: -1
        });
        // Create the physics-based sprite that we will move around and animate
        this.sprite = scene.physics.add.sprite(x, y, "player", 0);
        this.sprite.setScale(0.1);
        // Track the arrow keys & WASD
        var _a = Phaser.Input.Keyboard.KeyCodes, LEFT = _a.LEFT, RIGHT = _a.RIGHT, UP = _a.UP, W = _a.W, A = _a.A, D = _a.D;
        this.keys = scene.input.keyboard.addKeys({
            left: LEFT,
            right: RIGHT,
            up: UP,
            w: W,
            a: A,
            d: D
        });
        this.scene.cameras.main.zoomTo(1.2, 2000);
    }
    Player.prototype.update = function () {
        this.moove();
        if (this.sprite.body.position.y > 900)
            this.loose();
    };
    Player.prototype.destroy = function () {
        this.sprite.destroy();
    };
    Player.prototype.flip = function () {
        this.lookR = !this.lookR,
            this.sprite.setFlipX(this.lookR);
    };
    Player.prototype.moove = function () {
        var onGround = this.sprite.body.blocked.down;
        var acceleration = onGround ? 350 : 250;
        if (this.keys.left.isDown) {
            this.sprite.body.velocity.x = -acceleration;
            if (!this.lookR)
                this.flip();
        }
        else if (this.keys.right.isDown) {
            this.sprite.body.velocity.x = acceleration;
            if (this.lookR)
                this.flip();
        }
        else
            this.sprite.body.velocity.x = 0;
        if (onGround && (this.keys.up.isDown || this.keys.w.isDown)) {
            while (this.sprite.body.velocity.y > -400)
                this.sprite.body.velocity.y -= 20;
        }
        this.animeGestion();
    };
    Player.prototype.win = function () {
        if (this.nbCoin == 3) {
            this.scene.start('Level5');
        }
        else {
            this.scene.scene.add
                .text(16, 100, "COLLECTE 3 BLOCS", {
                font: "16px monospace",
                fill: "#ffffff",
                padding: { x: this.scene.portalPos[0], y: this.scene.portalPos[1] },
            });
        }
    };
    Player.prototype.loose = function () {
        this.scene.scene.restart();
    };
    Player.prototype.animeGestion = function () {
        var speed = [this.sprite.body.velocity.x, this.sprite.body.velocity.y];
        if (speed[1] > 0) {
            this.sprite.anims.stop();
            this.sprite.setTexture("player", 12);
        }
        else if (speed[1] < 0) {
            this.sprite.anims.stop();
            this.sprite.setTexture("player", 7);
        }
        else if (speed[0] != 0)
            this.sprite.anims.play("player-run", true);
        else
            this.sprite.anims.play("player-idle", true);
    };
    Player.prototype.addCoin = function (player, coin) {
        coin.disableBody(true, true);
        this.nbCoin++;
        console.log(this.nbCoin);
    };
    return Player;
}());
exports.default = Player;
//# sourceMappingURL=Player.js.map