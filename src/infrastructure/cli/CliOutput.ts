import Output from "../../domain/service/Output";

export class CliOutput extends Output {
    write(message: string): void {
        process.stdout.write(message);
    }
}