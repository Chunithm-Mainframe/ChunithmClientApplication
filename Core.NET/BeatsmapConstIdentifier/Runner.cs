using System;
using System.Collections.Generic;

namespace BeatsmapConstIdentifier
{
    public class Runner
    {
        public static (bool success, IReadOnlyList<MusicRating> musics) Run(RunnerInput input)
        {
            _ = input ?? throw new ArgumentNullException(nameof(input));

            var instance = new BeatsmapConstIdentifier();
            instance.AddMusics(input.MusicRatings);

            foreach (var container in input.RatingRecordContainers)
            {
                if (!instance.AddRatingRecordContainer(container))
                {
                    return (false, new List<MusicRating>());
                }
            }

            return (true, instance.Musics);
        }
    }
}
