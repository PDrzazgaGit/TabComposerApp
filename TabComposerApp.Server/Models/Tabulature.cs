namespace TabComposerApp.Server.Models
{
    public class Tabulature
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Tuning { get; set; } = null!;
        public string Notes { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime LastUpdatedAt { get; set; } = DateTime.UtcNow;

        #region FK
        public int SongId { get; set; }
        public Song Song { get; set; } = null!;
        #endregion
    }
}