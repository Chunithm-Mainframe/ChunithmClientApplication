import { ReportFormModule } from "../../Layer2/Modules/@ReportFormModule";
import { DIProperty } from "../../../../Packages/DIProperty/DIProperty";

export interface PostCommandParameter {
    versionName?: string;
    API: string;
}

export abstract class PostCommand {
    @DIProperty.inject(ReportFormModule)
    protected readonly module: ReportFormModule;

    public abstract invoke(postData: PostCommandParameter): any;
}
