class PlayerRatingGetPostCommand extends PostCommand {
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
