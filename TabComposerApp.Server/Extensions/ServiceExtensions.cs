using Microsoft.EntityFrameworkCore;
using TabComposerApp.Server.Data;
using TabComposerApp.Server.Services;

namespace TabComposerApp.Server.Extensions
{
    public static class ServiceExtensions
    {
        public static IServiceCollection InjectServices(this IServiceCollection services)
        {
            services.AddScoped<ITablatureService, TablatureService>();
            return services;
        }
    }
}
