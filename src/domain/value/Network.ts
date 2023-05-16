
import ActivationFunction from "../service/activation/ActivationFunction";
import SigmoidActivationFunction from "../service/activation/SigmoidActivationFunction";
import Node from "./Node";
import { NoOpFormatter, OutputProcessor } from "./OutputFormatter";

export default class Network {

    private _input: number[] = [];
    private _output: number[] = [];

    constructor(
        readonly layers: Node[][],
        readonly activationFunction: ActivationFunction,
        readonly outputProcessor: OutputProcessor) { }


    static builder(layerSizes: number[]): NetworkBuilder {
        return new NetworkBuilder(layerSizes);
    }

    /**
     * 
     * @param input number[]
     * @returns result number[]
     */
    calculate(input: number[]): number[] {
        this._input = Object.assign([], input);

        if (input.length !== this.layers[0].length) {
            throw (`Input size (${input.length}) doesn't match first layer size (${this.layers[0].length})`);
        }
        for (let layer of this.layers) {
            input = this.calculateLayer(input, layer);
        }

        this._output = input;
        return this._output;
    }


    private calculateLayer(input: number[], layer: Node[]): number[] {
        let result = []
        for (let node of layer) {
            result.push(node.calculate(input));
        }
        return result;
    }

    get processedOutput(): number[] { return this.outputProcessor.format(this._output); }
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
            return this._input[prevNodeIndex];
        }

        if (prevNodeIndex < 0 || prevNodeIndex >= this.layers[layerIndex - 1].length) {
            throw ("Invalid previous node index")
        }
        const prevNode = this.layers[layerIndex - 1][nodeIndex];
        return prevNode ? prevNode.activation : 0.0;
    }

    calculateDerivativeOfZRespectPrevActivation(layerIndex: number, nodeIndex: number, prevNodeIndex: number): number {
        this.validateNodeIndices(layerIndex, nodeIndex);
        if (prevNodeIndex < 0 || prevNodeIndex >= this.layers[layerIndex - 1].length) {
            throw ("Invalid previous node index")
        }
        const node = this.layers[layerIndex][nodeIndex];
        return node.weights[prevNodeIndex];
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

class NetworkBuilder {
    private _weightMin: number = 0.0
    private _weightMax: number = 1.0;
    private _biasMin: number = 0.0;
    private _biasMax: number = 0.0;
    private _activationFunction: ActivationFunction = new SigmoidActivationFunction();
    private _outputProcessor: OutputProcessor = new NoOpFormatter()

    constructor(private layerSizes: number[]) { }

    withWeightLimits(weightMin: number, weightMax: number): NetworkBuilder {
        this._weightMax = weightMax;
        this._weightMin = weightMin;
        return this;
    }

    withBiasLimits(biasMin: number, biasMax: number): NetworkBuilder {
        this._biasMax = biasMax;
        this._biasMin = biasMin;
        return this;
    }

    withActivationFunction(activationFunction: ActivationFunction): NetworkBuilder {
        this._activationFunction = activationFunction;
        return this;
    }

    withOutputProcessor(outputProcessor: OutputProcessor) {
        this._outputProcessor = outputProcessor;
        return this;
    }


    build(): Network {
        let layers: Node[][] = []
        for (let i = 0; i < this.layerSizes.length; i++) {
            layers[i] = [];
            let layerSize = this.layerSizes[i];
            let weightsSize = i == 0 ? layerSize : this.layerSizes[i - 1];
            for (let j = 0; j < layerSize; j++) {
                let weights = Array.from({ length: weightsSize }, () => (Math.random() * (this._weightMax - this._weightMin) + this._weightMin));
                let bias = Math.random() * (this._biasMax - this._biasMin) + this._biasMin;
                layers[i][j] = new Node(i, j, bias, weights, this._activationFunction);
            }
        }

        return new Network(layers, this._activationFunction, this._outputProcessor);
    }
}