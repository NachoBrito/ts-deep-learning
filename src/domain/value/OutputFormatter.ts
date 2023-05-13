export abstract class OutputProcessor {
    abstract format(output: number[]): number[];
}

export class NoOpFormatter extends OutputProcessor {
    format(output: number[]): number[] {
        return output;
    }
}

export class OutputRounder extends OutputProcessor {
    format(output: number[]): number[] {
        return output.map(value => Math.round(value));
    }
}