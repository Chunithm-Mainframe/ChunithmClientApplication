import { LINEPostCommandController, LINEPostEvent } from "../LINEPostCommandControllers/@LINEPostCommandController";

type Factory = { new(commandText: string, event: LINEPostEvent, postData: any): LINEPostCommandController };

export class LINEPostCommandManager {
    private readonly _factories: { predicate: (commandText: string) => boolean; factory: Factory }[] = [];

    public bindEquals(commandText: string, factory: Factory) {
        this.bind(x => x === commandText, factory);
    }

    public bindStartWith(commandText: string, factory: Factory) {
        this.bind(x => x.startsWith(commandText), factory);
    }

    public bind(predicate: (commandText: string) => boolean, factory: Factory) {
        this._factories.push({ predicate: predicate, factory: factory });
    }

    public findController(postData: { events: LINEPostEvent[] }): LINEPostCommandController {
        if (!postData.events || !postData.events[0]) {
            return null;
        }

        const event = postData.events[0];
        if (event.type !== "message" || event.message.type !== "text") {
            return null;
        }
        const messageText: string = event.message.text;
        if (messageText.indexOf(":") !== 0) {
            return null;
        }
        const commandText = messageText.substring(1);
        for (const x of this._factories) {
            if (x.predicate(commandText)) {
                return new x.factory(commandText, event, postData);
            }
        }
        return null;
    }

    //private createMissingCommandHandler(commandText: string): LINEPostCommandControllerHandler {
    //    const self = this;
    //    return {
    //        invoke() {
    //            self.lineModule.pushNoticeMessage([`存在しないコマンド:${commandText}`]);
    //        }
    //    }
    //}
}
