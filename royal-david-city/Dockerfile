 # Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY RoyalDavidCity.Api/*.csproj ./RoyalDavidCity.Api/
RUN dotnet restore RoyalDavidCity.Api/RoyalDavidCity.Api.csproj

COPY . .
WORKDIR /src/RoyalDavidCity.Api
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "RoyalDavidCity.Api.dll"]

