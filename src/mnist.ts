import Network from "./domain/value/Network";
import { Mnist } from "./importers/Mnist";
import { CliOutput } from "./infrastructure/cli/CliOutput";
import QuadraticCostfunction from "./domain/service/cost/QuadraticCostFunction";
import LearningRate from "./domain/value/LearningRate";
import TrainDataItem from "./domain/value/TrainDataItem";
import TrainConfig from "./domain/value/TrainConfig";
import Trainer from "./domain/service/train/Trainer";



trainNumberRecognition(); // Uncomment, build and run to start image recognition training
//inverseMappingExample(); // Uncomment, build and run to start inverse mapping training

function trainNumberRecognition() {

    console.info("Creating network")
    var network = Network.initWithRandomWeights(
        [28 * 28, 20, 10], -1, 1, -1, 1
    );


    console.info("Loading Mnist dataset")
    var mnist = new Mnist();
    mnist.init();

    const epochs = 50000;
    const batches = 10;
    const output = new CliOutput();
    const cost = new QuadraticCostfunction();
    const learningRate = new LearningRate(0, 1);
    const trainDataset: TrainDataItem[] = [];

    console.info("Preparing dataset for training")
    mnist.structuredData.forEach(data => {
        data.forEach(item => {
            trainDataset.push(new TrainDataItem(item.input, item.expectedOutput))
        })
    })

    const trainConfig = TrainConfig
        .builder(network, trainDataset)
        .withLearningRate(learningRate)
        .withEpochs(epochs)
        .withBatchCount(batches)
        .withCostFunction(cost)
        .withOutput(output)
        .withGainThreshold(0.0)
        .build();

    console.info("Starting training process")
    const trainer = new Trainer(trainConfig);

    const result = trainer.execute();




}
