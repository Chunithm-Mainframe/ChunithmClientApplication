import { CustomCacheProvider } from "../../../Packages/CustomCacheProvider/CustomCacheProvider";
import { IReport } from "./Report/IReport";
import { LevelBulkReport } from "./Report/LevelBulkReport/LevelBulkReport";

export class NoticeQueue {
    public constructor(private readonly _cacheProvider: CustomCacheProvider) { }

    private static readonly KEY_NOTICE_CREATE_UNIT_REPORTS = 'notice_create_unit_reports';
    public enqueueCreateUnitReport(report: IReport): void {
        this.enqueue<number>(NoticeQueue.KEY_NOTICE_CREATE_UNIT_REPORTS, report.reportId);
    }
    public dequeueCreateUnitReport(count: number): number[] {
        return this.dequeue<number>(NoticeQueue.KEY_NOTICE_CREATE_UNIT_REPORTS, count);
    }

    private static readonly KEY_NOTICE_APPROVE_UNIT_REPORTS = 'notice_approve_unit_reports';
    public enqueueApproveUnitReport(report: IReport): void {
        this.enqueue<number>(NoticeQueue.KEY_NOTICE_APPROVE_UNIT_REPORTS, report.reportId);
    }
    public dequeueApproveUnitReport(count: number): number[] {
        return this.dequeue<number>(NoticeQueue.KEY_NOTICE_APPROVE_UNIT_REPORTS, count);
    }

    private static readonly KEY_NOTICE_REJECT_UNIT_REPORTS = 'notice_reject_unit_reports';
    public enqueueRejectUnitReport(report: IReport): void {
        this.enqueue<number>(NoticeQueue.KEY_NOTICE_REJECT_UNIT_REPORTS, report.reportId);
    }
    public dequeueRejectUnitReport(count: number): number[] {
        return this.dequeue<number>(NoticeQueue.KEY_NOTICE_REJECT_UNIT_REPORTS, count);
    }

    private static readonly KEY_NOTICE_CREATE_LEVEL_REPORTS = 'notice_create_level_reports';
    public enqueueCreateLevelReport(report: LevelBulkReport): void {
        this.enqueue<number>(NoticeQueue.KEY_NOTICE_CREATE_LEVEL_REPORTS, report.reportId);
    }
    public dequeueCreateLevelReport(count: number): number[] {
        return this.dequeue<number>(NoticeQueue.KEY_NOTICE_CREATE_LEVEL_REPORTS, count);
    }

    private static readonly KEY_NOTICE_APPROVE_LEVEL_REPORTS = 'notice_approve_level_reports';
    public enqueueApproveLevelReport(report: LevelBulkReport): void {
        this.enqueue<number>(NoticeQueue.KEY_NOTICE_APPROVE_LEVEL_REPORTS, report.reportId);
    }
    public dequeueApproveLevelReport(count: number): number[] {
        return this.dequeue<number>(NoticeQueue.KEY_NOTICE_APPROVE_LEVEL_REPORTS, count);
    }

    private static readonly KEY_NOTICE_REJECT_LEVEL_REPORTS = 'notice_reject_level_reports';
    public enqueueRejectLevelReport(report: LevelBulkReport): void {
        this.enqueue<number>(NoticeQueue.KEY_NOTICE_REJECT_LEVEL_REPORTS, report.reportId);
    }
    public dequeueRejectLevelReport(count: number): number[] {
        return this.dequeue<number>(NoticeQueue.KEY_NOTICE_REJECT_LEVEL_REPORTS, count);
    }

    private enqueue<T>(key: string, value: T): void {
        let collection = this._cacheProvider.get<T[]>(key);
        if (!collection) {
            collection = [];
        }
        collection.push(value);
        this._cacheProvider.put(key, collection);
    }

    private dequeue<T>(key: string, count: number): T[] {
        let collection = this._cacheProvider.get<T[]>(key);
        if (!collection) {
            collection = [];
        }
        const ret = collection.slice(0, count);
        collection = collection.slice(count);
        this._cacheProvider.put(key, collection);
        return ret;
    }

    public save(): void {
        this._cacheProvider.apply();
    }

    public dump(): void {
        const keys = [
            NoticeQueue.KEY_NOTICE_CREATE_UNIT_REPORTS,
            NoticeQueue.KEY_NOTICE_APPROVE_UNIT_REPORTS,
            NoticeQueue.KEY_NOTICE_REJECT_UNIT_REPORTS,
            NoticeQueue.KEY_NOTICE_CREATE_LEVEL_REPORTS,
            NoticeQueue.KEY_NOTICE_APPROVE_LEVEL_REPORTS,
            NoticeQueue.KEY_NOTICE_REJECT_LEVEL_REPORTS,
        ];

        const obj = {};
        for (const key of keys) {
            obj[key] = this._cacheProvider.get<number[]>(key);
        }
        console.log(obj);
    }
}
