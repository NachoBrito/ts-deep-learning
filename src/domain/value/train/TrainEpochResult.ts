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

    processOutput(isCorrect: boolean) {
        this.totalPredictions++;
        if (isCorrect) {
            this.correctPredicitons++;
        }
    }

    get accuracy(): number { return Math.round(10000 * this.correctPredicitons / this.totalPredictions) / 100; }
}