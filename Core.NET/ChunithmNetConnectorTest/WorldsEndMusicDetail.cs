using ChunithmClientLibrary.ChunithmNet.API;
using System;

namespace ChunithmNetConnetorTest
{
    partial class Program
    {
        private static IWorldsEndMusicDetailGetResponse WorldsEndMusicDetail(int id)
        {
            Console.WriteLine($"API: WorldsEndMusicDetail({id})");
            var worldsEndMusicDetailResult = connector.GetWorldsEndMusicDetailAsync(id).Result;

            if (worldsEndMusicDetailResult.Success)
            {
                var worldsEndMusicDetail = worldsEndMusicDetailResult.WorldsEndMusicDetail;

                Console.WriteLine(" Successful");
                Console.WriteLine($" 楽曲名: {worldsEndMusicDetail.Name}");
                Console.WriteLine($" ジャケット: {worldsEndMusicDetail.ImageName}");

                foreach (var unit in worldsEndMusicDetail.Units)
                {
                    Console.WriteLine($"  スコア: {unit?.Score}");
                    Console.WriteLine($"  プレイ回数: {unit?.PlayCount}");
                }
            }
            else
            {
                ShowCommonErrorMessage(worldsEndMusicDetailResult);
            }

            return worldsEndMusicDetailResult;
        }
    }
}
