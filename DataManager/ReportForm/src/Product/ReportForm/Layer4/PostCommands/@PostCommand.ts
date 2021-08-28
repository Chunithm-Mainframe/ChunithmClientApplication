import { DIProperty } from "../../../../Packages/DIProperty/DIProperty";
import { ReportFormModule } from "../../Layer3/Modules/@ReportFormModule";

export interface PostCommandParameter {
    versionName?: string;
}

export abstract class PostCommand {
    @DIProperty.inject(ReportFormModule)
    protected readonly module: ReportFormModule;

    public abstract invoke(postData: PostCommandParameter);
}
