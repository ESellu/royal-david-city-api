Royal David City API
Royal David City API is a .NET 10 Web API for the Royal David City Foundation, providing endpoints to manage donations, pledges, announcements, contact messages, and prayer requests.

Features
Donations and pledges management (create, list, update, delete).

Contact messages from the public to admins.

Prayer requests with optional admin responses.

Announcements for the foundation community.

Authentication and authorization using ASP.NET Core Identity.

Entity Framework Core with migrations for PostgreSQL or SQL Server.

Tech Stack
.NET 10 Web API

ASP.NET Core Identity

Entity Framework Core

PostgreSQL (or SQL Server) as the primary database

Swagger / OpenAPI for API documentation

Getting Started
Clone the repository:

bash
git clone https://github.com/ESellu/royal-david-city-api.git
cd royal-david-city-api/RoyalDavidCity.Api
Configure the database connection in appsettings.json:

text
"ConnectionStrings": {
  "RdcdfDb": "Host=localhost;Port=5432;Database=RdcdfDb;Username=youruser;Password=yourpassword",
  "AuthDb": "Host=localhost;Port=5432;Database=AuthDb;Username=youruser;Password=yourpassword"
}
Apply database migrations:

bash
dotnet ef database update --project RoyalDavidCity.Api
Run the API:

bash
dotnet run --project RoyalDavidCity.Api
The API will start on the configured URL (for example https://localhost:5001) and expose Swagger UI at /swagger.

Project Structure
RoyalDavidCity.Api/Controllers – API controllers for donations, prayer requests, contact messages, and announcements.

RoyalDavidCity.Api/Data – DbContext and configuration for the foundation data.

RoyalDavidCity.Api/Identity – Identity DbContext and user entities.

RoyalDavidCity.Api/Dtos – Data transfer objects for requests and responses.

RoyalDavidCity.Api/Services – Infrastructure services such as email sending.

RoyalDavidCity.Api/wwwroot – Static files for admin and public-facing pages.

Development Notes
Migrations are split between the main foundation database and the Auth database under Migrations and Migrations/AuthDb.

Build artifacts under bin and obj are ignored and should not be committed.

Use branches for new features and open pull requests for review before merging into main.

## Frontend (wwwroot)

This repository also includes a simple frontend served by the API from the `wwwroot` folder.

- `wwwroot/index2.html` – Public landing page for the Royal David City Foundation.
- `wwwroot/admin/index.html` – Admin dashboard for managing donations, contact messages, prayer requests, and announcements.
- `wwwroot/admin/admin.js` – Admin-side JavaScript to call the API endpoints.
- `wwwroot/js/reset-password.js` – Logic for handling password reset flows.
- `wwwroot/reset-password.html` – Reset password page used with the auth endpoints.
- `wwwroot/site.css` / `wwwroot/site.js` – Shared styles and scripts.

These assets are served directly by the ASP.NET Core app; when you run `dotnet run`, you can open the public and admin pages in your browser using the API base URL (for example `https://localhost:5001/` and `/admin`).
