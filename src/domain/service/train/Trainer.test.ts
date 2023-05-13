import { describe, expect, test } from '@jest/globals';

import Network from '../../value/Network';
import TrainConfig from '../../value/train/TrainConfig';
import { ExactTrainDataItem, RoundTrainDataItem, TrainDataItem } from '../../value/train/TrainDataItem';
import Trainer from './Trainer';
import QuadraticCostfunction from '../cost/QuadraticCostFunction';
import { CliOutput } from '../../../infrastructure/cli/CliOutput';
import LearningRate from '../../value/train/LearningRate';



describe("Trainer class", () => {
    test("Train process", () => {
        const jestConsole = console;
        global.console = require('console');

        const network = Network.initWithRandomWeights([2, 2], -1, 1, -1, 1);
        const epochs = 10000;
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

        expect(result.durationMs).toBeGreaterThanOrEqual(0);
        //expect(result.epochResults.length).toBe(epochs);
        let lastCost = 0;
        result.epochResults.forEach(result => {
            expect(result.cost).not.toBe(lastCost);
            expect(result.cost).toBeGreaterThan(0);
            expect(result.duration).toBeGreaterThanOrEqual(0);
            lastCost = result.cost;
        })

        global.console = jestConsole;
    })
})