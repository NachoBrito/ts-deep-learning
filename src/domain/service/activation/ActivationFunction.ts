export default abstract class ActivationFunction {
    abstract calculate(input: number): number;

    abstract calculateFirstDerivative(input: number): number;
}