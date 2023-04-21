import { Network } from "./domain/entity/Network";

const network = Network.initWithRandomWeights([2, 2, 2]);
var inputs = [[1, 0], [0, 0]]
var expectedOutputs = [[0, 1], [1, 1]]
for (let iteration = 0; iteration < inputs.length; iteration++) {
    var output = network.calculate(inputs[iteration]);
    console.log("======= Iteration #" + iteration + " =======");
    console.log("Inputs: " + inputs[iteration]);
    console.log("Got Outputs: " + output);
    console.log("Expected Outputs: " + expectedOutputs[iteration]);
}