import QuadraticCostfunction from "./domain/service/cost/QuadraticCostFunction";
import Network from "./domain/value/Network";

const network = Network.initWithRandomWeights([2, 2, 2]);
let inputs = [[1, 0], [0, 0]]
let expectedOutputs = [[0, 1], [1, 1]]
let cost = new QuadraticCostfunction();

for (let iteration = 0; iteration < inputs.length; iteration++) {
    let output = network.calculate(inputs[iteration]);
    let totalCost = cost.getTotalCost(output, expectedOutputs[iteration])
    console.info(`======= Iteration #${iteration} =======`);
    console.info(`Inputs: ${inputs[iteration]}`);
    console.info(`Got Outputs: ${output}`);
    console.info(`Expected Outputs: ${expectedOutputs[iteration]}`);
    console.info(`Total cost: ${totalCost} `);
    console.info("\n");
}