import styled from "styled-components";
import Typo from "../Dashboard/Content/Typo.jsx";
import Ticket from "./Ticket.jsx";

export default function TicketContainer(props) {
    const { text1, text2, price1, price2, option, setOption } = props;
    
    return (
        <StyledTicketContainer>
            <Ticket handleClick={() => setOption(text1)} isChecked={option === text1}>
                <div>
                    <Typo variant="h6">{text1}</Typo>
                    <Typo variant="body1" color="#8E8E8E">{price1}</Typo>
                </div>
            </Ticket>
            <Ticket handleClick={() => setOption(text2)} isChecked={option === text2}>
                <div>
                    <Typo variant="h6">{text2}</Typo>
                    <Typo variant="body1" color="#8E8E8E">{price2}</Typo>
                </div>
            </Ticket>
        </StyledTicketContainer>
    );
}

const StyledTicketContainer = styled.div`
    margin-top: 17px;
    display: flex;
    flex-direction: row;
    gap: 24px;
`;
