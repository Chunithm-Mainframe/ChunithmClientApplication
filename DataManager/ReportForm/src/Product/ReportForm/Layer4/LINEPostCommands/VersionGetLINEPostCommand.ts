class VersionGetLINEPostCommand extends LINEPostCommand {
    public invoke(): void {
        this.replyMessage(this.event.replyToken, [Version.toolVersion]);
    }
}
