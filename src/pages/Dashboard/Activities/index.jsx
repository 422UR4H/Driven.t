import { useEffect, useState } from "react";
import styled from 'styled-components';
import SelectDay from "../../../components/Activity/SelectDay";
import SelectActivity from "../../../components/Activity/SelectActivity";
import Typo from "../../../components/Dashboard/Content/Typo";
import useEnrollment from "../../../hooks/api/useEnrollment";
import { useGetTicket } from "../../../hooks/api/useTicket";

export default function Activities() {

  const [selectedDay, setSelectedDay] = useState(null);
  const [validOperation, setValidOperation] = useState(false);

  const { enrollment } = useEnrollment();
  const { ticket } = useGetTicket();

  useEffect(() => {
    validateUserOperation();
  }, [enrollment]);

  function validateUserOperation() {

    let isValidOperation = true;
    let message = null;

    if (!enrollment) {
      message = `Você precisa completar sua inscrição antes de prosseguir pra escolha de atividades`;
    }

    else if (!ticket) {
      message = `Você precisa efetuar o pagamento do seu ingresso antes de prosseguir pra escolha de atividades`;
    }

    else if (ticket.TicketType.isRemote) {
      message = `O tipo do seu ingresso não permite a escolha de atividades`;
    }

    if (message !== null) {
      isValidOperation = false;
    } else {
      setValidOperation(true);
    }

    return { isValidOperation, message };
  }

  if (!validOperation) {

    const { message } = validateUserOperation();
    return (
      <>
        <Typo variant="h4">Escolha de atividades</Typo>
        <VoidContainer>
          <Typo variant="h6" color="#8E8E8E">{message}</Typo>
        </VoidContainer>
      </>
    )
  }

  return (
    <>
      <Typo variant="h4">Escolha de atividades</Typo>
      <SelectDay
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
      />
      {selectedDay &&
        <SelectActivity selectedDay={selectedDay} />
      }
    </>
  )
}

const VoidContainer = styled.div`
    text-align: center;
    height: 80%;

    display: flex;
    align-items: center;
    justify-content: center;
`;