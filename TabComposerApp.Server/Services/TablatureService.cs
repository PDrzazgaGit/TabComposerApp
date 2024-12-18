using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;
using TabComposerApp.Server.Models;

namespace TabComposerApp.Server.Services
{
    public class SerializedNote
    {
        public int Fret { get; set; }
        public float TimeStamp { get; set; }
        public float NoteDuration { get; set; }
        public int Articulation { get; set; }
    }

    public class SerializedMeasure
    {
        public int Tempo { get; set; }
        public int Numerator { get; set; }
        public int Denominator { get; set; }
        public Dictionary<int, List<SerializedNote>>? Notes { get; set; }
    }

    public class SerializedSound
    {
        public int Notation { get; set; }
        public int Octave { get; set; }
    }

    public class SerializedTuning
    {
        public  Dictionary<int, SerializedSound>? Tuning { get; set; }
    }

    public class SerializedTabulature
    {
        public string? Title { get; set; }
        public string? Author { get; set; }
        public int Frets { get; set; }
        public SerializedTuning? Tuning { get; set; }
        public List<SerializedMeasure>? Measures { get; set; }
    }
    public class TablatureService : ITablatureService
    {
        public TablatureService() { }

        public SerializedTabulature? DeserializeTablature(string data)
        {
            var jsonObject = JObject.Parse(data);
            var modelProperties = typeof(SerializedTabulature).GetProperties()
                .Select(p => p.Name.ToLower());

            var jsonKeys = jsonObject.Properties().Select(p => p.Name.ToLower()).ToList();

            if (!jsonKeys.All(key => modelProperties.Contains(key)))
            {
                return null;
            }

            return JsonConvert.DeserializeObject<SerializedTabulature>(data);
        }

        public string SerializeTablature(SerializedTabulature tabulature)
        {
            var settings = new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            };

            return JsonConvert.SerializeObject(tabulature, settings);
        }

        public bool ValidateTablatureData(string data)
        {
            var deserializedTablature = DeserializeTablature(data);

            if (deserializedTablature == null)
            {
                return false;
            }
            
            return true;
        }
    }
}
