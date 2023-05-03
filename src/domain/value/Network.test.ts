import { describe, expect, test } from '@jest/globals';
import Network from './Network';


describe('Network entity', () => {
    test('Builds a network of given size', () => {
        const layerSizes = [2, 3, 2, 5, 1];
        const weightMin = 4.0;
        const weightMax = 5.0;
        const biasMin = 3.0;
        const biasMax = 6.0;

        const network = Network.initWithRandomWeights(layerSizes, weightMin, weightMax, biasMin, biasMax)

        expect(network.layers.length).toBe(layerSizes.length)
        let previousSize;
        for (let i = 0; i < layerSizes.length; i++) {
            expect(network.layers[i].length).toBe(layerSizes[i]);
            for (let node of network.layers[i]) {
                if (i > 0) {
                    expect(node.weights.length).toBe(previousSize);
                }
                expect(node.bias).toBeGreaterThanOrEqual(biasMin);
                expect(node.bias).toBeLessThanOrEqual(biasMax);
                node.weights.forEach(weight => {
                    expect(weight).toBeGreaterThanOrEqual(weight);
                    expect(weight).toBeLessThanOrEqual(weightMax);
                });
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

    test('Returns derivative of input respect of previous activation', () => {
        const layerSizes = [3, 3, 2, 5, 1];
        const network = Network.initWithRandomWeights(layerSizes)
        const layerIndex = 2, nodeIndex = 0, prevNodeIndex = 1;

        const node = network.layers[layerIndex][nodeIndex];

        const derivative = network.calculateDerivativeOfZRespectPrevActivation(layerIndex, nodeIndex, prevNodeIndex);
        expect(derivative).toBe(node.weights[prevNodeIndex]);
    })

    test('Returns derivative of input respect of weight', () => {
        const layerSizes = [3, 3, 2, 5, 1];
        const network = Network.initWithRandomWeights(layerSizes)
        network.calculate([1, 2, 3])
        const layerIndex = 2, nodeIndex = 0, prevNodeIndex = 1;

        const node = network.layers[layerIndex][nodeIndex];
        const prevNode = network.layers[layerIndex - 1][nodeIndex];

        const derivative = network.calculateDerivativeOfInputRespectWeight(layerIndex, nodeIndex, prevNodeIndex);
        expect(derivative).toBe(prevNode.activation);
    })

    test('Derivative of input respect of weight for layer 0', () => {
        const layerSizes = [3, 3, 2, 5, 1];
        const network = Network.initWithRandomWeights(layerSizes)
        const layerIndex = 0, nodeIndex = 0, weightIndex = 1;
        const input = [1, 2, 3];
        network.calculate(input);
        const derivative = network.calculateDerivativeOfInputRespectWeight(layerIndex, nodeIndex, weightIndex);
        expect(derivative).toBe(input[weightIndex]);
    })

    test('Derivative of input respect of weight validates input', () => {
        const layerSizes = [1, 1];
        const network = Network.initWithRandomWeights(layerSizes)

        expect(() => {
            const derivative = network.calculateDerivativeOfInputRespectWeight(-1, 0, 0);
        }).toThrow("Invalid layer index")

        expect(() => {
            const derivative = network.calculateDerivativeOfInputRespectWeight(2, 0, 0);
        }).toThrow("Invalid layer index")

        expect(() => {
            const derivative = network.calculateDerivativeOfInputRespectWeight(1, -1, 0);
        }).toThrow("Invalid node index")

        expect(() => {
            const derivative = network.calculateDerivativeOfInputRespectWeight(1, 2, 0);
        }).toThrow("Invalid node index")

        expect(() => {
            const derivative = network.calculateDerivativeOfInputRespectWeight(1, 0, -1);
        }).toThrow("Invalid previous node index")

        expect(() => {
            const derivative = network.calculateDerivativeOfInputRespectWeight(1, 0, 2);
        }).toThrow("Invalid previous node index")
    })


})