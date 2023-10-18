import styled from 'styled-components';

export const TicketWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-wrap: wrap;
  gap: 10px;
  margin: 25px 0;
  > div {
    height: 110px;
    width: 275px;
    margin: 0 10px 0 0;
    background-color: #FFEED2;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 750px) {
    align-items: center;
  }
`;