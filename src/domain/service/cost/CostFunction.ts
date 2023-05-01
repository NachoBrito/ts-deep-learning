

export default abstract class CostFunction {
    abstract calculate(actualResult: number, expectedResult: number): number;
    abstract calculateFirstDerivative(actualResult: number, expectedResult: number): number;

    private getCostArray(actualResult: number[], expectedResult: number[]): number[] {
        let cost: number[] = [];
        for (let i = 0; i < actualResult.length; i++) {
            cost.push(this.calculate(actualResult[i], expectedResult[i]));
        }
        return cost;
    }

    getTotalCost(actualResult: number[], expectedResult: number[]) {
        let costArray = this.getCostArray(actualResult, expectedResult);
        return costArray.reduce((a, b) => a + b);
    }
}
