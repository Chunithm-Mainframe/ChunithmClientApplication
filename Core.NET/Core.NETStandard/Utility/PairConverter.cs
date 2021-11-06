using System;
using System.Linq;

namespace ChunithmClientLibrary
{
    public static partial class Utility
    {
        private static class PairConverter
        {
            public static TResult Convert<TPair, TSource, TResult>(TPair[] pairs, TSource source, TResult defaultValue, Func<TPair, TSource> sourceSelector, Func<TPair, TResult> resultSelector)
            {
                return Convert(pairs, defaultValue, sourceSelector, resultSelector, value => Equals(source, value));
            }

            public static TResult Convert<TPair, TSource, TResult>(TPair[] pairs, TResult defaultValue, Func<TPair, TSource> sourceSelector, Func<TPair, TResult> resultSelector, Predicate<TSource> predicate)
            {
                var pair = pairs.FirstOrDefault(p => predicate(sourceSelector(p)));
                if (pair == null)
                {
                    return defaultValue;
                }

                return resultSelector(pair);
            }
        }
    }
}
