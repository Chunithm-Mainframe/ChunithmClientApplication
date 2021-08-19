import { Environment } from "../../Layer1/Environment";
import { LINEPostCommandController } from "./@LINEPostCommandController";
export class EnvironmentGetLINEPostCommandController extends LINEPostCommandController {
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
