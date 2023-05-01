import ActivationFunction from "../service/activation/ActivationFunction";


export default class Node {
    private _zValue: number = 0;
    private _activation: number = 0;

    constructor(
        readonly layer: number,
        readonly index: number,
        public bias: number,
        readonly weights: number[],
        readonly activationFunction: ActivationFunction) { }


    calculate(input: number[]): number {
        this._zValue = this.calculateZValue(input);
        this._activation = this.activationFunction.calculate(this._zValue);
        return this._activation;
    }

    private calculateZValue(input: number[]): number {
        let sum = this.bias
        for (let i = 0; i < input.length; i++) {
            sum += this.weights[i] * input[i];
        }
        return sum;
    }

    public get zValue(): number { return this._zValue; }

    public get activation(): number { return this._activation; }

}