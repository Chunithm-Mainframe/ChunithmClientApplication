using AngleSharp.Dom;
using AngleSharp.Html.Dom;
using ChunithmClientLibrary.ChunithmNet.Data;
using ChunithmClientLibrary.Parser;
using System;
using System.Globalization;
using System.Linq;

namespace ChunithmClientLibrary.ChunithmNet.Parser
{
    public sealed class PlaylogDetailParser : HtmlParser<PlaylogDetail>
    {
        public override PlaylogDetail Parse(IHtmlDocument document)
        {
            if (document == null)
            {
                throw new ArgumentNullException(nameof(document));
            }

            if (!IsValidDocument(document))
            {
                return null;
            }

            var content = document.GetElementById("inner");
            if (content == null)
            {
                return null;
            }

            var playlogDetail = new PlaylogDetail();

            playlogDetail.Name = GetName(content);
            playlogDetail.ImageName = GetImageName(content);
            playlogDetail.Difficulty = GetDifficulty(content);

            playlogDetail.Score = GetScore(content);
            playlogDetail.Rank = GetRank(content);
            // playlogDetail.IsChallengePiece
            playlogDetail.IsNewRecord = GetIsNewRecord(content);
            playlogDetail.IsClear = GetIsClear(content);
            playlogDetail.ComboStatus = GetComboStatus(content);
            playlogDetail.ChainStatus = GetChainStatus(content);
            playlogDetail.Track = GetTrack(content);
            playlogDetail.PlayDate = GetPlayDate(content);

            playlogDetail.StoreName = GetStoreName(content);

            playlogDetail.CharacterName = GetCharacterName(content);
            playlogDetail.SkillLevel = GetSkillLevel(content);
            playlogDetail.SkillName = GetSkillName(content);
            playlogDetail.SkillResult = GetSkillResult(content);

            playlogDetail.MaxCombo = GetMaxCombo(content);
            playlogDetail.JusticeCriticalCount = GetJusticeCriticalCount(content);
            playlogDetail.JusticeCount = GetJusticeCount(content);
            playlogDetail.AttackCount = GetAttackCount(content);
            playlogDetail.MissCount = GetMissCount(content);

            playlogDetail.TapPercentage = GetTapPercentage(content);
            playlogDetail.HoldPercentage = GetHoldPercentage(content);
            playlogDetail.SlidePercentage = GetSlidePercentage(content);
            playlogDetail.AirPercentage = GetAirPercentage(content);
            playlogDetail.FlickPercentage = GetFlickPercentage(content);

            return playlogDetail;
        }

        private bool IsValidDocument(IHtmlDocument document)
        {
            return HtmlParseUtility.GetPageTitle(document) == "プレイ履歴";
        }

        private string GetName(IElement content)
        {
            return HtmlParseUtility.GetPlayMusicDataTitle(content);
        }

        private string GetImageName(IElement content)
        {
            return HtmlParseUtility.GetImageName(content);
        }

        private Difficulty GetDifficulty(IElement content)
        {
            return HtmlParseUtility.GetDifficultyFromPlayTrackResult(content);
        }

        private int GetScore(IElement content)
        {
            return HtmlParseUtility.GetPlayMusicDataScore(content);
        }

        private Rank GetRank(IElement content)
        {
            return HtmlParseUtility.GetRank(content);
        }

        private bool GetIsNewRecord(IElement content)
        {
            return HtmlParseUtility.GetIsNewRecord(content);
        }

        private bool GetIsClear(IElement content)
        {
            return HtmlParseUtility.GetIsClear(content);
        }

        private ComboStatus GetComboStatus(IElement content)
        {
            return HtmlParseUtility.GetComboStatus(content);
        }

        private ChainStatus GetChainStatus(IElement content)
        {
            return HtmlParseUtility.GetChainStatus(content);
        }

        private int GetTrack(IElement content)
        {
            return HtmlParseUtility.GetTrack(content);
        }

        private DateTime GetPlayDate(IElement content)
        {
            return HtmlParseUtility.GetPlayDate(content);
        }

        private string GetStoreName(IElement content)
        {
            return content.GetElementsByClassName("play_data_inner_w388")?.FirstOrDefault()?
                .GetElementsByTagName("span")?.ElementAtOrDefault(1)?
                .TextContent ?? DefaultParameter.StoreName;
        }

        private string GetCharacterName(IElement content)
        {
            return content.GetElementsByClassName("block_icon_text")?.FirstOrDefault()?.TextContent ?? DefaultParameter.CharacterName;
        }

        private int GetSkillLevel(IElement content)
        {
            var skillLevelText = GetSkillLevelText(content);
            if (!int.TryParse(skillLevelText, out int skillLevel))
            {
                return DefaultParameter.SkillLevel;
            }
            return skillLevel;
        }

        private string GetSkillName(IElement content)
        {
            var skillName = content.GetElementsByClassName("block_icon_text")?.ElementAtOrDefault(1)?
                    .TextContent
                    .Replace("\t", "")
                    .Replace("\n", "");
            if (skillName == null)
            {
                return DefaultParameter.SkillName;
            }

            var skillLevelText = GetSkillLevelText(content);

            if (!string.IsNullOrEmpty(skillLevelText))
            {
                skillName = skillName.Replace(skillLevelText, "");
            }

            return skillName;
        }

        private string GetSkillLevelText(IElement content)
        {
            return content.GetElementsByClassName("play_data_skill_grade")?.FirstOrDefault()?.TextContent;
        }

        private int GetSkillResult(IElement content)
        {
            var skillResultText = content.GetElementsByClassName("play_musicdata_skilleffect")?.FirstOrDefault()?
                    .TextContent
                    .Replace("SKILL RESULT", "");
            if (!int.TryParse(skillResultText, NumberStyles.Number, null, out int skillResult))
            {
                return DefaultParameter.SkillResult;
            }
            return skillResult;
        }

        private int GetMaxCombo(IElement content)
        {
            var maxComboText = content.GetElementsByClassName("play_data_detail_maxcombo_block")?.FirstOrDefault()?.TextContent;
            if (!int.TryParse(maxComboText, NumberStyles.Number, null, out int maxCombo))
            {
                return DefaultParameter.MaxCombo;
            }
            return maxCombo;
        }

        private int GetJusticeCriticalCount(IElement content) => GetCount(content, "text_critical", DefaultParameter.JusticeCriticalCount);

        private int GetJusticeCount(IElement content) => GetCount(content, "text_justice", DefaultParameter.JusticeCount);

        private int GetAttackCount(IElement content) => GetCount(content, "text_attack", DefaultParameter.AttackCount);

        private int GetMissCount(IElement content) => GetCount(content, "text_miss", DefaultParameter.MissCount);

        private int GetCount(IElement content, string className, int defaultValue)
        {
            var countText = GetCountText(content, className);
            if (!int.TryParse(countText, NumberStyles.Number, null, out int count))
            {
                return defaultValue;
            }
            return count;
        }

        private string GetCountText(IElement content, string className)
        {
            return content.GetElementsByClassName(className)?.FirstOrDefault()?.TextContent;
        }

        private double GetTapPercentage(IElement content) => GetPercentage(content, 0, DefaultParameter.TapPercentage);

        private double GetHoldPercentage(IElement content) => GetPercentage(content, 1, DefaultParameter.HoldPercentage);

        private double GetSlidePercentage(IElement content) => GetPercentage(content, 2, DefaultParameter.SlidePercentage);

        private double GetAirPercentage(IElement content) => GetPercentage(content, 3, DefaultParameter.AirPercentage);

        private double GetFlickPercentage(IElement content) => GetPercentage(content, 4, DefaultParameter.FlickPercentage);

        private double GetPercentage(IElement content, int index, double defaultValue)
        {
            var noteNumberText = GetPlayMusicDataNoteNumberText(content, index);
            if (!double.TryParse(noteNumberText, out double noteNumber))
            {
                return defaultValue;
            }
            return noteNumber;
        }

        private string GetPlayMusicDataNoteNumberText(IElement content, int index)
        {
            return content.GetElementsByClassName("play_data_detail_notes_text")?.ElementAtOrDefault(index)?
                .TextContent?
                .Replace("%", "");
        }
    }
}
