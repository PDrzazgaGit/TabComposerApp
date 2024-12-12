namespace TabComposerApp.Server.Models
{
    public class Tabulature
    {
        public int Id { get; set; }
        public string Data { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime LastUpdatedAt { get; set; } = DateTime.UtcNow;

        #region FK
        public required string UserId { get; set; }
        public AppUser AppUser { get; set; } = null!;
        #endregion
    }
}