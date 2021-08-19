import { PostCommand, PostCommandParameter } from "./@PostCommand";
import { MusicModule } from "../../Layer3/Modules/MusicModule";

interface MusicTableGetPostCommandParameter extends PostCommandParameter {
}

export class MusicTableGetPostCommand extends PostCommand {
    private get musicModule(): MusicModule { return this.module.getModule(MusicModule); }

    public invoke(postData: MusicTableGetPostCommandParameter) {
        const repository = this.musicModule.getMusicTable(postData.versionName);
        return {
            musics: repository.records,
        };
    }
}
