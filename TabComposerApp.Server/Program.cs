using TabComposerApp.Server.Extensions;

using TabComposerApp.Server.Models;

var builder = WebApplication.CreateBuilder(args);

#region Services

builder.Services.AddControllers();
builder.Services.AddSwaggerExplorer().
                 InjectDbContext(builder.Configuration)
                .AddIdentityHandlersStores()
                .ConfigureIdentityOptions()
                .AddIdentityAuth(builder.Configuration)
                .InjectRepositories()
                .InjectServices()
                .ConfigureServer();
                

#endregion

var app = builder.Build();

app.ConfigureSwaggerExplorer()
   .ConfigureCORS(builder.Configuration)
   .AddIdentityAuthMiddlewares();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseResponseCompression();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.MapGroup("/api")
   .MapIdentityApi<AppUser>();

app.Run();

