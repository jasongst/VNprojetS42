export default class CreditScene extends Phaser.Scene {
    jason;
    thomas;
    alex;
    matthias;
    naim;
    constructor() {
        super('credit');
    }
    preload() {
        this.load.image('credit', '../assets/images/credit.png');

        this.load.spritesheet(
            "Jason",
            "../../assets/spritesheets/hedge.png",
            {
                frameWidth: 39,
                frameHeight: 50,
                margin: 0,
            }
        );
        this.load.spritesheet(
            "Thomas",
            "../../assets/spritesheets/Archer.png",
            {
                frameWidth: 430,
                frameHeight: 475,
                margin: 0,
            }
        );
        this.load.spritesheet(
            "Alex",
            "../../assets/spritesheets/Ninja.png",
            {
                frameWidth: 250,
                frameHeight: 340,
                margin: 0,
            }
        );
        this.load.spritesheet(
            "Naim",
            "../../assets/spritesheets/IceWizard.png",
            {
                frameWidth: 540,
                frameHeight: 475,
                margin: 0,
            }
        );
        this.load.spritesheet(
            "Matthias",
            "../../assets/spritesheets/SamuraiLight.png",
            {
                frameWidth: 250,
                frameHeight: 340,
                margin: 0,
            }
        );

    }

    create() {
        this.add.image(0, 0, 'credit').setOrigin(0).setDepth(0);
        this.jason = this.add.sprite(80, this.game.config.height as number - 140, "Jason");
        this.jason.setScale(1);
        this.thomas = this.add.sprite(200, this.game.config.height as number - 100, "Thomas");
        this.thomas.setScale(0.35);
        this.alex = this.add.sprite(this.game.config.width as number/2, this.game.config.height as number - 140, "Alex");
        this.alex.setScale(0.45);
        this.naim = this.add.sprite(this.game.config.width as number - 300, this.game.config.height as number - 110, "Naim");
        this.naim.setScale(0.4);
        this.matthias = this.add.sprite(this.game.config.width as number - 100, this.game.config.height as number - 140, "Matthias");
        this.matthias.setScale(0.45);

        this.anims.create({
            key: "jason-idle",
            frames: this.anims.generateFrameNumbers("Jason", { start: 0, end: 4 }),
            frameRate: 3,
            repeat: -1
        });
        this.jason.play("jason-idle")
    }

    update() {

    }
}