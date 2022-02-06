using AngleSharp.Dom;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace ChunithmClientLibrary.Parser
{
    public static class HtmlParseUtility
    {
        public static string GetPageTitle(IDocument document)
        {
            return document?.GetElementById("page_title")?.TextContent ?? string.Empty;
        }

        public static string GetMusicTitle(IElement content)
        {
            return content.GetElementsByClassName("music_title")?.FirstOrDefault()?.TextContent ?? DefaultParameter.Name;
        }

        public static string GetPlayMusicDataTitle(IElement content)
        {
            return content.GetElementsByClassName("play_musicdata_title")?.FirstOrDefault()?.TextContent ?? DefaultParameter.Name;
        }

        public static int GetMusicId(IElement content, string className)
        {
            var onclick = content.GetElementsByClassName(className)?.FirstOrDefault()?.GetAttribute("onclick");
            if (string.IsNullOrEmpty(onclick))
            {
                return DefaultParameter.Id;
            }

            var match = new Regex(@"musicId_(\d+)").Match(onclick);
            if (!int.TryParse(match.Groups?[1]?.Value, out int id))
            {
                return DefaultParameter.Id;
            }

            return id;
        }

        public static int GetMusicId(IElement content)
        {
            var idText = content.GetElementsByTagName("input")?.FirstOrDefault(e => e.GetAttribute("name") == "idx")?.GetAttribute("value");
            if (!int.TryParse(idText, out var id))
            {
                return DefaultParameter.Id;
            }

            return id;
        }

        public static int GetWorldsEndMusicId(IElement content)
        {
            return GetMusicId(content, "musiclist_worldsend_title");
        }

        public static int GetPlayMusicDataHighScore(IElement content)
        {
            return Utility.ParseScore(content.QuerySelector(".play_musicdata_highscore > .text_b")?.TextContent);
        }

        public static int GetPlayMusicDataScore(IElement content)
        {
            var scoreText = content.GetElementsByClassName("play_musicdata_score_text")?.FirstOrDefault()?
                    .TextContent
                    .Replace("Score：", "");

            return Utility.ParseScore(scoreText);
        }

        public static int GetScoreFromMusicDetail(IElement content)
        {
            var scoreText = content
                .GetElementsByClassName("block_underline")?.ElementAtOrDefault(0)
                .GetElementsByClassName("musicdata_score_num")?
                .FirstOrDefault()?
                .TextContent;

            return Utility.ParseScore(scoreText);
        }

        public static Difficulty GetDifficulty(IElement content)
        {
            if (content.ClassName.Contains("ultima"))
            {
#error 要テスト
                return Difficulty.Ultima;
            }
            if (content.ClassName.Contains("master"))
            {
                return Difficulty.Master;
            }
            else if (content.ClassName.Contains("expert"))
            {
                return Difficulty.Expert;
            }
            else if (content.ClassName.Contains("advanced"))
            {
                return Difficulty.Advanced;
            }
            else if (content.ClassName.Contains("basic"))
            {
                return Difficulty.Basic;
            }
            else if (content.ClassName.Contains("world_end"))
            {
                return Difficulty.WorldsEnd;
            }

            return DefaultParameter.Difficulty;
        }

        public static Difficulty GetDifficultyFromPlayTrackResult(IElement content)
        {
            var difficultyText = content
                    .GetElementsByClassName("play_track_result")?.FirstOrDefault()?
                    .GetElementsByTagName("img")?.First()?
                    .GetAttribute("src");

            if (string.IsNullOrEmpty(difficultyText))
            {
                return DefaultParameter.Difficulty;
            }

            if (difficultyText.Contains("basic"))
            {
                return Difficulty.Basic;
            }
            else if (difficultyText.Contains("advanced"))
            {
                return Difficulty.Advanced;
            }
            else if (difficultyText.Contains("expert"))
            {
                return Difficulty.Expert;
            }
            else if (difficultyText.Contains("master"))
            {
                return Difficulty.Master;
            }
            else if (difficultyText.Contains("ultima"))
            {
                return Difficulty.Ultima;
            }
            else if (difficultyText.Contains("worldsend"))
            {
                return Difficulty.WorldsEnd;
            }

            return DefaultParameter.Difficulty;
        }

        public static bool GetIsNewRecord(IElement content)
        {
            var scoreImage = content.GetElementsByClassName("play_musicdata_score_img")?.FirstOrDefault();
            var newRecord = scoreImage?.GetElementsByTagName("img")?.FirstOrDefault()?.GetAttribute("src");
            return !string.IsNullOrEmpty(newRecord) && newRecord.Contains("icon_new.png");
        }

        public static Rank GetRank(IElement content)
        {
            var playMusicDataIcons = GetPlayMusicDataIcons(content);
            foreach (var icon in playMusicDataIcons)
            {
                if (icon.Contains("icon_rank"))
                {
                    var match = new Regex(@"icon_rank_(\d+).png").Match(icon);
                    if (int.TryParse(match.Groups?[1]?.Value, out int rankCode))
                    {
                        return Utility.ToRank(rankCode);
                    }
                }
            }

            return DefaultParameter.Rank;
        }

        public static bool GetIsClear(IElement content)
        {
            var playMusicDataIcons = GetPlayMusicDataIcons(content);
            foreach (var icon in playMusicDataIcons)
            {
                if (icon.Contains("clear"))
                {
                    return true;
                }
            }

            return DefaultParameter.IsClear;
        }

        public static ComboStatus GetComboStatus(IElement content)
        {
            var playMusicDataIcons = GetPlayMusicDataIcons(content);
            foreach (var icon in playMusicDataIcons)
            {
                if (icon.Contains("alljustice"))
                {
                    return ComboStatus.AllJustice;
                }
                else if (icon.Contains("fullcombo"))
                {
                    return ComboStatus.FullCombo;
                }
            }

            return DefaultParameter.ComboStatus;
        }

        public static ChainStatus GetChainStatus(IElement content)
        {
            var playMusicDataIcons = GetPlayMusicDataIcons(content);
            foreach (var icon in playMusicDataIcons)
            {
                if (icon.Contains("fullchain2"))
                {
                    return ChainStatus.FullChainGold;
                }
                else if (icon.Contains("fullchain"))
                {
                    return ChainStatus.FullChainPlatinum;
                }
            }

            return DefaultParameter.ChainStatus;
        }

        private static List<string> GetPlayMusicDataIcons(IElement content)
        {
            var playMusicDataIcons = content
                .GetElementsByClassName("play_musicdata_icon")
                .FirstOrDefault()?
                .GetElementsByTagName("img")?
                .Select(e => e.GetAttribute("src"))
                .Where(src => !string.IsNullOrEmpty(src))
                .ToList();

            if (playMusicDataIcons == null)
            {
                return new List<string>();
            }

            return playMusicDataIcons;
        }

        public static DateTime GetPlayDataListDate(IElement content)
        {
            return GetPlayDate(content, "play_datalist_date");
        }

        public static DateTime GetPlayDate(IElement content)
        {
            return GetPlayDate(content, "box_inner01");
        }

        private static DateTime GetPlayDate(IElement content, string className)
        {
            var playDateText = content.GetElementsByClassName(className)?.FirstOrDefault()?.TextContent;
            if (string.IsNullOrEmpty(playDateText))
            {
                return DefaultParameter.PlayDate;
            }

            var playDateRegex = new Regex(@"(\d+)/(\d+)/(\d+) (\d+):(\d+)");
            var match = playDateRegex.Match(playDateText);

            if (int.TryParse(match.Groups?[1]?.Value, out int year)
                && int.TryParse(match.Groups?[2]?.Value, out int month)
                && int.TryParse(match.Groups?[3]?.Value, out int day)
                && int.TryParse(match.Groups?[4]?.Value, out int hour)
                && int.TryParse(match.Groups?[5]?.Value, out int minute))
            {
                return new DateTime(year, month, day, hour, minute, 0);
            }

            return DefaultParameter.PlayDate;
        }

        public static int GetTrack(IElement content)
        {
            var trackText = content.GetElementsByClassName("play_track_text")?.FirstOrDefault()?.TextContent.Replace("TRACK ", "", StringComparison.OrdinalIgnoreCase);
            if (!int.TryParse(trackText, out int track))
            {
                return DefaultParameter.Track;
            }
            return track;
        }

        public static string GetImageName(IElement content)
        {
            var imageAttribute = content.GetElementsByClassName("play_jacket_img")?.FirstOrDefault()?
                .GetElementsByTagName("img")?.FirstOrDefault();

            return imageAttribute?.GetAttribute("src")
                ?? imageAttribute?.GetAttribute("data-original")
                ?? DefaultParameter.ImageName;
        }

        public static string GetArtistName(IElement content)
        {
            return content.GetElementsByClassName("play_musicdata_artist")?.FirstOrDefault()?.TextContent ?? DefaultParameter.ArtistName;
        }

        public static int GetPlayCount(IElement content)
        {
            var playCountText = content
                .GetElementsByClassName("block_underline")?.ElementAtOrDefault(1)
                .GetElementsByClassName("musicdata_score_num")?
                .FirstOrDefault()?
                .TextContent?.Replace("回", "");

            if (!int.TryParse(playCountText, out int playCount))
            {
                return DefaultParameter.PlayCount;
            }
            return playCount;
        }

        public static int GetWorldsEndLevelFromHighScoreRecord(IElement content)
        {
            return GetWorldsEndLevel(content, "musiclist_worldsend_star");
        }

        public static int GetWorldsEndLevelFromMusicDetail(IElement content)
        {
            return GetWorldsEndLevel(content, "musiclist_worldsend_star2");
        }

        private static int GetWorldsEndLevel(IElement content, string className)
        {
            var starImage = content
                .GetElementsByClassName(className)?.FirstOrDefault()?
                .GetElementsByTagName("img")?.FirstOrDefault()?
                .GetAttribute("src");

            if (string.IsNullOrEmpty(starImage))
            {
                return DefaultParameter.WorldsEndLevel;
            }

            var match = new Regex(@"images/icon_we_star(\d+).png").Match(starImage);
            if (int.TryParse(match.Groups?[1]?.Value, out int level))
            {
                return level;
            }
            else
            {
                return DefaultParameter.WorldsEndLevel;
            }
        }

        public static WorldsEndType GetWorldsEndTypeFromMusicListWorldsEndIcon(IElement content)
        {
            return GetWorldsEndType(content, "musiclist_worldsend_icon");
        }

        public static WorldsEndType GetWorldsEndTypeFromMusicDetailWorldsEndIcon(IElement content)
        {
            return GetWorldsEndType(content, "musicdetail_worldsend_icon");
        }

        private static WorldsEndType GetWorldsEndType(IElement content, string className)
        {
            var typeImage = content
                .GetElementsByClassName(className)?.FirstOrDefault()?
                .GetElementsByTagName("img")?.FirstOrDefault()?
                .GetAttribute("src");

            if (string.IsNullOrEmpty(typeImage))
            {
                return DefaultParameter.WorldsEndType;
            }

            var match = new Regex(@"images/icon_we_(\d+).png").Match(typeImage);
            if (int.TryParse(match.Groups?[1]?.Value, out int typeCode))
            {
                return Utility.ToWorldsEndType(typeCode);
            }
            else
            {
                return DefaultParameter.WorldsEndType;
            }
        }
    }
}
