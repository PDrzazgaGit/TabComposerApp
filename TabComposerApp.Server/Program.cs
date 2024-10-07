using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TabComposerApp.Server.Data;

using TabComposerApp.Server.Models;

var builder = WebApplication.CreateBuilder(args);

#region Services

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthorization();
builder.Services.AddAuthentication().AddCookie(IdentityConstants.ApplicationScheme);

builder.Services.AddIdentityCore<User>()
    .AddEntityFrameworkStores<TabComposerAppContext>()
    .AddApiEndpoints();

builder.Services.AddDbContextPool<TabComposerAppContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("TabComposerDBConnection"));
});

#endregion

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.MapIdentityApi<User>();

app.Run();