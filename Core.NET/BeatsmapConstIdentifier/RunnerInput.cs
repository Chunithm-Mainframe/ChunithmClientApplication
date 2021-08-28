using ChunithmClientLibrary.Core;
using System.Collections.Generic;
using System.Linq;

namespace BeatsmapConstIdentifier
{
    public class RunnerInput
    {
        public IReadOnlyList<(MusicIdentifier identifier, BaseRatingRange baseRatingRange)> MusicRatings => musicRatingMap.Values.ToList();
        public IReadOnlyList<RatingRecordContainer> RatingRecordContainers => ratingRecordContainers;

        private readonly Dictionary<int, (MusicIdentifier, BaseRatingRange)> musicRatingMap = new();
        private readonly List<RatingRecordContainer> ratingRecordContainers = new();

        public void SetMusicRepository(IMusicRepository musicRepository)
        {
            foreach (var music in musicRepository.GetMusics())
            {
                if (music.Verified)
                {
                    AddMusic(
                        new MusicIdentifier(music.MasterMusic.Id, music.Difficulty),
                        new BaseRatingRange((int)(music.BaseRating * 100), (int)(music.BaseRating * 100)));
                }
                else
                {
                    var level = (int)(music.BaseRating * 100);
                    var integerPart = level / 100 * 100;
                    var decimalPart = level % 100;
                    var lowerLimit = integerPart + (decimalPart >= 70 ? 70 : 0);
                    var upperLimit = integerPart + (decimalPart >= 70 ? 90 : 60);
                    AddMusic(
                        new MusicIdentifier(music.MasterMusic.Id, music.Difficulty),
                        new BaseRatingRange(lowerLimit, upperLimit));
                }
            }
        }

        public void AddMusics(IEnumerable<MusicRating> musicRatings)
        {
            foreach (var music in musicRatings)
            {
                AddMusic(music.ToMusicIdentifier(), music.ToBaseRatingRange());
            }
        }

        public void AddMusics(IEnumerable<(MusicIdentifier, BaseRatingRange)> musics)
        {
            foreach (var (identifier, baseRatingRange) in musics)
            {
                AddMusic(identifier, baseRatingRange);
            }
        }

        public void AddMusic(MusicIdentifier identifier, BaseRatingRange baseRatingRange)
        {
            var key = identifier.ToUniqueKey();
            musicRatingMap[key] = (identifier, baseRatingRange);
        }

        public void AddRatingRecordContainers(IEnumerable<RatingRecordContainer> containers)
        {
            ratingRecordContainers.AddRange(containers);
        }

        public void AddRatingRecordContainer(RatingRecordContainer container)
        {
            ratingRecordContainers.Add(container);
        }
    }
}
