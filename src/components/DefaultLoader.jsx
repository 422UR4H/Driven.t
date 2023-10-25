import React from 'react'
import Loader from 'react-loader-spinner';
import styled from 'styled-components';
import Typo from './Dashboard/Content/Typo.jsx';

export default function DefaultLoader() {
  return (
    <StyledLoader>
      <Loader
        height="100"
        width="100"
        color="#FF4791"
      />
      <Typo variant="h6" color="#8E8E8E">Carregando informações...</Typo>
    </StyledLoader>
  );
}

const StyledLoader = styled.div`
  margin-top: 25%;
  margin-right: 5%;
  text-align: center;
`;