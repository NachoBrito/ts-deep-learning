import exp from "constants";

export default class TrainEpochResult {

    duration: number = 0;
    cost: number = 0;
    costGain: number = 0;
    costGainPercent: number = 0;

    totalPredictions: number = 0;
    correctPredicitons: number = 0;

    constructor(readonly epochNumber: number) { }

    calculateGain(previousCost: number) {
        this.costGain = this.cost - previousCost;
        if (previousCost == 0) {
            return;
        }
        this.costGainPercent = Math.round(10000.0 * this.costGain / previousCost) / 100;
    }

    processOutput(output: number[], expectedOutput: number[]) {
        this.totalPredictions++;
        const max = this.indexOfMax(output);
        const expectedMax = this.indexOfMax(expectedOutput);
        if (max == expectedMax) {
            this.correctPredicitons++;
        }
    }

    private indexOfMax(arr: number[]): number {
        if (arr.length === 0) {
            return -1;
        }

        var max = arr[0];
        var maxIndex = 0;

        for (var i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                maxIndex = i;
                max = arr[i];
            }
        }

        return maxIndex;
    }

    get accuracy(): number { return Math.round(100 * this.correctPredicitons / this.totalPredictions) / 100; }
}