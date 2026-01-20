import { api } from "./api";

const SOAP_ENDPOINT = "/ticketing";
const SOAP_NS = "http://tempuri.org/";

function soapEnvelope(body: string) {
  return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="${SOAP_NS}">
  <soap:Body>
    ${body}
  </soap:Body>
</soap:Envelope>`;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function postSoap(action: string, body: string): Promise<string> {
  const res = await api.post<string>(SOAP_ENDPOINT, soapEnvelope(body), {
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      SOAPAction: `${SOAP_NS}${action}`,
    },
    responseType: "text",
    transformResponse: (data) => data,
  });
  return typeof res.data === "string" ? res.data : String(res.data);
}

export async function createTicket(payload: {
  passengerName: string;
  busNumber: string;
  departure: string;
  arrival: string;
}): Promise<string> {
  return postSoap(
    "CreateTicket",
    `<tns:CreateTicket>
      <request>
        <PassengerName>${escapeXml(payload.passengerName)}</PassengerName>
        <BusNumber>${escapeXml(payload.busNumber)}</BusNumber>
        <Departure>${escapeXml(payload.departure)}</Departure>
        <Arrival>${escapeXml(payload.arrival)}</Arrival>
      </request>
    </tns:CreateTicket>`,
  );
}

export async function calculatePrice(payload: { departure: string; arrival: string; distanceKm?: number }): Promise<string> {
  const distance = payload.distanceKm ?? 0;
  return postSoap(
    "CalculatePrice",
    `<tns:CalculatePrice>
      <request>
        <Departure>${escapeXml(payload.departure)}</Departure>
        <Arrival>${escapeXml(payload.arrival)}</Arrival>
        <DistanceKm>${distance}</DistanceKm>
      </request>
    </tns:CalculatePrice>`,
  );
}

export async function getTicketById(id: number): Promise<string> {
  return postSoap(
    "GetTicketById",
    `<tns:GetTicketById>
      <id>${id}</id>
    </tns:GetTicketById>`,
  );
}
