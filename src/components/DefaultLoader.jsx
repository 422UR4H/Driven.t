import React from 'react'
import Loader from 'react-loader-spinner';
import styled from 'styled-components';

export default function DefaultLoader() {
  return (
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
  );
}

const StyledLoader = styled.div`
  margin-top: 25%;
  margin-right: 5%;
  text-align: center;
`;