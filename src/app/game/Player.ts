import { Data } from "phaser";

export default class Player {
    scene;
    public sprite;
    keys;
    lookR;
    public nbTile;
    lastTimeTextAdd = 0;
    constructor(scene, x, y,nbTiles) {
        this.scene = scene;
        this.lookR = true;
        this.nbTile = nbTiles;
        const anims = scene.anims;
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
        this.sprite.body.setSize(135,135);
        this.sprite.body.offset.x = 40;
        this.sprite.body.offset.y = 40;
        // Track the arrow keys & WASD
        const { LEFT, RIGHT, UP, W, A, D } = Phaser.Input.Keyboard.KeyCodes;
        this.keys = scene.input.keyboard.addKeys({
            left: LEFT,
            right: RIGHT,
            up: UP,
            a: A,
            d: D,
        });
        this.scene.cameras.main.zoomTo(1.2, 2000);
    }

    update() {
        this.moove();
        if (this.sprite.body.position.y > 900)
            this.loose2();
    }
      
    flip() {
        this.lookR = !this.lookR,
            this.sprite.setFlipX(this.lookR);
    }
    moove() {
        const onGround = this.sprite.body.blocked.down;
        const acceleration = onGround ? 350 : 250;
        if (this.keys.left.isDown || this.keys.a.isDown) {
            this.sprite.body.velocity.x = -acceleration;
            if (!this.lookR)
                this.flip();
        }
        else if (this.keys.right.isDown || this.keys.d.isDown) {
            this.sprite.body.velocity.x = acceleration;
            if (this.lookR)
                this.flip();
        }
        else
            this.sprite.body.velocity.x = 0;

        if (onGround && (this.keys.up.isDown)) {
            while (this.sprite.body.velocity.y > -400)
                this.sprite.body.velocity.y -= 20;
        }
        this.animeGestion();
    }
    loose2() {
        this.scene.scene.restart();
    }
    win() {
        if (parseInt(this.scene.scene.textCoin.text[0]) == this.scene.scene.coinMap.length) {
            this.scene.start('Level3');
        }
        else {
            console.log(this);
                let t =this.scene.scene.add
                    .text(16, 100, "COLLECTE 3 BLOCS", {
                        font: "16px monospace",
                        fill: "##DC143C",
                        padding: { x: this.scene.scene.portalPos[0] - 80, y: this.scene.scene.portalPos[1]-100 },
                    });
                this.scene.scene.tweens.add({
                    targets: t,
                    alpha: 0,
                    duration: 1000,
                    ease: 'Power2'
                }, this);
            }
        }
    loose() {
        console.log(this);
        console.log("aaa");
        this.scene.restart();
    }
    animeGestion() {
        let speed = [this.sprite.body.velocity.x, this.sprite.body.velocity.y]
        if (speed[1] > 0) {
            this.sprite.anims.stop();
            this.sprite.setTexture("player", 12);
        }
        else if (speed[1] < 0) {
            this.sprite.anims.stop();
            this.sprite.setTexture("player", 7);
        }
        else if (speed[0] != 0)
            this.sprite.anims.play("player-run", true)
        else
            this.sprite.anims.play("player-idle", true);
    }
    public addCoin(player, coin) {
        coin.disableBody(true, true);
        this.scene.scene.textCoin.setText(parseInt(this.scene.scene.textCoin.text[0])+1 + "/" + this.scene.scene.coinMap.length.toString());
    }
}
