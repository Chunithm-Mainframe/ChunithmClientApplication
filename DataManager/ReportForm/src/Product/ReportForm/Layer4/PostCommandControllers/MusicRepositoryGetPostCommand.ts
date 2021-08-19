import { PostCommand, PostCommandParameter } from "./@PostCommand";
import { MusicModule } from "../../Layer3/Modules/MusicModule";

interface MusicRepositroyGetPostCommandParameter extends PostCommandParameter {
}

export class MusicRepositoryGetPostCommand extends PostCommand {
    private get musicModule(): MusicModule { return this.module.getModule(MusicModule); }

    public invoke(postData: MusicRepositroyGetPostCommandParameter) {
        const repository = this.musicModule.getMusicTable(postData.versionName);
        return {
            musics: repository.records,
        };
    }
}
