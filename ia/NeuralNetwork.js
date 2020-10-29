import Matrix from "./Matrix.js";

function sigmoid(x){
  return 1/(1 + Math.exp(-x));
}

function reLU(x){
  return x>=0 ? x : 0;
}

export default class NeuralNetwork {
  constructor(
    i_nodes,
    h_nodes,
    o_nodes,
    learning_rate = 0.25,
    range_weights = 1,
    range_bias = 1
  ) {
    this.i_nodes = i_nodes;
    this.h_nodes = h_nodes;
    this.o_nodes = o_nodes;

    this.bias_ih = new Matrix(this.h_nodes, 1);
    this.bias_ih.randomize(range_bias);

    this.bias_ho = new Matrix(this.o_nodes, 1);
    this.bias_ho.randomize(range_bias);

    this.weights_ih = new Matrix(this.h_nodes, this.i_nodes);
    this.weights_ih.randomize(range_weights);

    this.weights_ho = new Matrix(this.o_nodes, this.h_nodes);
    this.weights_ho.randomize(range_weights);

    this.learning_rate = learning_rate;
  }

  feedfoward(arr, actionFunction=sigmoid){
  let input = Matrix.arrayToMatrix(arr);

  //input >> hidden
  let hidden = Matrix.multiply(this.weights_ih, input);
  hidden = Matrix.add(hidden, this.bias_ih);
  hidden.map(actionFunction);


  //hidden >> output
  let output = Matrix.multiply(this.weights_ho, hidden);
  output = Matrix.add(output, this.bias_ho);
  output.map(actionFunction);
  return output;
}

  predict(arr, actionFunction='sigmoid'){
    let output;
    if(actionFunction === 'sigmoid'){
      output = this.feedfoward(arr,sigmoid);
    }else if(actionFunction === 'reLU'){
      output= this.feedfoward(arr,reLU);
  
    }
   
    output = Matrix.matrixToArray(output);
    return output;
  }
}
