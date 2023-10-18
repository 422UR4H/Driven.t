import styled from 'styled-components';

export const PaymentWrapper = styled.div`
  display: flex;
  width: 100%;

  img {
    width: 325px;
    height: 200px;
  }

  @media (max-width: 750px) {
    flex-direction: column;
    align-items: center;
  }
`;
