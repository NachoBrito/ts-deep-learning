import TrainConfig from "../../value/train/TrainConfig";
import TrainDataItem from "../../value/train/TrainDataItem";

import TrainEpochResult from "../../value/train/TrainEpochResult";
import TrainResult from "../../value/train/TrainResult";
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

            epochResult.calculateGain(lastCost);
            result.epochResults.push(epochResult);
            this.config.output.write(`\rEpoch #${epochResult.epochNumber} total cost: ${epochResult.cost} (${epochResult.costGainPercent}%). Accuracy: ${epochResult.accuracy}% \t\t\t\t`);
            lastCost = epochResult.cost;

            if (Math.abs(epochResult.costGain) < this.config.gainThreshold) {
                this.config.output.write(`\nReached cost gain threshold. Interrupting.`);
                break;
            }
        }

        this.config.output.write(`\nTraining complete. Average accuracy: ${result.averageAccuracy}%\n`)
        let t1 = Date.now();

        result.durationMs = t1 - t0;
        return result;
    }


    private executeEpoch(epoch: number): TrainEpochResult {
        let t0 = Date.now();
        const result = new TrainEpochResult(epoch);
        const batches = this.config.batches;
        for (let i = 0; i < batches.length; i++) {
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
            result.countResult(item.isCorrect(network.processedOutput));
            result.cost += backProp.totalCost;
        }
        tunner.apply(network);
    }
}