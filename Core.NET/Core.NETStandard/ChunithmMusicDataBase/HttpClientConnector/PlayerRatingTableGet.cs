using ChunithmClientLibrary.ChunithmMusicDatabase.API;
using ChunithmClientLibrary.ChunithmMusicDatabase.API.Structs;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector
{
    using InternalRequest = Payloads.PlayerRatingTableGet.Internal.Request;
    using InternalResponse = Payloads.PlayerRatingTableGet.Internal.Response;
    using Response = Payloads.PlayerRatingTableGet.Response;

    public partial class ChunithmMusicDatabaseHttpClientConnector
    {
        public async Task<IPlayerRatingTableGetResponse> GetPlayerRatingTableAsync()
        {
            var internalResponse = await PostAsync<InternalRequest, InternalResponse>(new InternalRequest());

            var table = new PlayerRatingTable();
            table.Records = internalResponse.Records
                .Select(CreatePlayerRating)
                .ToList();

            return new Response
            {
                Success = internalResponse.Success,
                Table = table,
            };
        }

        private IPlayerRating CreatePlayerRating(Structs.PlayerRating source)
        {
            return new PlayerRating
            {
                Id = source.Id,
                BestRatings = ConvertToModels(source.BestRecords),
                OutsideBestRatings = ConvertToModels(source.OutsideBestRecords),
                RecentRatings = ConvertToModels(source.RecentRecords),
            };
        }

        private IReadOnlyList<IPlayRecord> ConvertToModels(IEnumerable<Structs.PlayRecord> records)
        {
            return records.Select(ConvertToModel).ToList();
        }

        private IPlayRecord ConvertToModel(Structs.PlayRecord record)
        {
            return new PlayRecord
            {
                MasterMusicId = record.MasterMusicId,
                Difficulty = record.Difficulty,
                Score = record.Score
            };
        }
    }
}
