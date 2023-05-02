import TrainConfig from "../../value/TrainConfig";
import TrainEpochResult from "../../value/TrainEpochResult";
import TrainResult from "../../value/TrainResult";
import TrainDataItem from "../../value/TrainDataItem";
import BackPropagation from "./BackPropagation";
import NetworkTunner from "./NetworkTunner";

export default class Trainer {

    constructor(private config: TrainConfig) { }

    execute(): TrainResult {
        let t0 = Date.now();
        const result = new TrainResult();

        let lastCost = 0;
        for (let epoch = 0; epoch < this.config.epochs; epoch++) {
            const epochResult = this.executeEpoch(epoch);

            this.outputCostProgress(result, epochResult, lastCost);
            lastCost = epochResult.cost;
        }
        let t1 = Date.now();

        result.durationMs = t1 - t0;
        return result;
    }

    private outputCostProgress(result: TrainResult, epochResult: TrainEpochResult, lastCost: number) {
        result.epochResults.push(epochResult);
        let diffTxt = "";
        if (lastCost > 0) {
            const diff = Math.round(10000.0 * (epochResult.cost - lastCost) / lastCost) / 100;
            diffTxt = ` (${diff}%)`;
        }
        this.config.output.write(`\rEpoch #${epochResult.epochNumber} total cost: ${epochResult.cost}${diffTxt}`);
    }

    private executeEpoch(epoch: number): TrainEpochResult {
        let t0 = Date.now();
        const result = new TrainEpochResult(epoch);
        const batches = this.config.batches;
        for (let i = 0; i < batches.length; i++) {
            //this.config.output.write(`\t>Starting batch #${i}`)
            this.executeBatch(batches[i], result);
        }
        let t1 = Date.now();
        result.duration = t1 - t0;
        return result;
    }

    private executeBatch(items: TrainDataItem[], result: TrainEpochResult) {
        const network = this.config.network;
        const costFunction = this.config.costFunction;
        const tunner = new NetworkTunner(this.config.network, this.config.learningRate);
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const output = network.calculate(item.input);
            const backProp = new BackPropagation(network, item.expectedOutput, costFunction);
            backProp.calculate(tunner);

            result.cost += backProp.totalCost;
        }
        tunner.apply(network);
    }
}