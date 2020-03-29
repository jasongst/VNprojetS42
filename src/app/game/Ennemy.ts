import { Data } from "phaser";

export default class Ennemy {
    scene;
    sprite;
    player;
    lookR;
    speed;
    constructor(scene, player, x, y,group) {
        this.scene = scene;
        this.player = player;
        this.lookR = true;
        this.speed = 2;
        this.sprite = scene.physics.add.sprite(x, y, "fireSkull");
        this.sprite.body.allowGravity = false;
        this.sprite.originX = 0.5;
        this.sprite.setScale(0.5);

        const anims = scene.anims;
        anims.create({
            key: "ennemy-run",
            frames: anims.generateFrameNumbers("fireSkull", { start: 0, end: 7 }),
            frameRate: 12,
            repeat: -1
        });
        this.sprite.anims.play("ennemy-run", true);
        this.sprite.body.setSize(80, 100);
        this.sprite.body.offset.y = 15;
        group.add(this.sprite);
    }
    moove() {
        let isOnRight = this.sprite.body.x > this.player.sprite.x
        let isUp = this.sprite.body.y > this.player.sprite.y;
        if (isOnRight) {
            if (!this.lookR)
                this.flip();
            this.sprite.x -= this.speed;
            this.sprite.body.offset.x = 22;
        }
        else {
            if (this.lookR)
                this.flip();
            this.sprite.body.x += this.speed;
            this.sprite.body.offset.x = 100;
        }
        if (isUp)
            this.sprite.body.y -= 1.2;
        else
            this.sprite.body.y += 0.5;
    }

    flip() {
        this.lookR = !this.lookR;
        this.sprite.scaleX *= -1;
    }
}1
