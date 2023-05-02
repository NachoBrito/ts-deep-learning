export default class TrainEpochResult {
    duration: number = 0;
    cost: number = 0;

    constructor(readonly epochNumber: number) { }
}