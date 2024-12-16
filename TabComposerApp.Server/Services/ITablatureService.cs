using TabComposerApp.Server.Models;

namespace TabComposerApp.Server.Services
{
    public interface ITablatureService
    {
        bool ValidateTablatureData(string data);
        public SerializedTabulature? DeserializeTablature(string data);

        public string SerializeTablature(SerializedTabulature tabulature);
    }
}
