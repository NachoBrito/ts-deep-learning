export default class TrainDataItem {
    constructor(readonly input: number[], readonly expectedOutput: number[]) { }
    isCorrect(output: number[]): boolean {
        const expected = this.expectedOutput.toString();
        const candidate = output.toString();
        return expected === candidate;
    }
}
