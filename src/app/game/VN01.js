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
var VN01 = /** @class */ (function (_super) {
    __extends(VN01, _super);
    function VN01() {
        return _super.call(this, 'VN01') || this;
    }
    VN01.prototype.preload = function () {
        this.load.image('background', '../../assets/backgrounds/bar.jpg');
    };
    VN01.prototype.create = function () {
        this.add.sprite(500, 500, 'background');
    };
    VN01.prototype.update = function (time, delta) {
    };
    return VN01;
}(Phaser.Scene));
exports.default = VN01;
//# sourceMappingURL=VN01.js.map