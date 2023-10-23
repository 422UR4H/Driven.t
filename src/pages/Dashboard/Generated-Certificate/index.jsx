import React from 'react';
import { useLocation } from 'react-router-dom';
import logo from '../../../assets/images/logo.png';
import Page from '../../../components/Page';
import { StyledContainer as Container, Row } from '../../../components/Auth';
import styled from 'styled-components';
import Typo from '../../../components/Dashboard/Content/Typo';


export default function GeneratedCertificate() {
    const location = useLocation();
    const userInfo = location.state;
    if(!userInfo) return (<Typo variant='h1'>Erro ao gerar certificado</Typo>);
    return (
        <Page style={{background: "#CECECE"}}>
            <StyledContainer width="1322px" height="864px" style={{position:'relative'}}>
                <Row style={{ marginLeft:'200px', justifyContent: 'center', alignItems: 'center', height:'634px', width:'1009px' }}>
                <LeftGray />
                    <h1 style={{fontSize:'128px'}}>CERTIFICADO</h1>
                    <h2 style={{fontSize:'32px'}}>Certificamos, para todos os  devidos fins, de que a(o):</h2>
                    <h3 style={{fontSize:'96px'}}>{userInfo?.name}</h3>
                    <p style={{fontSize:'32px', textAlign:'left'}}>
                    Com documento XXX.XXX.XXX-XX participou do evento {userInfo?.eventName}, de forma {userInfo?.participationMode?.toUpperCase()}, entre os dias {userInfo?.enrollDate} e {userInfo?.endDate}.</p>
                    <img src={logo} alt="" />
                </Row>
            </StyledContainer>
        </Page>
    )
}

const StyledContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
 
  * {
    gap: 31px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    color: #000;
    font-family: Roboto;
  }
  
  & > * {
    text-align: center;
  }

  @media (max-width: 600px) {
    flex-direction: column-reverse;
  }
`;

const LeftGray = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background-color: #ddd;
    box-shadow: 2px 0 10px 0 rgba(0,0,0,0.1);
    width: 128px;
    flex-shrink: 0;
`;
