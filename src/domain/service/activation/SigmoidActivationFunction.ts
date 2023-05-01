import ActivationFunction  from "./ActivationFunction";

export default class SigmoidActivationFunction extends ActivationFunction {

    calculate(input: number): number {
        var output = (1 / (1 + Math.pow(Math.E, (-1) * input)));
        return output;
    }

    calculateFirstDerivative(input: number): number {
        const result = this.calculate(input);
        return result * (1 - result);
    }
}