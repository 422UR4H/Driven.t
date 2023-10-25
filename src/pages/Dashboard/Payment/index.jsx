import { useEffect, useState } from 'react';
import styled from 'styled-components';
import PaymentForm from '../../../components/PaymentForm';
import TicketAndPayment from '../../../components/TicketAndPayment/TicketAndPayment';
import { useGetTicket } from '../../../hooks/api/useTicket';
import Typo from "../../../components/Dashboard/Content/Typo";
import Loader from 'react-loader-spinner';
import useTicketTypes from '../../../hooks/api/useTicketTypes.js';
import useEnrollment from '../../../hooks/api/useEnrollment.js';

export default function Payment() {
  const [status, setStatus] = useState("pending");
  const { enrollment, enrollmentLoading } = useEnrollment();
  const { getTicket, ticketLoading } = useGetTicket();
  const {
      ticketTypes,
      ticketTypesProcess,
      ticketTypesLoading
  } = useTicketTypes();

  useEffect(() => {
    const fetchData = async () => {
      const ticket = await getTicket();
      if (ticket && status !== "finished") setStatus("finished");
      await ticketTypesProcess();
    };
    fetchData();
  }, [status]);

  function isLoading() {
    return ticketLoading || ticketTypesLoading || enrollmentLoading;
  }

  return (
    <>
      <Typo variant="h4">Ingressos e pagamento</Typo>

      {isLoading() &&
        <StyledLoader>
          <Loader
            height="100"
            width="100"
            color="#FF4791"
            secondaryColor='#FFD77F'
            radius='12.5'
            ariaLabel="mutating-dots-loading"
            visible={true}
          />
        </StyledLoader>
      }

      {(status === "pending" && !isLoading()) &&
        <TicketAndPayment
          setStatus={setStatus}
          setTicketType={ticketTypesProcess}
          ticketTypes={ticketTypes}
          hasEnrollment={!!enrollment}
        />
      }

      {status === "payment" &&
        <PaymentForm
          ticketType={ticketTypes}
        />
      }

      {status === "finished" &&
        <FinishedPaymentWrapper>
          <Typo variant="h6" color="#8E8E8E">
            O pagamento do seu ingresso foi concluído.<br />
            Verifique o menu de opções para mais detalhes.
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

const StyledLoader = styled.div`
  margin-top: 25%;
  margin-right: 5%;
  text-align: center;
`;
