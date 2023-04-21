import { ActivationFunction } from "../service/ActivationFunction";

export class Node {

    constructor(
        readonly layer: number,
        readonly index: number,
        readonly bias: number,
        readonly weights: number[],
        readonly activationFunction: ActivationFunction) { }


    calculate(input: number[]): number {
        const zValue = this.calculateZValue(input);
        const activation = this.activationFunction.calculate(zValue);
        return activation;
    }

    private calculateZValue(input: number[]): number {
        let sum = this.bias
        for (let i = 0; i < input.length; i++) {
            sum += this.weights[i] * input[i];
        }
        return sum;
    }
}