using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using TabComposerApp.Server.Models;

namespace TabComposerApp.Server.Data
{
    public class TabComposerAppContext : IdentityDbContext<AppUser>
    {
        public DbSet<AppUser> AppUsers = null!; 
        public DbSet<Tablature> Tablatures{ get; set; } = null!;

        /*
        
        Po wykonaniu zmian

        Remove-Migration
        Add-Migration NAZWA
        Update-Database

        */

        public TabComposerAppContext(DbContextOptions<TabComposerAppContext> options) : base(options) 
        { 
        }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<AppUser>(entity => {
                entity.Property(u => u.Active).IsRequired();
                entity.Property(u => u.CreatedAt).IsRequired();
                
                entity.HasMany(u => u.Tabulatures)
                    .WithOne(s => s.AppUser)
                    .HasForeignKey(s => s.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                
            });  

            modelBuilder.Entity<Tablature>(entity => {
                entity.HasKey(t => t.Id);

                entity.Property(t => t.Id).ValueGeneratedOnAdd();
                entity.Property(t => t.Data).IsRequired();
                entity.Property(t => t.CreatedAt).IsRequired();
                entity.Property(t => t.LastUpdatedAt).IsRequired();
                entity.Property(t => t.UserId).IsRequired();

                entity.HasOne(t => t.AppUser)
                    .WithMany(a => a.Tabulatures)
                    .HasForeignKey(t => t.UserId);
            });
            
            modelBuilder.HasDefaultSchema("identity");
        }
        
    }

 
}
