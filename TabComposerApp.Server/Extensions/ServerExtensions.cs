using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Options;
using TabComposerApp.Server.Services;

namespace TabComposerApp.Server.Extensions
{
    public static class ServerExtensions
    {
        public static IServiceCollection ConfigureServer(this IServiceCollection services)
        {
            services.Configure<IISServerOptions>(options =>
            {
                options.MaxRequestBodySize = long.MaxValue;
            });

            services.Configure<KestrelServerOptions>(options => {
                options.Limits.MaxRequestBodySize = long.MaxValue;
            });

            services.AddResponseCompression(options =>
            {
                options.EnableForHttps = true;
            });

            services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.MaxDepth = 2147483644;  
                options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
            });

            return services;
        }
    }
}
