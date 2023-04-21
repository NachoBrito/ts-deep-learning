import { ActivationFunction } from "../service/ActivationFunction";
import { SigmoidActivationFunction } from "../service/SigmoidActivationFunction";
import { Node } from "./Node";

export class Network {

    constructor(
        readonly layers: Node[][],
        readonly activationFunction: ActivationFunction) { }


    /**
     * Creates a Neural Network initialized with random weights
     * 
     * @param layerSizes array with layer sizes
     * @param activationFunction activation function (defaults to sigmoid)
     * @returns Network
     */
    public static initWithRandomWeights(layerSizes: number[], activationFunction: ActivationFunction = new SigmoidActivationFunction()): Network {
        let layers: Node[][] = []
        for (let i = 0; i < layerSizes.length; i++) {
            layers[i] = [];
            let layerSize = layerSizes[i];
            let weightsSize = i == 0 ? layerSize : layerSizes[i - 1];
            for (let j = 0; j < layerSize; j++) {
                let weights = Array.from({ length: weightsSize }, () => i == 0 ? 1 : Math.random());
                layers[i][j] = new Node(i, j, 0, weights, activationFunction);
            }
        }

        return new Network(layers, activationFunction);
    }

    /**
     * 
     * @param input number[]
     * @returns result number[]
     */
    public calculate(input: number[]): number[] {
        if (input.length !== this.layers[0].length) {
            throw (`Input size (${input.length}) doesn't match first layer size (${this.layers[0].length})`);
        }
        for (let layer of this.layers) {
            input = this.calculateLayer(input, layer);
        }
        return input;
    }

    private calculateLayer(input: number[], layer: Node[]): number[] {
        let result = []
        for (let node of layer) {
            result.push(node.calculate(input));
        }
        return result;
    }
}