namespace TabComposerApp.Server.Extensions
{
    public static class AppConfigExtensions
    {
        public static WebApplication ConfigureCORS(this WebApplication app, IConfiguration configuration)
        {
            app.UseCors(options => {
                options.WithOrigins("https://localhost:5173")
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
            return app;
        }
    }
}
