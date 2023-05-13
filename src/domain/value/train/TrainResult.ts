import TrainEpochResult from "./TrainEpochResult";

export default class TrainResult {
    durationMs: number = 0;

    constructor(readonly epochResults: TrainEpochResult[] = []) { }

    get averageAccuracy(): number {
        let sum = 0;
        this.epochResults.forEach(epochResult => { sum += (epochResult.accuracy / 100) });
        return Math.round(10000 * sum / this.epochResults.length) / 100;
    }
}