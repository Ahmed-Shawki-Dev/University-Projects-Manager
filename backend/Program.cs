using System.Text;
using System.Text.Json.Serialization;
using backend.Data;
using backend.DTOs;
using backend.Extensions;
using backend.Filters;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var builder = WebApplication.CreateBuilder(args);

// DI
builder.Services.AddScoped<TokenService>();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddScoped<CheckFacultyContextFilter>();

builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(typeof(Program).Assembly));

// OpenAPI
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer<BearerSecuritySchemeTransformer>();
});

builder
    .Services.AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter())
    );
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = actionContext =>
    {
        var errors = actionContext
            .ModelState.Values.SelectMany(v => v.Errors)
            .Select(e => e.ErrorMessage)
            .ToList();

        var response = new ApiResponse<object>
        {
            IsSuccess = false,
            Message = "Validation Failed",
            Data = new List<object>(),
            Errors = errors,
        };

        return new BadRequestObjectResult(response);
    };
});

// Auth Config
builder
    .Services.AddIdentity<AppUser, IdentityRole<Guid>>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder
    .Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["JWT:Issuer"],

            ValidateAudience = true,
            ValidAudience = builder.Configuration["JWT:Audience"],

            ValidateLifetime = true,

            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["JWT:Secret"]!)
            ),
            RoleClaimType = "userRole",
        };
    });

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options =>
    {
        options.WithTitle("University Project API").WithTheme(ScalarTheme.Saturn);
    });
}
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// For File Upload
app.UseStaticFiles();

// Automatic Migrations & Data Seeding on Startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();

    try
    {
        // 1. Apply Pending EF Core Migrations
        var context = services.GetRequiredService<ApplicationDbContext>();
        await context.Database.MigrateAsync();
        logger.LogInformation("Database migrations applied successfully.");

        // 2. Seed Identity Roles
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
        await IdentitySeed.SeedRolesAsync(roleManager);
        logger.LogInformation("Identity roles seeded successfully.");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while migrating or seeding the database.");
    }
}
app.Run();
