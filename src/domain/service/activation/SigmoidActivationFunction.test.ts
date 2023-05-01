import { describe, expect, test } from '@jest/globals';
import  SigmoidActivationFunction  from './SigmoidActivationFunction';

describe("Sigmoid Activation Function", () => {
    test("Returns values between 0 and 1, being value for 0 equal to .5", () => {
        const sigmoid = new SigmoidActivationFunction();
        expect(sigmoid.calculate(0)).toBe(.5)
        for (let i = -1000; i < 1000; i++) {
            let value = sigmoid.calculate(i);
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThanOrEqual(1);
        }
    })

    test("Returns first derivative", () => {
        const sigmoid = new SigmoidActivationFunction();
        let input = 0;
        let result = sigmoid.calculate(input);
        let derivative = sigmoid.calculateFirstDerivative(input);

        expect(derivative).toBe(result * (1 - result));
    })
})