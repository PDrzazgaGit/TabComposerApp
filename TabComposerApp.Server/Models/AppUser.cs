using Microsoft.AspNetCore.Identity;
using TabComposerApp.Server.Data;

namespace TabComposerApp.Server.Models
{
    public class AppUser : IdentityUser
    {
        [PersonalData]
        public string? Description { get; set; }

        public DateTime CreatedAt = DateTime.UtcNow;
        public bool Active { get; set; } = true;

        #region FK
        public ICollection<Tabulature> Tabulatures { get; set; } = new List<Tabulature>();
        #endregion
    }
}
