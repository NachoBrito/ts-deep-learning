import { describe, expect, test } from '@jest/globals';

import Network from '../../value/Network';
import TrainConfig from '../../value/TrainConfig';
import TrainDataItem from '../../value/TrainDataItem';
import Trainer from './Trainer';
import QuadraticCostfunction from '../cost/QuadraticCostFunction';
import { CliOutput } from '../../../infrastructure/cli/CliOutput';
import LearningRate from '../../value/LearningRate';



describe("Trainer class", () => {
    test("Train process", () => {
        const jestConsole = console;
        global.console = require('console');

        const network = Network.initWithRandomWeights([1, 1]);
        const epochs = 4;
        const batches = 1;
        const output = new CliOutput();
        const cost = new QuadraticCostfunction();
        const learningRate = new LearningRate(.2, .2);
        const trainDataset: TrainDataItem[] = [];
        for (let i = 1; i < 1001; i++) {
            trainDataset.push(new TrainDataItem([i], [-1 * i]));
        }

        const trainConfig = TrainConfig
            .builder(network, trainDataset)
            .withLearningRate(learningRate)
            .withEpochs(epochs)
            .withBatchCount(batches)
            .withCostFunction(cost)
            .withOutput(output)
            .build();

        const trainer = new Trainer(trainConfig);

        const result = trainer.execute();

        expect(result.durationMs).toBeGreaterThanOrEqual(0);
        expect(result.epochResults.length).toBe(epochs);
        result.epochResults.forEach(result => {
            expect(result.cost).toBeGreaterThan(0);
            expect(result.duration).toBeGreaterThanOrEqual(0);
        })

        global.console = jestConsole;
    })
})