class FormUrlGetLINEPostCommand extends LINEPostCommand {
    public invoke(): void {
        const url = this.module.getModule(ReportModule).unitReportGroupByGenreGoogleForm.getPublishedUrl();
        this.replyMessage(this.event.replyToken, [`[検証報告フォーム]\n${url}`]);
    }
}
