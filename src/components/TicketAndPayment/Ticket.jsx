import styled from "styled-components";

export default function Ticket({ children, handleClick, isChecked }) {
    return (
        <StyledTicket onClick={handleClick} $isChecked={isChecked}>
            {children}
        </StyledTicket>
    );
}

const StyledTicket = styled.div`
    background-color: ${({ $isChecked }) => $isChecked ? '#FFEED2' : "transparent"};

    height: 145px;
    width: 100%;
    max-width: 145px;

    border-radius: 20px;
    border: ${({ $isChecked }) => $isChecked ? 'none' : "1px solid #CECECE"};

    cursor: pointer;

    & > div {
        height: inherit;
        width: inherit;
        border-radius: inherit;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
    }

    @media (max-width: 750px) {
        align-items: center;
    }
`;