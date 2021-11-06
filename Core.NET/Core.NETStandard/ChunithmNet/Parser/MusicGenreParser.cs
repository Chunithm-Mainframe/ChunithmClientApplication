using AngleSharp.Dom;
using AngleSharp.Html.Dom;
using ChunithmClientLibrary.ChunithmNet.Data;
using ChunithmClientLibrary.Parser;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ChunithmClientLibrary.ChunithmNet.Parser
{
    public sealed class MusicGenreParser : HtmlParser<MusicGenre>
    {
        private struct ScoreList
        {
            public int MusicCount { get; set; }
            public int ClearCount { get; set; }

            public int FullComboCount { get; set; }
            public int AllJusticeCount { get; set; }
            public int FullChainGoldCount { get; set; }
            public int FullChainPlatinumCount { get; set; }

            public int SCount { get; set; }
            public int SaCount { get; set; }
            public int SsCount { get; set; }
            public int SsaCount { get; set; }
            public int SssCount { get; set; }
            public int SssaCount { get; set; }
        }

        public override MusicGenre Parse(IHtmlDocument document)
        {
            if (document == null)
            {
                throw new ArgumentNullException(nameof(document));
            }

            if (!IsValidDocument(document))
            {
                return null;
            }

            var scoreListResult = document.GetElementById("scoreList_result");
            if (scoreListResult == null)
            {
                return null;
            }

            var musicDetail = document.GetElementById("inner");
            if (musicDetail == null)
            {
                return null;
            }

            var musicGenre = new MusicGenre();
            var scoreList = GetScoreList(scoreListResult);
            musicGenre.MusicCount = scoreList.MusicCount;
            musicGenre.ClearCount = scoreList.ClearCount;
            musicGenre.SCount = scoreList.SCount;
            musicGenre.SaCount = scoreList.SaCount;
            musicGenre.SsCount = scoreList.SsCount;
            musicGenre.SsaCount = scoreList.SsaCount;
            musicGenre.SssCount = scoreList.SssCount;
            musicGenre.SssaCount = scoreList.SssaCount;
            musicGenre.FullComboCount = scoreList.FullComboCount;
            musicGenre.AllJusticeCount = scoreList.AllJusticeCount;
            musicGenre.FullChainGoldCount = scoreList.FullChainGoldCount;
            musicGenre.FullChainPlatinumCount = scoreList.FullChainPlatinumCount;
            musicGenre.Units = GetUnits(musicDetail);

            return musicGenre;
        }

        private bool IsValidDocument(IHtmlDocument document)
        {
            var hoge = HtmlParseUtility.GetPageTitle(document);
            return HtmlParseUtility.GetPageTitle(document) == "レコード";
        }

        private ScoreList GetScoreList(IElement content)
        {
            var scoreList = new ScoreList();
            foreach (var item in GetScoreListItems(content))
            {
                if (item.img.Contains("icon_clear.png"))
                {
                    scoreList.MusicCount = item.all;
                    scoreList.ClearCount = item.num;
                }
                if (item.img.Contains("icon_fullcombo.png"))
                {
                    scoreList.FullComboCount = item.num;
                }
                if (item.img.Contains("icon_alljustice.png"))
                {
                    scoreList.AllJusticeCount = item.num;
                }
                if (item.img.Contains("icon_fullchain2.png"))
                {
                    scoreList.FullChainGoldCount = item.num;
                }
                if (item.img.Contains("icon_fullchain.png"))
                {
                    scoreList.FullChainPlatinumCount = item.num;
                }
                if (item.img.Contains("icon_rank_8.png"))
                {
                    scoreList.SCount = item.num;
                }
                if (item.img.Contains("icon_rank_9.png"))
                {
                    scoreList.SaCount = item.num;
                }
                if (item.img.Contains("icon_rank_10.png"))
                {
                    scoreList.SsCount = item.num;
                }
                if (item.img.Contains("icon_rank_11.png"))
                {
                    scoreList.SsaCount = item.num;
                }
                if (item.img.Contains("icon_rank_12.png"))
                {
                    scoreList.SssCount = item.num;
                }
                if (item.img.Contains("icon_rank_13.png"))
                {
                    scoreList.SssaCount = item.num;
                }
            }
            return scoreList;
        }

        private IEnumerable<(string img, int num, int all)> GetScoreListItems(IElement content)
        {
            var scoreListContents = content.GetElementsByClassName("score_list");

            if (scoreListContents == null)
            {
                yield break;
            }

            foreach (var score in scoreListContents)
            {
                var top = score
                    .GetElementsByClassName("score_list_top")?.FirstOrDefault()?
                    .GetElementsByTagName("img")?.FirstOrDefault()?
                    .GetAttribute("src");

                var bottom = score
                    .GetElementsByClassName("score_list_bottom")?.FirstOrDefault();

                int.TryParse(
                    bottom.GetElementsByClassName("score_num_text")?.FirstOrDefault()?.TextContent,
                    out var numerator);

                int.TryParse(
                    bottom.GetElementsByClassName("score_all_text")?.FirstOrDefault()?.TextContent?.Replace("/", ""),
                    out var denominator);

                yield return (top, numerator, denominator);
            }
        }

        private MusicGenre.Unit[] GetUnits(IElement content)
        {
            var contents = content.GetElementsByClassName("musiclist_box");
            if (contents == null)
            {
                return new MusicGenre.Unit[0];
            }

            var units = new List<MusicGenre.Unit>();
            foreach (var unit in contents.Select(ParseUnit))
            {
                units.Add(unit);
            }
            return units.ToArray();
        }

        private MusicGenre.Unit ParseUnit(IElement content, int index)
        {
            var unit = new MusicGenre.Unit();

            unit.Id = GetId(content);
            unit.Name = GetName(content);
            unit.Genre = GetGenre(content);
            unit.Difficulty = GetDifficulty(content);
            unit.Score = GetScore(content);
            unit.Rank = GetRank(content);
            unit.IsClear = GetIsClear(content);
            unit.ComboStatus = GetComboStatus(content);
            unit.ChainStatus = GetChainStatus(content);

            return unit;
        }

        private int GetId(IElement content)
        {
            return HtmlParseUtility.GetMusicId(content);
        }

        private string GetName(IElement content)
        {
            return HtmlParseUtility.GetMusicTitle(content);
        }

        private string GetGenre(IElement content)
        {
            var genreName = content.ParentElement.ParentElement.GetElementsByClassName("genre")?.FirstOrDefault()?.TextContent;
            if (string.IsNullOrEmpty(genreName))
            {
                return DefaultParameter.Genre;
            }

            return genreName;
        }

        private Difficulty GetDifficulty(IElement content)
        {
            return HtmlParseUtility.GetDifficulty(content);
        }

        private int GetScore(IElement content)
        {
            return HtmlParseUtility.GetPlayMusicDataHighScore(content);
        }

        private Rank GetRank(IElement content)
        {
            return HtmlParseUtility.GetRank(content);
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
    }
}
