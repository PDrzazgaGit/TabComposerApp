using TabComposerApp.Server.Data;
using Microsoft.EntityFrameworkCore;

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
    }
}
