import { ReportFormModule } from "../../Layer2/Modules/@ReportFormModule";
import { LINEModule } from "../../Layer2/Modules/LINEModule";
import { DIProperty } from "../../../../Packages/DIProperty/DIProperty";

export interface LINEPostEvent {
    type: string;
    message: {
        type: string;
        text: string;
    };
    replyToken?: string;
}

export abstract class LINEPostCommandController {
    @DIProperty.inject(ReportFormModule)
    protected readonly module: ReportFormModule;

    public constructor(
        protected readonly commandText: string,
        protected readonly event: LINEPostEvent,
        protected readonly postData: any
    ) {
    }

    public abstract invoke(): void;

    protected pushMessage(messages: string[]): void {
        this.module.getModule(LINEModule).pushNoticeMessage(messages);
    }

    protected replyMessage(replyToken: string, messages: string[]): void {
        this.module.getModule(LINEModule).replyMessage(replyToken, messages);
    }
}
