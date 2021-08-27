using BeatsmapConstIdentifier;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using static BeatsmapConstIdentifier.Program;

namespace BeatsmapConstIdentifier_UnitTest
{
    public static class TestUtility
    {
        public static string ToResourcePath(string fileName)
        {
            return "../../../Resources/" + fileName;
        }

        public static string[] ReadFileLines(string path)
        {
            using var reader = new StreamReader(path);
            return reader.ReadToEnd().Replace("\r\n", "\n").Split("\n", StringSplitOptions.RemoveEmptyEntries);
        }

        public static string[] ReadResourceFileLines(string fileName)
        {
            return ReadFileLines(ToResourcePath(fileName));
        }

        public static Func<string> CreateReadLine(IEnumerator<string> lines)
        {
            return () =>
            {
                lines.MoveNext();
                return lines.Current;
            };
        }

        public static IReadOnlyCollection<Song> TestFile(string fileName)
        {
            return Exec(CreateReadLine(ReadResourceFileLines(fileName).AsEnumerable().GetEnumerator()));
        }
    }
}
