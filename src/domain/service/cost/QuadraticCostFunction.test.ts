import { describe, expect, test } from '@jest/globals';
import QuadraticCostfunction from './QuadraticCostFunction';

describe("Sigmoid Activation Function", () => {
    test("Returns right values", () => {
        const cost = new QuadraticCostfunction();
        expect(cost.calculate(0, 0)).toBe(0)
        expect(cost.calculate(1, 1)).toBe(0)

        expect(cost.calculate(0, 1)).toBe(0.5)
        expect(cost.calculate(1, 0)).toBe(0.5)
    })

    test("Returns first derivative", () => {
        const cost = new QuadraticCostfunction();
        expect(cost.calculateFirstDerivative(0, 0)).toBe(0)
        expect(cost.calculateFirstDerivative(1, 1)).toBe(0)

        expect(cost.calculateFirstDerivative(0, 1)).toBe(-1)
        expect(cost.calculateFirstDerivative(1, 0)).toBe(1)
    })
})