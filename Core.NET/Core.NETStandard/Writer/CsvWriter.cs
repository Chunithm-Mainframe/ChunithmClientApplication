using System.IO;
using System.Text;

namespace ChunithmClientLibrary.Writer
{
    public abstract class CsvWriter<TData> : IWriter<TData>
    {
        public string Csv { get; protected set; }

        public virtual void Write(string path)
        {
            var directory = Path.GetDirectoryName(path);
            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            using var writer = new StreamWriter(path, false, Encoding.UTF8);
            writer.Write(Csv);
        }

        public virtual void Set(TData data)
        {
            Csv = CreateCsv(data);
        }

        public abstract string CreateCsv(TData data);

        protected void Append(StringBuilder csv, object value, bool endOfLine = false)
        {
            var strValue = "";
            if (value is string)
            {
                strValue = $"\"{value?.ToString().Replace("\"", "\"\"")}\"";
            }
            else if (value != null)
            {
                strValue = value.ToString();
            }

            if (endOfLine)
            {
                csv.Append($"{strValue}\n");
            }
            else
            {
                csv.Append($"{strValue},");
            }
        }
    }
}
