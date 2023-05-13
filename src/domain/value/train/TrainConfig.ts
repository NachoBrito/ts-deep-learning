import { NullOutput } from "../../../infrastructure/cli/NullOutput";
import Output from "../../service/Output";
import CostFunction from "../../service/cost/CostFunction";
import QuadraticCostfunction from "../../service/cost/QuadraticCostFunction";
import LearningRate from "./LearningRate";
import Network from "../Network";
import TrainDataItem from "./TrainDataItem";



export default abstract class TrainConfig {
    abstract get output(): Output;
    abstract get epochs(): number;
    abstract get batchCount(): number;
    abstract get costFunction(): CostFunction;
    abstract get learningRate(): LearningRate;
    abstract get network(): Network;
    abstract get trainDataset(): TrainDataItem[];
    abstract get batches(): TrainDataItem[][];
    abstract get gainThreshold(): number;

    static builder(network: Network, trainDataSet: TrainDataItem[]) { return new TrainConfigBuilder(network, trainDataSet); }
}

class TrainConfigImpl extends TrainConfig {

    constructor(
        readonly network: Network,
        readonly trainDataset: TrainDataItem[],
        public _epochs: number,
        public _batchCount: number,
        public _costFunction: CostFunction,
        public _learningRate: LearningRate,
        public _output: Output,
        public _gainThreshold: number) { super(); }


    get batches(): TrainDataItem[][] {
        const chunkSize = Math.ceil(this.trainDataset.length / this._batchCount);
        const batches: TrainDataItem[][] = [];
        for (let i = 0; i < this.trainDataset.length; i += chunkSize) {
            const chunk = this.trainDataset.slice(i, i + chunkSize);
            batches.push(chunk);
        }
        return batches;
    }

    get epochs(): number { return this._epochs; }
    get batchCount(): number { return this._batchCount; }
    get costFunction(): CostFunction { return this._costFunction; }
    get learningRate(): LearningRate { return this._learningRate; }
    get output(): Output { return this._output; }
    get gainThreshold(): number { return this._gainThreshold; }

}

export class TrainConfigBuilder {
    private _config: TrainConfigImpl;
    private _defaultEpochs: number = 1;
    private _defaultBatchCount: number = 1;
    private _defaultCostFunction: CostFunction = new QuadraticCostfunction();
    private _defaultLeraningRate: LearningRate = new LearningRate(.5, .5);
    private _defaultOutput: Output = new NullOutput();
    private _defaultGainThreshold: number = .00001;

    constructor(network: Network, trainDataSet: TrainDataItem[]) {
        this._config = new TrainConfigImpl(
            network,
            trainDataSet,
            this._defaultEpochs,
            this._defaultBatchCount,
            this._defaultCostFunction,
            this._defaultLeraningRate,
            this._defaultOutput,
            this._defaultGainThreshold);
    }

    build(): TrainConfig {
        this.validate();
        return this._config;
    }

    private validate() {
        if (this._config._batchCount > this._config.trainDataset.length) {
            throw ("Batch count cannot be greater than dataset size!");
        }
    }

    withEpochs(epochs: number) {
        this._config._epochs = epochs;
        return this;
    }

    withBatchCount(batchCount: number) {
        this._config._batchCount = batchCount;
        return this;
    }

    withCostFunction(costFunction: CostFunction) {
        this._config._costFunction = costFunction;
        return this;
    }

    withLearningRate(learningRate: LearningRate) {
        this._config._learningRate = learningRate;
        return this;
    }

    withOutput(output: Output) {
        this._config._output = output;
        return this;
    }

    withGainThreshold(gainThreshold: number) {
        this._config._gainThreshold = gainThreshold;
        return this;
    }
}