using System.Runtime.Serialization;

namespace TicketingBillingService.Models;

[DataContract]
public class TicketRequest
{
    [DataMember(Order = 1)]
    public string PassengerName { get; set; } = string.Empty;

    [DataMember(Order = 2)]
    public string BusNumber { get; set; } = string.Empty;

    [DataMember(Order = 3)]
    public string Departure { get; set; } = string.Empty;

    [DataMember(Order = 4)]
    public string Arrival { get; set; } = string.Empty;
}
