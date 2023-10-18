import styled from "styled-components";
import Typo from "../../../components/Dashboard/Content/Typo";

export default function Hotel() {
  return (
    <>
      <Typo variant="h4">Escolha de hotel e quarto</Typo>
      <Typo variant="h6" color="#8E8E8E">Primeiro, escolha seu hotel</Typo>
      <ContainerPai>
      <HotelCard>
        <div>
          <img src="https://www.cruzeiro.com.br/media/fotos_noticias/17/03/2022/temp_wJELp6V.png" alt="" />
          <h2>Cruzeiro</h2>
          <h4>Tipos de acomodação:</h4>
          <h6>Single e Double</h6>
          <h4>Vagas disponíveis:</h4>
          <h6>50</h6>
        </div>     
      </HotelCard>
      <HotelCard>
        <div>
          <img src="https://www.cruzeiro.com.br/media/fotos_noticias/17/03/2022/temp_wJELp6V.png" alt="" />
          <h2>Cruzeiro</h2>
          <h4>Tipos de acomodação:</h4>
          <h6>Single e Double</h6>
          <h4>Vagas disponíveis:</h4>
          <h6>50</h6>
        </div>     
      </HotelCard>
      </ContainerPai>
      </>
  )
}


const ContainerPai = styled.div`
display: flex;
flex-wrap: wrap;
`

const HotelCard = styled.div`
margin: 10px;
width: 196px;
height: 264px;
border-radius: 10px;
background: #EBEBEB;
font-family: 'Roboto';

img {
width: 168px;
height: 109px;
border-radius: 5px;
background: lightgray 50% / cover no-repeat;
background-size: contain;
margin: 16px 14px 10px 14px;
}

h2{
color: #343434;
font-size: 20px;
font-weight: 400;
line-height: normal;
margin: 0 14px 0 14px;
}

h4{
color: #3C3C3C;
font-size: 12px;
font-weight: 700;
margin: 14px 14px 3px 14px;
}

h6{
color: #3C3C3C;
font-size: 12px;
font-weight: 400;
margin: 0 14px 16px 14px;
}
`