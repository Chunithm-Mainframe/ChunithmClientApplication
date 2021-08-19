import { PostCommand } from "../PostCommandControllers/@PostCommand";

export class PostCommandManager {
    private readonly _factories: { predicate: (command: string) => boolean; factory: new () => PostCommand }[] = [];

    public bindEquals(command: string, factory: new () => PostCommand): void {
        this.bind(x => x === command, factory);
    }

    public bindStartWith(command: string, factory: new () => PostCommand): void {
        this.bind(x => x.startsWith(command), factory);
    }

    public bind(predicate: (command: string) => boolean, factory: new () => PostCommand): void {
        this._factories.push({ predicate: predicate, factory: factory });
    }

    public findPostCommand(command: string): PostCommand {
        for (const x of this._factories) {
            if (x.predicate(command)) {
                return new x.factory();
            }
        }

        return null;
    }
}
