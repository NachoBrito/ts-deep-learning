import { describe, expect, test } from '@jest/globals';
import Network from '../../value/Network';
import BackPropagation from './BackPropagation';
import QuadraticCostfunction from '../cost/QuadraticCostFunction';



describe("BackPropagation class", () => {
    test("Partial results initialization", () => {
        const network = Network.builder([3, 4, 1]).build();
        const expectedResults = [1];
        const costFunction = new QuadraticCostfunction();
        const backProp = new BackPropagation(network, expectedResults, costFunction);

        expect(backProp.costRespectActivationCache).toEqual([[0, 0, 0], [0, 0, 0, 0], [0]]);
    });

    test("Partial results setting", () => {
        const network = Network.builder([3, 4, 1]).build();
        const expectedResults = [1];
        const costFunction = new QuadraticCostfunction();
        const backProp = new BackPropagation(network, expectedResults, costFunction);

        expect(backProp.costRespectActivationCache[1][2]).toBe(0);
        backProp.saveCostRespectActivation(1, 2, 3);
        expect(backProp.costRespectActivationCache[1][2]).toBe(3);
        backProp.saveCostRespectActivation(1, 2, 2);
        expect(backProp.costRespectActivationCache[1][2]).toBe(5);
    });

});