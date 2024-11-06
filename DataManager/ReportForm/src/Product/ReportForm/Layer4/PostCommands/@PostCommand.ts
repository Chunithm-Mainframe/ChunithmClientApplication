abstract class PostCommand {
    @DIProperty.inject(ReportFormModule)
    protected readonly module: ReportFormModule;

    public abstract invoke(postData: PostCommandParameter);
}
