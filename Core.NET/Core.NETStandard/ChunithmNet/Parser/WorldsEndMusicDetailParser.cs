using AngleSharp.Dom;
using AngleSharp.Html.Dom;
using ChunithmClientLibrary.ChunithmNet.Data;
using ChunithmClientLibrary.Parser;
using System;
using System.Linq;

namespace ChunithmClientLibrary.ChunithmNet.Parser
{
    public sealed class WorldsEndMusicDetailParser : HtmlParser<WorldsEndMusicDetail>
    {
        public override WorldsEndMusicDetail Parse(IHtmlDocument document)
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

            var worldsEndMusicDetail = new WorldsEndMusicDetail();

            worldsEndMusicDetail.Name = GetName(content);
            worldsEndMusicDetail.ArtistName = GetArtistName(content);
            worldsEndMusicDetail.ImageName = GetImageName(content);
            worldsEndMusicDetail.WorldsEndLevel = GetWorldsEndLevel(content);
            worldsEndMusicDetail.WorldsEndType = GetWorldsEndType(content);
            worldsEndMusicDetail.Units = GetUnits(content);

            return worldsEndMusicDetail;
        }

        private bool IsValidDocument(IHtmlDocument document)
        {
            return HtmlParseUtility.GetPageTitle(document) == "レコード";
        }

        private string GetName(IElement content)
        {
            var name = content.GetElementsByClassName("play_musicdata_worldsend_title")?.FirstOrDefault()?.TextContent;
            name = name?.Trim();
            return name ?? DefaultParameter.Name;
        }

        private string GetArtistName(IElement content)
        {
            return HtmlParseUtility.GetArtistName(content);
        }

        private string GetImageName(IElement content)
        {
            return HtmlParseUtility.GetImageName(content);
        }

        private int GetWorldsEndLevel(IElement content)
        {
            return HtmlParseUtility.GetWorldsEndLevelFromMusicDetail(content);
        }

        private WorldsEndType GetWorldsEndType(IElement content)
        {
            return HtmlParseUtility.GetWorldsEndTypeFromMusicDetailWorldsEndIcon(content);
        }

        private WorldsEndMusicDetail.Unit[] GetUnits(IElement content)
        {
            var unit = GetUnit(content);
            if (content == null)
            {
                return new WorldsEndMusicDetail.Unit[0];
            }

            return new[] { unit };
        }

        private WorldsEndMusicDetail.Unit GetUnit(IElement content)
        {
            var detailContent = content.GetElementsByClassName("bg_worldsend")?.FirstOrDefault();
            if (detailContent == null)
            {
                return new WorldsEndMusicDetail.Unit();
            }

            var unit = new WorldsEndMusicDetail.Unit();

            unit.Difficulty = Difficulty.WorldsEnd;
            unit.Score = GetScore(content);
            unit.PlayCount = GetPlayCount(content);
            unit.IsClear = GetIsClear(content);
            unit.ComboStatus = GetComboStatus(content);
            unit.ChainStatus = GetChainStatus(content);

            return unit;
        }

        private int GetScore(IElement content)
        {
            return HtmlParseUtility.GetScoreFromMusicDetail(content);
        }

        private int GetPlayCount(IElement content)
        {
            var playCountText = content
                .GetElementsByClassName("block_underline")?.ElementAtOrDefault(1)
                .GetElementsByTagName("span")?.ElementAtOrDefault(1)
                .TextContent;

            if (!int.TryParse(playCountText, out int playCount))
            {
                return DefaultParameter.PlayCount;
            }
            return playCount;
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
    }
}
