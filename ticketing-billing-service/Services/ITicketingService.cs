using System.ServiceModel;
using TicketingBillingService.Models;

namespace TicketingBillingService.Services;

[ServiceContract]
public interface ITicketingService
{
    [OperationContract]
    TicketDto CreateTicket(TicketRequest request);

    [OperationContract]
    PriceResponse CalculatePrice(PriceRequest request);

    [OperationContract]
    TicketDto GetTicketById(int id);
}
