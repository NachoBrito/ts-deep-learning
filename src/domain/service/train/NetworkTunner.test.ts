import { describe, expect, test } from '@jest/globals';

import Network from '../../value/Network';
import NetworkTunner from './NetworkTunner';
import LearningRate from '../../value/train/LearningRate';



describe("NetworkTunner class", () => {
    test("Constructor", () => {
        const network = Network.builder([1, 2, 3, 4, 5]).build();
        const learningRate = new LearningRate(.5, .5);
        const tunner = new NetworkTunner(network, learningRate);
        const deltas = tunner.deltas;

        expect(deltas.length).toBe(network.layers.length)
        network.layers.forEach((layer, layerIndex) => {
            expect(deltas[layerIndex].length).toBe(layer.length);
            layer.forEach((node, nodeIndex) => {
                expect(deltas[layerIndex][nodeIndex].weights.length).toBe(node.weights.length);
            })
        });
    });


    test("addBias", () => {
        const network = Network.builder([1, 2, 3, 4, 5]).build();
        const learningRate = new LearningRate(.5, .5);
        const tunner = new NetworkTunner(network, learningRate);

        tunner.addGradientComponentBias(1, 1, 2);
        expect(tunner.deltas[1][1].bias).toBe(2);
        tunner.addGradientComponentBias(1, 1, 3);
        expect(tunner.deltas[1][1].bias).toBe(5);
    })

    test("addWeight", () => {
        const network = Network.builder([1, 2, 3, 4, 5]).build()
        const learningRate = new LearningRate(.5, .5);
        const tunner = new NetworkTunner(network, learningRate);

        tunner.addGradientComponentWeight(1, 1, 0, 2);
        expect(tunner.deltas[1][1].weights[0]).toBe(2);
        tunner.addGradientComponentWeight(1, 1, 0, 3);
        expect(tunner.deltas[1][1].weights[0]).toBe(5);
    })

    test("apply", () => {
        const network = Network.builder([2, 2]).build();
        const weights: number[][][] = [];
        const bias: number[][] = [];
        network.layers.forEach((nodes, layerIndex) => {
            weights.push([]);
            bias.push([]);
            nodes.forEach((node, nodeIndex) => {
                weights[layerIndex][nodeIndex] = Object.assign([], node.weights);
                bias[layerIndex][nodeIndex] = node.bias;
            })

        })
        const learningRate = new LearningRate(.5, .5);
        const tunner = new NetworkTunner(network, learningRate);

        tunner.addGradientComponentBias(0, 0, 1);
        tunner.addGradientComponentBias(0, 1, 2);
        tunner.addGradientComponentBias(1, 0, 3);
        tunner.addGradientComponentBias(1, 1, 4);

        tunner.addGradientComponentWeight(0, 0, 0, 1);
        tunner.addGradientComponentWeight(0, 0, 1, 2);
        tunner.addGradientComponentWeight(0, 1, 0, 3);
        tunner.addGradientComponentWeight(0, 1, 1, 4);

        tunner.addGradientComponentWeight(1, 0, 0, 5);
        tunner.addGradientComponentWeight(1, 0, 1, 6);
        tunner.addGradientComponentWeight(1, 1, 0, 7);
        tunner.addGradientComponentWeight(1, 1, 1, 8);

        tunner.apply(network);

        expect(network.layers[0][0].bias).toBe(bias[0][0] - (1 * learningRate.biasLearningRate));
        expect(network.layers[0][1].bias).toBe(bias[0][1] - (2 * learningRate.biasLearningRate));
        expect(network.layers[1][0].bias).toBe(bias[1][0] - (3 * learningRate.biasLearningRate));
        expect(network.layers[1][1].bias).toBe(bias[1][1] - (4 * learningRate.biasLearningRate));

        expect(network.layers[0][0].weights[0]).toBe(weights[0][0][0] - (1 * learningRate.weightsLearningRate));
        expect(network.layers[0][0].weights[1]).toBe(weights[0][0][1] - (2 * learningRate.weightsLearningRate));
        expect(network.layers[0][1].weights[0]).toBe(weights[0][1][0] - (3 * learningRate.weightsLearningRate));
        expect(network.layers[0][1].weights[1]).toBe(weights[0][1][1] - (4 * learningRate.weightsLearningRate));

        expect(network.layers[1][0].weights[0]).toBe(weights[1][0][0] - (5 * learningRate.weightsLearningRate));
        expect(network.layers[1][0].weights[1]).toBe(weights[1][0][1] - (6 * learningRate.weightsLearningRate));
        expect(network.layers[1][1].weights[0]).toBe(weights[1][1][0] - (7 * learningRate.weightsLearningRate));
        expect(network.layers[1][1].weights[1]).toBe(weights[1][1][1] - (8 * learningRate.weightsLearningRate));
    });
});

