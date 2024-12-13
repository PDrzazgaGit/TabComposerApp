using TabComposerApp.Server.Models;

namespace TabComposerApp.Server.Repositories
{
    public interface ITablatureRepository
    {
        Task<IEnumerable<Tablature>> GetAllAsync();
        Task<IEnumerable<Tablature>> GetUserTablaturesAsync(string id);
        Task<Tablature> GetByIdAsync(int id);
        Task AddAsync(Tablature tablature);
        Task UpdateAsync(Tablature tablature);
        Task DeleteAsync(int id);
    }
}
