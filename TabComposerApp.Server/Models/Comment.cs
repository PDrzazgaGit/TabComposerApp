namespace TabComposerApp.Server.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public string Content { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        #region FK
        public int SongId { get; set; }
        public Song Song { get; set; } = null!;
        #endregion
    }
}