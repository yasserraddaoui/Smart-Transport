import { useState } from "react";
import PageHeader from "../ui/primitives/PageHeader";
import Card from "../ui/primitives/Card";
import TextField from "../ui/primitives/TextField";
import { useToast } from "../hooks/useToast";
import { getErrorMessage } from "../services/api";
import * as ticketingService from "../services/ticketingService";

export default function TicketingPage() {
  const toast = useToast();
  const [result, setResult] = useState<string>("-");

  const [passengerName, setPassengerName] = useState("Amira Trabelsi");
  const [busNumber, setBusNumber] = useState("BUS-TN-001");
  const [departure, setDeparture] = useState("Bab Saadoun");
  const [arrival, setArrival] = useState("La Marsa");
  const [ticketId, setTicketId] = useState("1");

  async function run(label: string, fn: () => Promise<string>) {
    try {
      const res = await fn();
      setResult(res);
      toast.success("Requete envoyee", label);
    } catch (e) {
      const msg = getErrorMessage(e);
      setResult(msg);
      toast.error("Erreur", msg);
    }
  }

  return (
    <>
      <PageHeader
        title="Billetterie SOAP"
        description="Creation de tickets et calcul des prix en dinar tunisien (TND)."
      />
      <div className="grid2">
        <Card title="Operations SOAP" subtitle="createTicket, calculatePrice, getTicketById">
          <div className="row">
            <TextField id="passengerName" label="Passager" value={passengerName} onChange={setPassengerName} />
            <TextField id="busNumber" label="Bus" value={busNumber} onChange={setBusNumber} />
          </div>
          <div className="row">
            <TextField id="departure" label="Depart" value={departure} onChange={setDeparture} />
            <TextField id="arrival" label="Arrivee" value={arrival} onChange={setArrival} />
          </div>
          <div className="row">
            <TextField id="ticketId" label="Ticket ID" value={ticketId} onChange={setTicketId} type="number" />
          </div>
          <div className="actions" style={{ marginTop: 12 }}>
            <button
              className="btn"
              onClick={() =>
                run("CreateTicket", () =>
                  ticketingService.createTicket({ passengerName, busNumber, departure, arrival }),
                )
              }
            >
              Creer ticket
            </button>
            <button
              className="btn btnSecondary"
              onClick={() => run("CalculatePrice", () => ticketingService.calculatePrice({ departure, arrival }))}
            >
              Calculer prix
            </button>
            <button
              className="btn btnSecondary"
              onClick={() => run("GetTicketById", () => ticketingService.getTicketById(Number(ticketId)))}
            >
              Obtenir ticket
            </button>
          </div>
        </Card>

        <Card title="Reponse XML" subtitle="SOAP brut">
          <div className="monoBox">{result}</div>
        </Card>
      </div>
    </>
  );
}
