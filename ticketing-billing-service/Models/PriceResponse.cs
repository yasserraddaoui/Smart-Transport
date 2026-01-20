using System.Runtime.Serialization;

namespace TicketingBillingService.Models;

[DataContract]
public class PriceResponse
{
    [DataMember(Order = 1)]
    public decimal AmountTnd { get; set; }

    [DataMember(Order = 2)]
    public string Currency { get; set; } = "TND";
}
