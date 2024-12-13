using TabComposerApp.Server.Data;
using Microsoft.EntityFrameworkCore;
using TabComposerApp.Server.Repositories;

namespace TabComposerApp.Server.Extensions
{
    public static class EFCExtensions
    {
        public static IServiceCollection InjectDbContext(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContextPool<TabComposerAppContext>(options =>
            {
                options.UseSqlServer(configuration.GetConnectionString("TabComposerDBConnection"));
            });
            return services;
        }

        public static IServiceCollection InjectRepositories(this IServiceCollection services)
        {
            services.AddScoped<ITablatureRepository, TablatureRepository>();
            return services;
        }
    }
}
