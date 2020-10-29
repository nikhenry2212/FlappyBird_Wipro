import Images from './Images.js';
import Utils from './Utils.js';

export default class Pipe{
  constructor(){
    this.x = 600;
    this.y = Utils.randomIntFromRange(500 -320, (500 -320)+180);
    this.w = 52;
    this.h = 320;
    this.sprites = [Images.ImgPipeGreen, Images.ImgPipeRed];
    this.spriteActive = 0;
    this.mirror = false;
  }
}