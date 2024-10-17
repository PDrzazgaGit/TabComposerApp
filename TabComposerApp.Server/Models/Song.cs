using System.Xml.Linq;

namespace TabComposerApp.Server.Models
{
    public class Song
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public bool Public { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        #region FK
        public string UserId { get; set; } = null!;
        public AppUser User { get; set; } = null!;
        public ICollection<Tabulature> Tabulatures { get; set; } = new List<Tabulature>();
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        #endregion
    }
}