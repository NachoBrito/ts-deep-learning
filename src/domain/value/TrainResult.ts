import TrainEpochResult from "./TrainEpochResult";

export default class TrainResult {
    durationMs: number = 0; 
    
    constructor(readonly epochResults: TrainEpochResult[] = []) { }
}