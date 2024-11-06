class MusicUpdatePostCommand extends PostCommand {
    private get musicModule() { return this.module.getModule(MusicModule); }
    private get chunirectModule() { return this.module.getModule(ChunirecModule); }

    @DIProperty.inject(NoticeQueue)
    private readonly noticeQueue: NoticeQueue;

    public invoke(postData: MusicUpdatePostCommandParameter) {
        const currentTable = this.musicModule.getMusicTable(postData.versionName);
        const updatedMusics = this.musicModule.updateMusics(currentTable, postData.musics);

        if (updatedMusics.length > 0) {
            for (const music of updatedMusics) {
                CustomLogManager.log(
                    LogLevel.Info,
                    {
                        'header': '譜面定数自動解析結果',
                        'musicId': music.id,
                        'difficulty': music.difficulty,
                        'baseRating': music.baseRating,
                    }
                );

                this.noticeQueue.enqueueUpdateMusic(music.id, music.difficulty);
            }
            this.noticeQueue.save();

            this.chunirectModule.requestUpdateMusicAll(
                updatedMusics
                    .filter(x => x.baseRating >= 7)
                    .map(x => {
                        return {
                            musicId: x.id,
                            difficulty: x.difficulty,
                            baseRating: x.baseRating,
                        }
                    }));
        }
        return {
            updated: updatedMusics
        };
    }
}
