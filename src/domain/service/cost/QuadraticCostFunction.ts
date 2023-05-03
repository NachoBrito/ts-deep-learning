import CostFunction  from "./CostFunction";

export default class QuadraticCostfunction extends CostFunction {

    calculate(actualResult: number, expectedResult: number): number {
        return Math.pow(actualResult - expectedResult, 2) / 2;
    }

    calculateFirstDerivative(actualResult: number, expectedResult: number): number {
        return actualResult - expectedResult;
    }
}