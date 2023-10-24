import React from 'react'
import styled from 'styled-components';

export default function HotelCard({ name, image, availableVacancy, roomName, selected = false, onClick }) {
    return (
        <SCHotelCard $selected={selected.toString()} onClick={onClick}>
            <img src={image || '/vite.svg'} alt="imagem do hotel" />
            <h2>{name || 'Hotel name'}</h2>
            <h4>Tipos de acomodação: N/A</h4>
            <h6>Single e Double: N/A</h6>
            <h4>Vagas disponíveis:</h4>
            <h6>{availableVacancy || 0}</h6>
            {roomName && <h4>Quarto Reservado: {roomName}</h4>}
        </SCHotelCard>
    )
}

const SCHotelCard = styled.div`
  margin: 10px;
  width: 196px;
  height: 264px;
  border-radius: 10px;
  background: ${(props) => (props.$selected == 'true' ? '#FFEED2' : '#ebebeb')};
  font-family: 'Roboto';
  cursor: pointer;
  &:hover{
    opacity: 0.8;
  }
  img {
    width: 168px;
    height: 109px;
    border-radius: 5px;
    background: lightgray 50% / cover no-repeat;
    background-size: contain;
    margin: 16px 14px 10px 14px;
  }

  h2 {
    color: #343434;
    font-size: 20px;
    font-weight: 400;
    line-height: normal;
    margin: 0 14px 0 14px;
  }

  h4 {
    color: #3c3c3c;
    font-size: 12px;
    font-weight: 700;
    margin: 14px 14px 3px 14px;
  }

  h6 {
    color: #3c3c3c;
    font-size: 12px;
    font-weight: 400;
    margin: 0 14px 16px 14px;
  }
`;