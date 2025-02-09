namespace TabComposerApp.Server.Models.DataTransferObjects
{
    public class SerializedTabulature
    {
        public string? Title { get; set; }
        public string? Author { get; set; }
        public int Frets { get; set; }
        public SerializedTuning? Tuning { get; set; }
        public List<SerializedMeasure>? Measures { get; set; }
        public string? Description { get; set; }
    }
}
