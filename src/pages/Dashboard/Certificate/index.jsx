import { useContext, useEffect, useState } from 'react';
import Typo from "../../../components/Dashboard/Content/Typo";
import Button from '../../../components/Form/Button';
import { Row } from '../../../components/Auth';
import { useNavigate } from 'react-router-dom';
import EventInfoContext from '../../../contexts/EventInfoContext';
import useIsDateAfter from '../../../hooks/useIsDateAfter';
import useEnrollment from '../../../hooks/api/useEnrollment';
import { useGetTicket } from '../../../hooks/api/useTicket';
import styled from 'styled-components';
import Loader from 'react-loader-spinner';


/*
- Para usuários presenciais, é necessário que ele tenha participado de pelo menos cinco atividades durante todos os dias do evento.
*/

// rota backend para pegar as atividades de um usuario

export default function Certificate() {
  const [isEventFinished, setIsEventFinished] = useState(false);
  const { eventInfo } = useContext(EventInfoContext);
  const isAfterEvent = useIsDateAfter(eventInfo?.endsAt);
  const { ticketLoading, ticket, ticketError } = useGetTicket();
  const [loading, setLoading] = useState(false);
  const { enrollmentLoading, enrollment, enrollmentError } = useEnrollment();
  const user = {
    name: enrollment?.name,
    documentNumber: enrollment?.cpf,
    eventName: eventInfo?.title,
    enrollDate: enrollment?.createdAt?.split('T')[0].split('-').reverse().join('/'),
    endDate: eventInfo?.endsAt?.split('T')[0].split('-').reverse().join('/'),
    participationMode: ticket?.ticketType?.isRemote ? "Remota" : "Presencial"
  }

  useEffect(() => {
    setLoading(ticketLoading || enrollmentLoading || !eventInfo);
  }, [ticketLoading, enrollmentLoading, eventInfo]);

  useEffect(() => {
    setIsEventFinished(isAfterEvent);
  }, [eventInfo]);



  const navigate = useNavigate();
  function generateCertificate() {
    navigate('/my-certificate', { state: user });
  }

  return (
    <Row style={{
      gap: '12px',
      justifyContent: 'flex-start',
      alignItems: 'flex-start'
    }}>
      <Typo variant='h3'>Certificado</Typo>
      {
        isEventFinished && !loading ?
          <>
            <Typo variant="h6" color="#8E8E8E">Clique no botão abaixo para gerar seu certificado de participação</Typo>
            <Button style={{ marginTop: 100 }} onClick={generateCertificate}>Gerar certificado</Button>
          </>

          :
          loading ?
            <StupidMUI>
              <Loader
                height="100"
                width="100"
                color="#FF4791"
                secondaryColor='#FFD77F'
                radius='12.5'
                ariaLabel="mutating-dots-loading"
                visible={true}
              />
              <Typo variant="h6" color="#8E8E8E">Carregando informações...</Typo>
            </StupidMUI>

            :
            (enrollmentError || ticketError) ?
              <>
                <Typo variant="h6" color="#8E8E8E">Erro ao carregar informações</Typo>
              </>
              :
              <StupidMUI>
                <Typo variant="h6" color="#8E8E8E">O certificado ficará disponível apenas 1 dia após a realização do evento.</Typo>
              </StupidMUI>
      }
    </Row>
  );
}

const StupidMUI = styled.div`
  width: 100%;
  margin-top: 25%;
  margin-left: 25%;
  text-align: center;
  transform: translateX(-25%);
`;


