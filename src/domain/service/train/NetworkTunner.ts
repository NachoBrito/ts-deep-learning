import LearningRate from "../../value/LearningRate";
import Network from "../../value/Network";
import Node from "../../value/Node";

export class NodeDeltas {
    constructor(public bias: number, public weights: number[]) { }
}

export default class NetworkTunner {

    private _deltas: NodeDeltas[][] = [];

    constructor(network: Network, private learningRate: LearningRate) {
        for (let i = 0; i < network.layers.length; i++) {
            const layer = network.layers[i];
            this._deltas.push([]);
            for (let j = 0; j < layer.length; j++) {
                const node = layer[j];
                const weightDeltas = new Array<number>(node.weights.length).fill(0);
                this._deltas[i].push(new NodeDeltas(0, weightDeltas));
            }
        }
    }

    get deltas(): NodeDeltas[][] { return Object.assign([], this._deltas); }

    addBias(layerIndex: number, nodeIndex: number, value: number) {
        this._deltas[layerIndex][nodeIndex].bias += value;
    }

    addWeight(layerIndex: number, nodeIndex: number, weightIndex: number, value: number) {
        this._deltas[layerIndex][nodeIndex].weights[weightIndex] += value;
    }

    apply(network: Network) {
        for (let i = 0; i < network.layers.length; i++) {
            const layer = network.layers[i];
            for (let j = 0; j < layer.length; j++) {
                const node = layer[j];
                const deltas = this._deltas[i][j];
                this.applyNodeChanges(node, deltas);
            }
        }
    }

    private applyNodeChanges(node: Node, deltas: NodeDeltas) {
        const biasDiff = deltas.bias * this.learningRate.biasLearningRate;
        node.bias -= biasDiff;
        for (let w = 0; w < node.weights.length; w++) {
            const weightDiff = deltas.weights[w] * this.learningRate.weightsLearningRate;
            node.weights[w] -= weightDiff;
        }
    }
}