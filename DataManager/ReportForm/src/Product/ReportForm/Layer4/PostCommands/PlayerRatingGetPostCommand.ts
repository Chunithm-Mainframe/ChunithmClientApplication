import { MusicRating } from "../../Layer2/PlayerRating/MusicRating";
import { PlayerRatingModule } from "../../Layer3/Modules/PlayerRatingModule";
import { PostCommand, PostCommandParameter } from "./@PostCommand";

interface ResponseRecord {
    id: number;
    best: MusicRating[];
    outsideBest: MusicRating[];
    recent: MusicRating[];
}

export class PlayerRatingGetPostCommand extends PostCommand {
    private get playerRatingModule() { return this.module.getModule(PlayerRatingModule); }

    public invoke(postData: PostCommandParameter) {
        const records: ResponseRecord[] = [];

        const table = this.playerRatingModule.getPlayerRatingTable(postData.versionName);
        for (const record of table.records) {
            records.push({
                id: record.id,
                best: record.getBest(),
                outsideBest: record.getOutsideBest(),
                recent: record.getRecent(),
            });
        }

        return {
            records: records
        };
    }
}
