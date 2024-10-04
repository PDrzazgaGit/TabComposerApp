namespace TabComposerApp.Server.Models
{
    public class Song
    {
        int Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public bool Public { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        #region FK
        int UserId { get; set; }
        public User User { get; set; } = null!;
        public ICollection<Tabulature> Tabulatures { get; set; } = new List<Tabulature>();
        #endregion
    }
}