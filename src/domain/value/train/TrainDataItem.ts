export abstract class TrainDataItem {
    constructor(readonly input: number[], readonly expectedOutput: number[]) { }
    abstract isCorrect(output: number[]): boolean;
}

export class ExactTrainDataItem extends TrainDataItem {
    isCorrect(output: number[]): boolean {
        const expected = this.expectedOutput.toString();
        const candidate = output.toString();
        return expected === candidate;
    }
}

export class RoundTrainDataItem extends TrainDataItem {
    isCorrect(output: number[]): boolean {
        const expected = this.expectedOutput.toString();
        const rounded = output.map(value => Math.round(value));
        const candidate = rounded.toString();
        return expected === candidate;
    }
}