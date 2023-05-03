import Network from "../../value/Network";
import Node from "../../value/Node";
import CostFunction from "../cost/CostFunction";
import NetworkTunner from "./NetworkTunner";

export default class BackPropagation {


    private readonly _costRespectActivationCache: number[][];
    private _totalCost: number = 0;
    /**
     * 
     * @param network 
     * @param expectedResult 
     * @param costFunction 
     */
    constructor(readonly network: Network, readonly expectedResult: number[], readonly costFunction: CostFunction) {
        this._costRespectActivationCache = [];
        this.initPartialResults();
    }

    private initPartialResults() {
        for (let i = 0; i < this.network.layers.length; i++) {
            this._costRespectActivationCache[i] = new Array<number>(this.network.layers[i].length).fill(0);
        }
    }

    calculate(tunner: NetworkTunner) {
        const layerCount = this.network.layers.length;
        for (let layerIndex = layerCount - 1; layerIndex >= 0; layerIndex--) {
            const layer = this.network.layers[layerIndex];
            for (let nodeIndex = 0; nodeIndex < layer.length; nodeIndex++) {
                const node = layer[nodeIndex];
                this.calculateForNode(node, tunner);
            }
        }
    }

    private calculateForNode(node: Node, tunner: NetworkTunner) {

        if (node.layer == this.network.layers.length - 1) {
            const actualResult = node.activation;
            const expectedResult = this.expectedResult[node.index];
            this._totalCost += this.costFunction.calculate(actualResult, expectedResult);

            const costRespectActivation = this.costFunction.calculateFirstDerivative(node.activation, expectedResult);
            this.saveCostRespectActivation(node.layer, node.index, costRespectActivation);
        }

        const zRespectBias = 1;
        const activityRespectZ = this.network.activationFunction.calculateFirstDerivative(node.zValue);
        const costRespectActivation = this._costRespectActivationCache[node.layer][node.index];
        const costRespectBias = costRespectActivation * activityRespectZ * zRespectBias;
        tunner.addGradientComponentBias(node.layer, node.index, costRespectBias);

        for (let w = 0; w < node.weights.length; w++) {
            const zRespectWeight = this.network.calculateDerivativeOfInputRespectWeight(node.layer, node.index, w);
            const costRespectWeight = costRespectActivation * activityRespectZ * zRespectWeight;
            tunner.addGradientComponentWeight(node.layer, node.index, w, costRespectWeight);
            if (node.layer > 0) {
                const zRespectPreviousActivation = this.network.calculateDerivativeOfZRespectPrevActivation(node.layer, node.index, w);
                const costRespectPreviousActivation = costRespectActivation * activityRespectZ * zRespectPreviousActivation;
                this.saveCostRespectActivation(node.layer - 1, w, costRespectPreviousActivation);
            }
        }
    }

    saveCostRespectActivation(layerIndex: number, nodeIndex: number, result: number): void {
        this._costRespectActivationCache[layerIndex][nodeIndex] += result;
    }

    get costRespectActivationCache(): number[][] { return Object.assign([], this._costRespectActivationCache); }
    get totalCost(): number { return this._totalCost; }


}