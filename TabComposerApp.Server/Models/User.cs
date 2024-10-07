using Microsoft.AspNetCore.Identity;
using TabComposerApp.Server.Data;

namespace TabComposerApp.Server.Models
{
    public class User : IdentityUser
    {
        public string? Description { get; set; }

        public DateTime CreatedAt = DateTime.UtcNow;
        public bool Active { get; set; } = true;

        #region FK
        public ICollection<Song> Songs { get; set; } = new List<Song>();
        #endregion
    }
}
