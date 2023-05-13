import { describe, expect, test } from '@jest/globals';
import QuadraticCostfunction from '../../service/cost/QuadraticCostFunction';

import Network from '../Network';
import LearningRate from './LearningRate';
import TrainConfig from './TrainConfig';
import TrainDataItem from './TrainDataItem';



describe("Train Config", () => {
    test("batch generation", () => {
        const network = Network.initWithRandomWeights([2, 2, 1]);
        const epochs = 2;
        const batchCount = 2;
        const cost = new QuadraticCostfunction();
        const learningRate = new LearningRate(.5, .5);
        const trainDataItems = [
            new TrainDataItem([1, 1], [2]),
            new TrainDataItem([1, 2], [3]),
            new TrainDataItem([1, 3], [4])
        ];

        const trainConfig = TrainConfig
            .builder(network, trainDataItems)
            .withEpochs(epochs)
            .withBatchCount(batchCount)
            .withCostFunction(cost)
            .withLearningRate(learningRate)
            .build();

        const batches = trainConfig.batches;
        expect(batches.length).toBe(batchCount);
        expect(batches[0].length).toBe(2);
        expect(batches[1].length).toBe(1);
    });

    test("fail if batch count is ivalid", () => {
        const network = Network.initWithRandomWeights([2, 2, 1]);
        const batchCount = 4;
        const trainDataItems = [
            new TrainDataItem([1, 1], [2]),
            new TrainDataItem([1, 2], [3]),
            new TrainDataItem([1, 3], [4])
        ];

        expect(() => {
            const trainConfig = TrainConfig
                .builder(network, trainDataItems)
                .withBatchCount(batchCount)
                .build();
        }).toThrow("Batch count cannot be greater than dataset size!");

    });
})