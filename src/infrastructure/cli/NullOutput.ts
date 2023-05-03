import Output from "../../domain/service/Output";

export class NullOutput extends Output {
    write(message: string): void {
        //do nothing.
    }
}