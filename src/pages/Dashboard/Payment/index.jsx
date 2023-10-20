import { useEffect, useState } from 'react';
import styled from 'styled-components';
import PaymentForm from '../../../components/PaymentForm';
import TicketAndPayment from '../../../components/TicketAndPayment/TicketAndPayment';
import { useGetTicket } from '../../../hooks/api/useTicket';
import Typo from "../../../components/Dashboard/Content/Typo";

export default function Payment() {
  const [status, setStatus] = useState("pending");
  const [ticketType, setTicketType] = useState(undefined);
  const { getTicket } = useGetTicket();

  useEffect(() => {

    const fetchData = async () => {
  
      const ticket = await getTicket();
      if (ticket && status !== "finished") setStatus("finished");
    };

    fetchData();

  }, [status]);

  console.log(status);

  return (
    <>
      {status === "pending" && <TicketAndPayment setStatus={setStatus} setTicketType={setTicketType} /> }
      {status === "payment" && <PaymentForm ticketType={ticketType} /> }
      {status === "finished" && 
        <FinishedPaymentWrapper>
          <Typo variant="h6" color="#8E8E8E">
            O pagamento do seu ingresso já foi concluído.<br />
            Verifique as próximas opções de menu para mais detalhes.
          </Typo>
        </FinishedPaymentWrapper>
      }
    </>
  );
}

const FinishedPaymentWrapper = styled.div`
  text-align: center;
  height: 80%;

  display: flex;
  align-items: center;
  justify-content: center;
`;