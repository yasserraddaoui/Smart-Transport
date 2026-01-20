using TicketingBillingService.Models;

namespace TicketingBillingService.Services;

public class TicketStore
{
    private readonly List<TicketDto> _tickets = new();
    private int _nextId = 1;

    public TicketDto Add(TicketDto ticket)
    {
        ticket.Id = _nextId++;
        _tickets.Add(ticket);
        return ticket;
    }

    public TicketDto? Get(int id)
    {
        return _tickets.FirstOrDefault(t => t.Id == id);
    }
}
