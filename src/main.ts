import QuadraticCostfunction from "./domain/service/cost/QuadraticCostFunction";
import Trainer from "./domain/service/train/Trainer";
import Network from "./domain/value/Network";
import LearningRate from "./domain/value/train/LearningRate";
import TrainConfig from "./domain/value/train/TrainConfig";
import { RoundTrainDataItem, TrainDataItem } from "./domain/value/train/TrainDataItem";
import { CliOutput } from "./infrastructure/cli/CliOutput";

const network = Network.initWithRandomWeights([2, 2], -1, 1, -1, 1);
const epochs = 100000;
const batches = 1;
const output = new CliOutput();
const cost = new QuadraticCostfunction();
const learningRate = new LearningRate(0, 1);
const trainDataset: TrainDataItem[] = [];

trainDataset.push(new RoundTrainDataItem([1, 0], [0, 1]));
trainDataset.push(new RoundTrainDataItem([0, 1], [1, 0]));

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