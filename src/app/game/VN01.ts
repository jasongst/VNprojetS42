export default class VN01 extends Phaser.Scene {

    constructor() {
        super('VN01');
    }
    preload() {
        this.load.image('background', '../../assets/backgrounds/bar.jpg');
    }

    create() {
        this.add.sprite(500,500,'background');

    }

    update(time, delta) {

    }

}
