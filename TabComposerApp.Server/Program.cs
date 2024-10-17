using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TabComposerApp.Server.Data;
using TabComposerApp.Server.Extensions;

using TabComposerApp.Server.Models;

var builder = WebApplication.CreateBuilder(args);

#region Services

builder.Services.AddControllers();
builder.Services.AddSwaggerExplorer().
                 InjectDbContext(builder.Configuration)
                .AddIdentityHandlersStores()
                .ConfigureIdentityOptions()
                .AddIdentityAuth(builder.Configuration);

#endregion

var app = builder.Build();

app.ConfigureSwaggerExplorer()
   .ConfigureCORS(builder.Configuration)
   .AddIdentityAuthMiddlewares();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseHttpsRedirection();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.MapGroup("/api")
   .MapIdentityApi<AppUser>();

app.Run();

