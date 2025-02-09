namespace TabComposerApp.Server.Models.DataTransferObjects
{
    public class SerializedNote
    {
        public int Fret { get; set; }
        public float TimeStamp { get; set; }
        public float NoteDuration { get; set; }
        public int Articulation { get; set; }
    }
}
