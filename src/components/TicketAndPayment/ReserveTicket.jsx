import styled from "styled-components"
import Typo from "../Dashboard/Content/Typo.jsx"
import Button from "../Form/Button.jsx";

export default function ReserveTicket({ value }) {
    return (
        <StyledReserveTicket>
            <Typo variant="h6" color="#8E8E8E">
                Fechado! O total ficou em R$ {value}. Agora é só confirmar:
            </Typo>
            <Button /*onClick={onClick}*/>
                RESERVAR INGRESSO
            </Button>
        </StyledReserveTicket>
    );
}

const StyledReserveTicket = styled.div`
    
`