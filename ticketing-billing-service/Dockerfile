FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY TicketingBillingService.csproj ./
RUN dotnet restore "TicketingBillingService.csproj"
COPY . ./
RUN dotnet publish "TicketingBillingService.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8085
ENV ASPNETCORE_URLS=http://0.0.0.0:8085
ENTRYPOINT ["dotnet", "TicketingBillingService.dll"]
