using AngleSharp.Dom;
using AngleSharp.Html.Dom;
using ChunithmClientLibrary.ChunithmNet.Data;
using ChunithmClientLibrary.Parser;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ChunithmClientLibrary.ChunithmNet.Parser
{
    public sealed class MusicDetailParser : HtmlParser<MusicDetail>
    {
        public override MusicDetail Parse(IHtmlDocument document)
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

            var musicDetail = new MusicDetail();

            musicDetail.Name = GetName(content);
            musicDetail.ArtistName = GetArtistName(content);
            musicDetail.ImageName = GetImageName(content);
            musicDetail.Units = GetUnits(content);

            return musicDetail;
        }

        private bool IsValidDocument(IHtmlDocument document)
        {
            return HtmlParseUtility.GetPageTitle(document) == "レコード";
        }

        private string GetName(IElement content)
        {
            return HtmlParseUtility.GetPlayMusicDataTitle(content);
        }

        private string GetArtistName(IElement content)
        {
            return HtmlParseUtility.GetArtistName(content);
        }

        private string GetImageName(IElement content)
        {
            return HtmlParseUtility.GetImageName(content);
        }

        private MusicDetail.Unit[] GetUnits(IElement content)
        {
            var contents = content.GetElementsByClassName("music_box");
            if (contents == null)
            {
                return new MusicDetail.Unit[0];
            }

            var units = new List<MusicDetail.Unit>();
            foreach (var unit in contents.Select(ParseUnit))
            {
                units.Add(unit);
            }
            return units.ToArray();
        }

        private MusicDetail.Unit ParseUnit(IElement content, int index)
        {
            var unit = new MusicDetail.Unit();

            unit.Difficulty = GetDifficulty(content);
            unit.Score = GetScore(content);
            unit.Rank = GetRank(content);
            unit.IsClear = GetIsClear(content);
            unit.ComboStatus = GetComboStatus(content);
            unit.ChainStatus = GetChainStatus(content);
            unit.PlayCount = GetPlayCount(content);

            return unit;
        }

        private Difficulty GetDifficulty(IElement node)
        {
            return HtmlParseUtility.GetDifficulty(node);
        }

        private int GetScore(IElement node)
        {
            return HtmlParseUtility.GetScoreFromMusicDetail(node);
        }

        private Rank GetRank(IElement node)
        {
            return HtmlParseUtility.GetRank(node);
        }

        private bool GetIsClear(IElement node)
        {
            return HtmlParseUtility.GetIsClear(node);
        }

        private ComboStatus GetComboStatus(IElement node)
        {
            return HtmlParseUtility.GetComboStatus(node);
        }

        private ChainStatus GetChainStatus(IElement node)
        {
            return HtmlParseUtility.GetChainStatus(node);
        }

        private int GetPlayCount(IElement node)
        {
            return HtmlParseUtility.GetPlayCount(node);
        }
    }
}
