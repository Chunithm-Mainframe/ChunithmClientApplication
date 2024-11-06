class MusicTableGetPostCommand extends PostCommand {
    private get musicModule(): MusicModule { return this.module.getModule(MusicModule); }

    public invoke(postData: MusicTableGetPostCommandParameter) {
        const repository = this.musicModule.getMusicTable(postData.versionName);
        return {
            musics: repository.records,
        };
    }
}
