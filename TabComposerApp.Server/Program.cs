using TabComposerApp.Server;

var builder = WebApplication.CreateBuilder(args);

var startup = new Startup(builder.Configuration);
// Add services to the container.

startup.ConfigureServices(builder.Services);

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

app.Run();