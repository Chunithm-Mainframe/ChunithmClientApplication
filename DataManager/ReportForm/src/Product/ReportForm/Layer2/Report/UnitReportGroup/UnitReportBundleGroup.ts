import { UnitReportBundle } from "./UnitReportBundle";

export class UnitReportBundleGroup {
    public get groupId(): string { return this._groupId; }
    public get unitReportBundles(): UnitReportBundle[] { return this._unitReportBundles; }

    public constructor(
        private readonly _groupId: string,
        private readonly _unitReportBundles: UnitReportBundle[]
    ) {
    }
}
