import { ReportFormModule } from "./@ReportFormModule";
import { UserAgentParser } from "../../Layer2/UserAgentParser";

export class UserAgentModule extends ReportFormModule {
    private readonly _userAgentParser = new UserAgentParser();

    public IsReplaceImageUrlsPlatform(): boolean {
        if (this._userAgentParser.systemInformation?.indexOf?.('iPhone') !== -1) {
            return true;
        }
        if (this._userAgentParser.systemInformation?.indexOf?.('Andriod') !== -1) {
            if (this._userAgentParser.extensions?.indexOf?.('Line/') !== -1) {
                return true;
            }
        }
        return false;
    }
}
