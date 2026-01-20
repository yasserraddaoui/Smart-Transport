using System.Runtime.Serialization;

namespace TicketingBillingService.Models;

[DataContract]
public class PriceRequest
{
    [DataMember(Order = 1)]
    public string Departure { get; set; } = string.Empty;

    [DataMember(Order = 2)]
    public string Arrival { get; set; } = string.Empty;

    [DataMember(Order = 3)]
    public double DistanceKm { get; set; }
}
