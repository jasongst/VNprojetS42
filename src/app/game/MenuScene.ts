import PlatformerScene from './PlatformerScene';

export default class MenuScene extends Phaser.Scene {
    preload() {
        this.load.image('screen', '../assets/images/menu.png');
        this.load.image('jouer', '../assets/images/jouerbutton.png');
        this.load.image('credits', '../assets/images/creditsbutton.png');
    }
    create() {
        this.add.image(0, 0, 'screen').setOrigin(0).setDepth(0);
        const playbutton = this.add.image(this.game.config.width/2, this.game.config.height/2, "jouer").setDepth(1);
        const creditbutton = this.add.image(this.game.config.width/2, this.game.config.height/2 + this.game.config.height/5 , "credits")
            .setDepth(1);

        playbutton.setInteractive();

        playbutton.on('pointerover', (pointer) => {
            playbutton.setScale(1.5, 1.5);
        });

        playbutton.on('pointerout', (pointer) => {
            playbutton.setScale(1, 1);
        });

        creditbutton.setInteractive();

        creditbutton.on('pointerover', (pointer) => {
            creditbutton.setScale(1.5, 1.5);
        });

        creditbutton.on('pointerout', (pointer) => {
            creditbutton.setScale(1, 1);
        });

        playbutton.on('pointerup', (pointer) => {
            this.scene.start('platformerScene');
        }, this);

    }
    update() {

    }
}