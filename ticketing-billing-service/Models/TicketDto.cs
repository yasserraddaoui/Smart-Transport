using System.Runtime.Serialization;

namespace TicketingBillingService.Models;

[DataContract]
public class TicketDto
{
    [DataMember(Order = 1)]
    public int Id { get; set; }

    [DataMember(Order = 2)]
    public string PassengerName { get; set; } = string.Empty;

    [DataMember(Order = 3)]
    public string BusNumber { get; set; } = string.Empty;

    [DataMember(Order = 4)]
    public string Departure { get; set; } = string.Empty;

    [DataMember(Order = 5)]
    public string Arrival { get; set; } = string.Empty;

    [DataMember(Order = 6)]
    public decimal AmountTnd { get; set; }

    [DataMember(Order = 7)]
    public string Status { get; set; } = "PAID";

    [DataMember(Order = 8)]
    public string CreatedAt { get; set; } = string.Empty;
}
