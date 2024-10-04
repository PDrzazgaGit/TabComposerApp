namespace TabComposerApp.Server.Models
{
    public class User
    {
        int Id { get; set; }
        public string Email { get; set; } = null!;
        public string Username { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public string PasswordSalt { get; set; } = null!;

        public DateTime CreatedAt = DateTime.UtcNow;
        public bool Active { get; set; }  = false;

        #region FK
        public ICollection<Song> Songs { get; set; } = new List<Song>();
        #endregion
    }
}
