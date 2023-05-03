import Output from "../../domain/service/Output";

export default class InMemoryOutput extends Output {
    constructor(readonly messages: string[] = []) {
        super();
    }

    write(message: string): void {
        this.messages.push(message);
    }

}