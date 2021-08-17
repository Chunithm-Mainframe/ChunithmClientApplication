import { PostCommand, PostCommandParameter } from "./@PostCommand";
import { MusicModule } from "../../Layer2/Modules/MusicModule";

interface MusicRepositroyGetPostCommandParameter extends PostCommandParameter {
}

export class MusicRepositoryGetPostCommand extends PostCommand {
    private get musicModule(): MusicModule { return this.module.getModule(MusicModule); }

    public invoke(postData: MusicRepositroyGetPostCommandParameter) {
        const repository = this.musicModule.getSpecifiedVersionRepository(postData.versionName);
        return {
            musics: repository.rows,
        };
    }
}
