import LearningRate from "../../value/LearningRate";
import Network from "../../value/Network";
import Node from "../../value/Node";

export class GradientComponents {
    constructor(public bias: number, public weights: number[]) { }
}

export default class NetworkTunner {

    private _gradient: GradientComponents[][] = [];

    constructor(network: Network, private learningRate: LearningRate) {
        for (let i = 0; i < network.layers.length; i++) {
            const layer = network.layers[i];
            this._gradient.push([]);
            for (let j = 0; j < layer.length; j++) {
                const node = layer[j];
                const weightDeltas = new Array<number>(node.weights.length).fill(0);
                this._gradient[i].push(new GradientComponents(0, weightDeltas));
            }
        }
    }

    get deltas(): GradientComponents[][] { return Object.assign([], this._gradient); }

    addGradientComponentBias(layerIndex: number, nodeIndex: number, value: number) {
        this._gradient[layerIndex][nodeIndex].bias += value;
    }

    addGradientComponentWeight(layerIndex: number, nodeIndex: number, weightIndex: number, value: number) {
        this._gradient[layerIndex][nodeIndex].weights[weightIndex] += value;
    }

    apply(network: Network) {
        for (let i = 0; i < network.layers.length; i++) {
            const layer = network.layers[i];
            for (let j = 0; j < layer.length; j++) {
                const node = layer[j];
                const deltas = this._gradient[i][j];
                this.applyNodeChanges(node, deltas);
            }
        }
    }

    private applyNodeChanges(node: Node, gradientComponents: GradientComponents) {
        const biasDiff = gradientComponents.bias * this.learningRate.biasLearningRate;
        node.bias -= biasDiff;
        for (let w = 0; w < node.weights.length; w++) {
            const weightDiff = gradientComponents.weights[w] * this.learningRate.weightsLearningRate;
            node.weights[w] -= weightDiff;
        }
    }
}