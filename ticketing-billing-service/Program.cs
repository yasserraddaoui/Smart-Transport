using SoapCore;
using TicketingBillingService.Services;
using System.ServiceModel;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSoapCore();
builder.Services.AddSingleton<TicketStore>();
builder.Services.AddSingleton<ITicketingService, TicketingService>();

var app = builder.Build();

app.UseRouting();
app.UseEndpoints(endpoints =>
{
    var encoder = new SoapEncoderOptions
    {
        MessageVersion = MessageVersion.Soap11,
        WriteEncoding = Encoding.UTF8
    };
    endpoints.UseSoapEndpoint<ITicketingService>("/ticketing", encoder, SoapSerializer.DataContractSerializer);
});

app.MapGet("/", () => "Ticketing Billing Service Tunisia is running");

app.Run();
