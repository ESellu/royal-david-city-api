using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RoyalDavidCity.Api.Data;
using RoyalDavidCity.Api.Identity;
using RoyalDavidCity.Api.Services;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Swagger/OpenAPI generation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DbContext with PostgreSQL for your domain data
builder.Services.AddDbContext<RdcdfDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// DbContext with PostgreSQL for Identity (same connection string)
builder.Services.AddDbContext<AuthDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

//email
builder.Services.AddScoped<IEmailSender, SmtpEmailSender>();

// ASP.NET Core Identity (simple, no roles yet)
builder.Services
    .AddDefaultIdentity<ApplicationUser>(options =>
    {
        options.SignIn.RequireConfirmedAccount = false;
        options.Lockout.MaxFailedAccessAttempts = 5;
        options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);

        options.Password.RequiredLength = 6;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequireLowercase = false;
        options.Password.RequireUppercase = false;
        options.Password.RequireDigit = false;
    })
    .AddEntityFrameworkStores<AuthDbContext>()
    .AddDefaultTokenProviders();   // <<< add this line

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Serve static files from wwwroot
app.UseStaticFiles();

app.UseAuthentication();   // <--- add this line
app.UseAuthorization();

app.MapControllers();

app.Run();
