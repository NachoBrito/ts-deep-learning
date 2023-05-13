export abstract class OutputFormatter {
    abstract format(output: number[]): number[];
}

export class NoOpFormatter extends OutputFormatter {
    format(output: number[]): number[] {
        return output;
    }
}

export class OutputRounder extends OutputFormatter {
    format(output: number[]): number[] {
        return output.map(value => Math.round(value));
    }
}