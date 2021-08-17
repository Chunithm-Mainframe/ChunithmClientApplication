import { ComboStatus } from "../Layer1/Rating";
import { Difficulty } from "../Layer1/Difficulty";

export class Utility {
    public static toDifficulty(difficultyText: string): Difficulty {
        let comparisonText = difficultyText ? difficultyText.toUpperCase() : "";
        switch (comparisonText) {
            case "BASIC":
                return Difficulty.Basic;
            case "ADVANCED":
                return Difficulty.Advanced;
            case "EXPERT":
                return Difficulty.Expert;
            case "MASTER":
                return Difficulty.Master;
        }
        return Difficulty.Invalid;
    }

    public static toDifficultyText(difficulty: Difficulty): string {
        switch (difficulty) {
            case Difficulty.Basic:
                return "BASIC";
            case Difficulty.Advanced:
                return "ADVANCED";
            case Difficulty.Expert:
                return "EXPERT";
            case Difficulty.Master:
                return "MASTER";
        }
        return '';
    }

    public static toDifficultyTextLowerCase(difficulty: Difficulty): string {
        return this.toDifficultyText(difficulty).toLowerCase();
    }

    public static getDifficultyImagePath(difficulty: Difficulty): string {
        switch (difficulty) {
            case Difficulty.Basic:
                return "https://drive.google.com/uc?id=1HhL8aJGebqohVn6FMA6aFaCyiOnUlb2Z";
            case Difficulty.Advanced:
                return "https://drive.google.com/uc?id=1WqF0ywk8zqLrylDy2006YaH7yAiYAp5E";
            case Difficulty.Expert:
                return "https://drive.google.com/uc?id=1h6H7fLsJaMytSXrQmDjfXkd7U8af782-";
            case Difficulty.Master:
                return "https://drive.google.com/uc?id=14O1fUFBT7l83gY8BvTN3DVKx3gEJyr0U";
        }
    }

    public static toComboStatus(comboStatusText: string): ComboStatus {
        switch (comboStatusText) {
            case "AJ":
                return ComboStatus.AllJustice;
            case "FC":
                return ComboStatus.FullCombo;
        }
        return ComboStatus.None;
    }

    public static toComboStatusText(comboStatus: ComboStatus): string {
        switch (comboStatus) {
            case ComboStatus.AllJustice:
                return "AJ";
            case ComboStatus.FullCombo:
                return "FC";
        }
        return "なし";
    }
}
