import { MusicRating } from "./MusicRating";


export class PlayerRating {
    public id = 0;
    public bestJson = '';
    public outsideBestJson = '';
    public recentJson = '';

    public getBest() { return JSON.parse(this.bestJson) as MusicRating[]; }
    public setBest(best: MusicRating[]) { this.bestJson = JSON.stringify(best); }

    public getOutsideBest() { return JSON.parse(this.outsideBestJson) as MusicRating[]; }
    public setOutsideBest(outsideBest: MusicRating[]) { this.outsideBestJson = JSON.stringify(outsideBest); }

    public getRecent() { return JSON.parse(this.recentJson) as MusicRating[]; }
    public setRecent(recent: MusicRating[]) { this.recentJson = JSON.stringify(recent); }
}
