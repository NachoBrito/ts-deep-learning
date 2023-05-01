
import ActivationFunction from "../service/activation/ActivationFunction";
import SigmoidActivationFunction from "../service/activation/SigmoidActivationFunction";
import Node from "./Node";

export default class Network {
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

    /**
     * The input of the node [nodeIndex] in layer [layerIndex] as a function of the
     * activation of the node [prevNodeIndex] of the previous layer is:
     * z  = sum( weights * prevAcitivites) + bias
     * 
     * Take derivative respect the activation of the node [prevNodeIndex] of the previous
     * layer:
     * z' = weight[prevNodeIndex];
     * @param layerIndex 
     * @param nodeIndex 
     * @param prevNodeIndex 
     * @returns number the value of the derivative
     */
    calculateDerivativeOfInputRespectWeight(layerIndex: number, nodeIndex: number, prevNodeIndex: number): number {
        this.validateNodeIndices(layerIndex, nodeIndex);
        
        if (layerIndex == 0) {
            return 1.0;
        }
        
        if (prevNodeIndex < 0 || prevNodeIndex >= this.layers[layerIndex - 1].length) {
            throw ("Invalid previous node index")
        }
        const prevNode = this.layers[layerIndex - 1][nodeIndex];
        return prevNode.activation;
    }

    calculateDerivativeOfInputRespectPrevActivation(layerIndex: number, nodeIndex: number, prevNodeIndex: number): number {
        if (layerIndex == 0) {
            return 1.0;
        }
        this.validateNodeIndices(layerIndex, nodeIndex);
        if (prevNodeIndex < 0 || prevNodeIndex >= this.layers[layerIndex - 1].length) {
            throw ("Invalid previous node index")
        }
        const prevNode = this.layers[layerIndex - 1][nodeIndex];
        return prevNode.weights[prevNodeIndex];
    }

    private validateNodeIndices(layerIndex: number, nodeIndex: number) {
        if (layerIndex < 0 || layerIndex >= this.layers.length) {
            throw ("Invalid layer index");
        }
        if (nodeIndex < 0 || nodeIndex >= this.layers[layerIndex].length) {
            throw ("Invalid node index");
        }
    }
}