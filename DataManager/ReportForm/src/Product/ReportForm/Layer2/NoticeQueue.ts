import { CustomCacheProvider } from "../../../Packages/CustomCacheProvider/CustomCacheProvider";
import { Difficulty } from "../Layer1/Difficulty";

export class NoticeQueue {
    public constructor(private readonly _cacheProvider: CustomCacheProvider) { }

    private static readonly KEY_NOTICE_UPDATE_MUSICS = 'notice_update_musics';
    public enqueueUpdateMusic(musicId: number, difficulty: Difficulty): void {
        this.enqueue<string>(NoticeQueue.KEY_NOTICE_UPDATE_MUSICS, `${musicId}#${difficulty}`);
    }
    public dequeueUpdateMusic(count: number) {
        const ret: { id: number; difficulty: Difficulty }[] = [];
        const values = this.dequeue<string>(NoticeQueue.KEY_NOTICE_UPDATE_MUSICS, count);
        for (const value of values) {
            const tmp = value.split('#');
            ret.push({
                id: parseInt(tmp[0]),
                difficulty: parseInt(tmp[1]),
            })
        }
        return ret;
    }

    private static readonly KEY_NOTICE_CREATE_UNIT_REPORTS = 'notice_create_unit_reports';
    public enqueueCreateUnitReport(reportId: number): void {
        this.enqueue<number>(NoticeQueue.KEY_NOTICE_CREATE_UNIT_REPORTS, reportId);
    }
    public dequeueCreateUnitReport(count: number): number[] {
        return this.dequeue<number>(NoticeQueue.KEY_NOTICE_CREATE_UNIT_REPORTS, count);
    }

    private static readonly KEY_NOTICE_APPROVE_UNIT_REPORTS = 'notice_approve_unit_reports';
    public enqueueApproveUnitReport(reportId: number): void {
        this.enqueue<number>(NoticeQueue.KEY_NOTICE_APPROVE_UNIT_REPORTS, reportId);
    }
    public dequeueApproveUnitReport(count: number): number[] {
        return this.dequeue<number>(NoticeQueue.KEY_NOTICE_APPROVE_UNIT_REPORTS, count);
    }

    private static readonly KEY_NOTICE_REJECT_UNIT_REPORTS = 'notice_reject_unit_reports';
    public enqueueRejectUnitReport(reportId: number): void {
        this.enqueue<number>(NoticeQueue.KEY_NOTICE_REJECT_UNIT_REPORTS, reportId);
    }
    public dequeueRejectUnitReport(count: number): number[] {
        return this.dequeue<number>(NoticeQueue.KEY_NOTICE_REJECT_UNIT_REPORTS, count);
    }

    private static readonly KEY_NOTICE_CREATE_LEVEL_REPORTS = 'notice_create_level_reports';
    public enqueueCreateLevelReport(reportId: number): void {
        this.enqueue<number>(NoticeQueue.KEY_NOTICE_CREATE_LEVEL_REPORTS, reportId);
    }
    public dequeueCreateLevelReport(count: number): number[] {
        return this.dequeue<number>(NoticeQueue.KEY_NOTICE_CREATE_LEVEL_REPORTS, count);
    }

    private static readonly KEY_NOTICE_APPROVE_LEVEL_REPORTS = 'notice_approve_level_reports';
    public enqueueApproveLevelReport(reportId: number): void {
        this.enqueue<number>(NoticeQueue.KEY_NOTICE_APPROVE_LEVEL_REPORTS, reportId);
    }
    public dequeueApproveLevelReport(count: number): number[] {
        return this.dequeue<number>(NoticeQueue.KEY_NOTICE_APPROVE_LEVEL_REPORTS, count);
    }

    private static readonly KEY_NOTICE_REJECT_LEVEL_REPORTS = 'notice_reject_level_reports';
    public enqueueRejectLevelReport(reportId): void {
        this.enqueue<number>(NoticeQueue.KEY_NOTICE_REJECT_LEVEL_REPORTS, reportId);
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
            NoticeQueue.KEY_NOTICE_UPDATE_MUSICS,
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
