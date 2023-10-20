import { useState } from 'react';
import PaymentForm from '../../../components/PaymentForm';
import TicketAndPayment from '../../../components/TicketAndPayment/TicketAndPayment.jsx';

export default function Payment() {
  const [status, setStatus] = useState("pending");
  const [ticketType, setTicketType] = useState(undefined);
  return (
    <>
      {status === "pending" ?
        <TicketAndPayment setStatus={setStatus} setTicketType={setTicketType} /> :
        <PaymentForm ticketType={ticketType} />
      }
    </>
  );
}
