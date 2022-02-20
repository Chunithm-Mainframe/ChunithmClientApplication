namespace ChunithmClientLibrary
{
    public enum Difficulty
    {
        Invalid,
        Basic,
        Advanced,
        Expert,
        Master,
        Ultima,
        WorldsEnd,
    }

    public static partial class Utility
    {
        public static readonly string DIFFICULTY_INVALID_TEXT = "INVALID";
        public static readonly string DIFFICULTY_BASIC_TEXT = "BASIC";
        public static readonly string DIFFICULTY_ADVANCED_TEXT = "ADVANCED";
        public static readonly string DIFFICULTY_EXPERT_TEXT = "EXPERT";
        public static readonly string DIFFICULTY_MASTER_TEXT = "MASTER";
        public static readonly string DIFFICULTY_ULTIMA_TEXT = "ULTIMA";
        public static readonly string DIFFICULTY_WORLDS_END_TEXT = "WORLD'S END";

        private class DifficultyPair
        {
            public Difficulty Difficulty { get; }
            public string Text { get; }

            public DifficultyPair(Difficulty difficulty, string text)
            {
                Difficulty = difficulty;
                Text = text;
            }
        }

        private static DifficultyPair[] difficultyPairs = new DifficultyPair[]
        {
            new DifficultyPair(Difficulty.Basic, DIFFICULTY_BASIC_TEXT),
            new DifficultyPair(Difficulty.Advanced, DIFFICULTY_ADVANCED_TEXT),
            new DifficultyPair(Difficulty.Expert, DIFFICULTY_EXPERT_TEXT),
            new DifficultyPair(Difficulty.Master, DIFFICULTY_MASTER_TEXT),
            new DifficultyPair(Difficulty.Ultima, DIFFICULTY_ULTIMA_TEXT),
            new DifficultyPair(Difficulty.WorldsEnd, DIFFICULTY_WORLDS_END_TEXT),
            new DifficultyPair(Difficulty.Invalid, DIFFICULTY_INVALID_TEXT),
        };

        public static string ToDifficultyText(Difficulty difficulty)
        {
            return PairConverter.Convert(difficultyPairs, difficulty, DIFFICULTY_INVALID_TEXT, p => p.Difficulty, p => p.Text);
        }

        public static Difficulty ToDifficulty(string difficultyText)
        {
            return PairConverter.Convert(difficultyPairs, difficultyText, Difficulty.Invalid, p => p.Text, p => p.Difficulty);
        }
    }
}
