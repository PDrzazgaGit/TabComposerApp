using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using TabComposerApp.Server.Data;

namespace TabComposerApp.Server
{
    public class Startup
    {
        private IConfiguration _config;

        public Startup(IConfiguration config)
        {
            _config = config;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
            
            services.AddDbContextPool<TabComposerAppContext>(options =>
            {
                options.UseSqlServer(_config.GetConnectionString("TabComposerDBConnection"));
            });
            
        }
    }
}
