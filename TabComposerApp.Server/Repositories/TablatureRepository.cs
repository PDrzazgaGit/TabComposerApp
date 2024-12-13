using Microsoft.EntityFrameworkCore;
using TabComposerApp.Server.Data;
using TabComposerApp.Server.Models;

namespace TabComposerApp.Server.Repositories
{
    public class TablatureRepository : ITablatureRepository
    {
        public readonly TabComposerAppContext _context;

        public TablatureRepository(TabComposerAppContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Tablature>> GetAllAsync() => 
            await _context.Tablatures.ToListAsync();

        public async Task<IEnumerable<Tablature>> GetUserTablaturesAsync(string userId)
        {
            return await _context.Tablatures
                .Where(x => x.UserId == userId)
                .ToListAsync();
        }

        public async Task<Tablature> GetByIdAsync(int id)
        {
            var tablature = await _context.Tablatures.FindAsync(id);
            if (tablature == null)
            {
                throw new KeyNotFoundException($"Tablature with id '{id}' does not exists.");
            }
            return tablature;
        }

        public async Task AddAsync(Tablature tabulature)
        {
            _context.Tablatures.Add(tabulature);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Tablature tabulature)
        {
            _context.Tablatures.Update(tabulature);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var tabulature = await GetByIdAsync(id);
            _context.Tablatures.Remove(tabulature);
            await _context.SaveChangesAsync();
        }
    }
}
