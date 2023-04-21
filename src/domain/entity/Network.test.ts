import { describe, expect, test } from '@jest/globals';
import { SigmoidActivationFunction } from '../../../src/domain/service/SigmoidActivationFunction';
import { Network } from '../../../src/domain/entity/Network';
import { Node } from '../../../src/domain/entity/Node';

describe('Network entity', () => {
    test('Builds a network of given size', () => {
        const layerSizes = [2, 3, 2, 5, 1];

        const network = Network.initWithRandomWeights(layerSizes)

        expect(network.layers.length).toBe(layerSizes.length)
        let previousSize;
        for (let i = 0; i < layerSizes.length; i++) {
            expect(network.layers[i].length).toBe(layerSizes[i]);
            for (let node of network.layers[i]) {
                if (i == 0) {
                    let ones = Array.from({ length: network.layers[i].length }, () => 1);
                    expect(node.weights).toEqual(ones);
                } else {
                    expect(node.weights.length).toBe(previousSize);
                }
            }
            previousSize = network.layers[i].length;
        }
    })

    test('Calculate returns a result of the sime size as the last layer', () => {
        const layerSizes = [2, 3, 2, 5, 1];
        const network = Network.initWithRandomWeights(layerSizes)
        const input = [0, 0];
        const result = network.calculate(input)
        expect(result.length).toBe(layerSizes[layerSizes.length - 1]);
    })

    test('Fail if invalid input size', () => {
        const layerSizes = [3, 3, 2, 5, 1];
        const network = Network.initWithRandomWeights(layerSizes)
        const input = [0, 0, 0, 4];

        expect(() => {
            const result = network.calculate(input)
        }).toThrow("Input size (4) doesn't match first layer size (3)")

    })

    test('At least one weight is >0 && < 1', () => {
        const layerSizes = [3, 3, 2, 5, 1];
        const network = Network.initWithRandomWeights(layerSizes)
        let randomWeight = false;
        for (let layer of network.layers) {
            for (let node of layer) {
                for (let weight of node.weights) {
                    if (weight > 0 && weight < 1) {
                        randomWeight = true;
                        break;
                    }
                }
                if (randomWeight) {
                    break;
                }
            }
            if (randomWeight) {
                break;
            }
        }
        expect(randomWeight).toBe(true);
    })

})