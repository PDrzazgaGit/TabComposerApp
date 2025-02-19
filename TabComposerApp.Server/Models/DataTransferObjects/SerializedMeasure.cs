namespace TabComposerApp.Server.Models.DataTransferObjects
{
    public class SerializedMeasure
    {
        public int Tempo { get; set; }
        public int Numerator { get; set; }
        public int Denominator { get; set; }
        public Dictionary<int, List<SerializedNote>>? Notes { get; set; }
    }
}
