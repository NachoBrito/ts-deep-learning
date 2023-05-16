import SigmoidActivationFunction from "./domain/service/activation/SigmoidActivationFunction";
import QuadraticCostfunction from "./domain/service/cost/QuadraticCostFunction";
import Trainer from "./domain/service/train/Trainer";
import Network from "./domain/value/Network";
import { OutputRounder } from "./domain/value/OutputFormatter";
import LearningRate from "./domain/value/train/LearningRate";
import TrainConfig from "./domain/value/train/TrainConfig";
import TrainDataItem from "./domain/value/train/TrainDataItem";
import { CliOutput } from "./infrastructure/cli/CliOutput";

const rounder = new OutputRounder();
const network = Network.builder([2, 2])
    .withWeightLimits(-.5, .5)
    .withOutputProcessor(rounder)
    .build();
const epochs = 1000;
const batches = 1;
const output = new CliOutput();
const cost = new QuadraticCostfunction();
const learningRate = new LearningRate(.5, .2);
const trainDataset: TrainDataItem[] = [];

trainDataset.push(new TrainDataItem([1, 0], [0, 1]));
trainDataset.push(new TrainDataItem([0, 1], [1, 0]));

const trainConfig = TrainConfig
    .builder(network, trainDataset)
    .withLearningRate(learningRate)
    .withEpochs(epochs)
    .withBatchCount(batches)
    .withCostFunction(cost)
    .withOutput(output)
    .withGainThreshold(0)
    .build();

const trainer = new Trainer(trainConfig);

const result = trainer.execute();

