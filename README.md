# Neural Network written in Typescript 

This repository contains the code for my [article about Deep Learning](https://www.nachobrito.es/es/sideprojects/ts-deeplearning/).

You can use this code to experiment with Neural Networks, using [main.ts](src/main.ts) as a guide. For example, if you want to train a network that will flip a vector components (return [1,0] for the input [0,1] and vice versa), this code will do:

```typescript

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
```
