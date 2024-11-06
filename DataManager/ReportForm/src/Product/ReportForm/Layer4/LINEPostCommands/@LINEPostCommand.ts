abstract class LINEPostCommand {
    @DIProperty.inject(ReportFormModule)
    protected readonly module: ReportFormModule;

    public constructor(
        protected readonly commandText: string,
        protected readonly event: LINEPostEvent,
        protected readonly postData
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
