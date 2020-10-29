import Images from "./Images.js";
import Utils from "./Utils.js";
import NeuralNetwork from './ia/NeuralNetwork.js';

export default class Player {
  constructor() {
    this.x = Utils.randomIntFromRange(10, 100);
    this.y = Utils.randomIntFromRange(50, 200);
    this.w = 34;
    this.h = 24;
    this.sprites = [
      [
        Images.ImgBirdBlue,
        Images.ImgBirdBlueUpFlap,
        Images.ImgBirdBlue,
        Images.ImgBirdBlueDownFlap,
      ],
      [
        Images.ImgBirdRed,
        Images.ImgBirdRedUpFlap,
        Images.ImgBirdRed,
        Images.ImgBirdRedDownFlap,
      ],
      [
        Images.ImgBirdYellow,
        Images.ImgBirdYellowUpFlap,
        Images.ImgBirdYellow,
        Images.ImgBirdYellowDownFlap

      ]
    ];
    this.spriteActive = 0;
    this.spriteSelected = Utils.randomIntFromRange(0,2);
    this.dy = 0;
    this.alive = true;
    this.distance = 0;
    this.sensor = {x:0,y:0};
    this.brain = new NeuralNetwork(2,2,1,0,1000,1000);
  }
  jump(power) {
    this.dy = -(power);
  }
}
