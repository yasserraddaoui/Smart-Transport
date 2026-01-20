using System.ServiceModel;
using TicketingBillingService.Models;

namespace TicketingBillingService.Services;

public class TicketingService : ITicketingService
{
    private readonly TicketStore _store;

    private static readonly Dictionary<string, double> RouteDistanceKm = new(StringComparer.OrdinalIgnoreCase)
    {
        { RouteKey("Tunis", "Ariana"), 12 },
        { RouteKey("Bab Saadoun", "La Marsa"), 18 },
        { RouteKey("Sfax", "Mahdia"), 55 },
        { RouteKey("Sousse", "Monastir"), 23 },
        { RouteKey("Bizerte", "Nabeul"), 90 },
    };

    public TicketingService(TicketStore store)
    {
        _store = store;
    }

    public TicketDto CreateTicket(TicketRequest request)
    {
        var price = CalculatePrice(new PriceRequest
        {
            Departure = request.Departure,
            Arrival = request.Arrival,
            DistanceKm = 0
        });

        var ticket = new TicketDto
        {
            PassengerName = request.PassengerName,
            BusNumber = request.BusNumber,
            Departure = request.Departure,
            Arrival = request.Arrival,
            AmountTnd = price.AmountTnd,
            Status = "PAID",
            CreatedAt = DateTimeOffset.UtcNow.ToString("O")
        };

        return _store.Add(ticket);
    }

    public PriceResponse CalculatePrice(PriceRequest request)
    {
        var distance = request.DistanceKm;
        if (distance <= 0)
        {
            distance = RouteDistanceKm.GetValueOrDefault(RouteKey(request.Departure, request.Arrival), 10);
        }

        var amount = 1.2m + (decimal)(distance * 0.05);
        return new PriceResponse { AmountTnd = Math.Round(amount, 2), Currency = "TND" };
    }

    public TicketDto GetTicketById(int id)
    {
        var ticket = _store.Get(id);
        if (ticket == null)
        {
            throw new FaultException("Ticket not found");
        }

        return ticket;
    }

    private static string RouteKey(string departure, string arrival)
    {
        return $"{departure.Trim()}|{arrival.Trim()}";
    }
}
