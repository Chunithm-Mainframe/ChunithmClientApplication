import { MusicDataModule } from "../../Layer2/Modules/MusicDataModule";
import { PostCommand, PostCommandParameter } from "./@PostCommand";


export interface TableGetCommandParameer extends PostCommandParameter {
}

export class TableGetCommandController extends PostCommand {
    public invoke(postData: TableGetCommandParameer): any {
        const musicDatas = this.module.getModule(MusicDataModule).getTable(postData.versionName).datas;
        const musicDataTable = { MusicDatas: musicDatas };
        const response = {
            MusicDataTable: musicDataTable
        };
        return response;
    }
}
