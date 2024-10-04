using TabComposerApp.Server.Data;

namespace TabComposerApp.Server.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; } = null!;
        public string Username { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public string PasswordSalt { get; set; } = null!;
        public UserRole Role { get; set; } = UserRole.User;
        public string? Description { get; set; }

        public DateTime CreatedAt = DateTime.UtcNow;
        public bool Active { get; set; } = true;

        #region FK
        public ICollection<Song> Songs { get; set; } = new List<Song>();
        #endregion
    }
}
