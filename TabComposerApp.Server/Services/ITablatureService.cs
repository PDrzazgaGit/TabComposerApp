using TabComposerApp.Server.Models;

namespace TabComposerApp.Server.Services
{
    public interface ITablatureService
    {
        //string GetTitle(Tablature tablature);
        bool ValidateTablatureData(string data);
        public SerializedTabulature? DeserializeTabulature(string data);
    }
}
