import { Environment } from "../../Layer1/Environment";
import { LINEPostCommand } from "./@LINEPostCommand";
export class EnvironmentGetLINEPostCommand extends LINEPostCommand {
    public invoke(): void {
        const environmentText = this.getEnvironmentText(this.module.configuration.environment);
        const message = `環境:${environmentText}`;
        this.replyMessage(this.event.replyToken, [message]);
    }
    private getEnvironmentText(environment: Environment): string {
        switch (environment) {
            case Environment.Develop:
                return "開発";
            case Environment.Release:
                return "本番";
        }
    }
}
