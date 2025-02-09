using TabComposerApp.Server.Models.DataTransferObjects;

namespace TabComposerApp.Server.Services
{
    public interface ITablatureService
    {
        bool ValidateTablatureData(string data);
        public SerializedTabulature? DeserializeTablature(string data);

        public string SerializeTablature(SerializedTabulature tabulature);
    }
}
