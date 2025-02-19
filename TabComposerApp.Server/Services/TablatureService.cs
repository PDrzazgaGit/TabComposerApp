using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;
using TabComposerApp.Server.Models.DataTransferObjects;

namespace TabComposerApp.Server.Services { 
    
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
