import { ActivationFunction } from "./ActivationFunction";

export class SigmoidActivationFunction extends ActivationFunction {
    calculate(input: number): number {
        var output = (1 / (1 + Math.pow(Math.E, (-1) * input)));
        return output;
    }
}