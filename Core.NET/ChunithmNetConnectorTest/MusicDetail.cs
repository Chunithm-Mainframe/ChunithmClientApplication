using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmNet.API;
using System;

namespace ChunithmNetConnetorTest
{
    partial class Program
    {
        private static IMusicDetailGetResponse MusicDetail(int id)
        {
            Console.WriteLine($"API: MusicDetail({id})");
            var musicDetailResult = connector.GetMusicDetailAsync(id).Result;

            if (musicDetailResult.Success)
            {
                var musicDetail = musicDetailResult.MusicDetail;

                Console.WriteLine(" Successful");
                Console.WriteLine($" 楽曲名: {musicDetail.Name}");
                Console.WriteLine($" ジャケット: {musicDetail.ImageName}");

                var difficulties = new[]
                {
                    Difficulty.Basic,
                    Difficulty.Advanced,
                    Difficulty.Expert,
                    Difficulty.Master,
                };

                foreach (var difficulty in difficulties)
                {
                    Console.WriteLine($" {Utility.ToDifficultyText(difficulty)}");
                    var musicDetailData = musicDetail.GetUnit(difficulty);
                    Console.WriteLine($"  スコア: {musicDetailData?.Score}");
                    Console.WriteLine($"  プレイ回数: {musicDetailData?.PlayCount}");
                }
            }
            else
            {
                ShowCommonErrorMessage(musicDetailResult);
            }

            return musicDetailResult;
        }
    }
}
