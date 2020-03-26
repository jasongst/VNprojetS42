import { Component, OnInit } from '@angular/core';

import Phaser from 'phaser';
import PlatformerScene from './PlatformerScene';
import MenuScene from './MenuScene';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  phaserGame: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;
  constructor() {
    this.config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: "gameContainer",
      scene: [MenuScene, PlatformerScene],
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y : 1000}
        }
      }
    };
  }

  ngOnInit() {
    this.phaserGame = new Phaser.Game(this.config);
  }
}
