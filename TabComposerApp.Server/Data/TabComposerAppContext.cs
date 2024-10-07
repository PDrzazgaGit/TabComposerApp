using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using TabComposerApp.Server.Models;

namespace TabComposerApp.Server.Data
{
    public class TabComposerAppContext : IdentityDbContext<User>
    {
        public DbSet<Song> Songs = null!;
        public DbSet<Tabulature> Tabulatures = null!;
        public DbSet<Comment> Comments = null!;

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

            modelBuilder.Entity<User>(entity => {

                entity.Property(u => u.Active).IsRequired();
                entity.Property(u => u.CreatedAt).IsRequired();
                
                entity.HasMany(u => u.Songs)
                    .WithOne(s => s.User)
                    .HasForeignKey(s => s.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                
            });
            
            modelBuilder.Entity<Song>(entity => {
                entity.HasKey(s => s.Id);

                entity.Property(s => s.Id).ValueGeneratedOnAdd();
                entity.Property(s => s.Title).IsRequired().HasMaxLength(60);
                entity.Property(s => s.Description).HasMaxLength(1000);
                entity.Property(s => s.Public).IsRequired();
                entity.Property(s => s.CreatedAt).IsRequired();
                entity.Property(s => s.UserId).IsRequired();

                entity.HasMany(s => s.Tabulatures)
                      .WithOne(t => t.Song)
                      .HasForeignKey(t => t.SongId)
                      .OnDelete(DeleteBehavior.Cascade); 

                entity.HasMany(s => s.Comments)
                      .WithOne(c => c.Song)
                      .HasForeignKey(c => c.SongId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Tabulature>(entity => {
                entity.HasKey(t => t.Id);

                entity.Property(t => t.Id).ValueGeneratedOnAdd();
                entity.Property(t => t.Name).IsRequired().HasMaxLength(30);
                entity.Property(t => t.Tuning).IsRequired().HasMaxLength(10);
                entity.Property(t => t.Notes).IsRequired();
                entity.Property(t => t.CreatedAt).IsRequired();
                entity.Property(t => t.LastUpdatedAt).IsRequired();
                entity.Property(t => t.SongId).IsRequired();

                entity.HasOne(t => t.Song)
                    .WithMany(s => s.Tabulatures)
                    .HasForeignKey(t => t.SongId);
            });

            modelBuilder.Entity<Comment>(entity => {
                entity.HasKey(c => c.Id);

                entity.Property(c => c.Id).ValueGeneratedOnAdd();
                entity.Property(c => c.Content).IsRequired().HasMaxLength(1000);
                entity.Property(c => c.CreatedAt).IsRequired();
                entity.Property(c => c.SongId).IsRequired();

                entity.HasOne(c => c.Song)
                    .WithMany(s => s.Comments)
                    .HasForeignKey(c => c.SongId);
            });
            
            modelBuilder.HasDefaultSchema("identity");
        }
        
    }

 
}
