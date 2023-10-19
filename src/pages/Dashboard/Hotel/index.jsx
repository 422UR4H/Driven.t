import styled from "styled-components";
import Typo from "../../../components/Dashboard/Content/Typo";
import { BsPerson, BsFillPersonFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Hotel() {
const [hotels, setHotels] = useState([])
const [selectedHotel, setSelectedHotel] = useState(null)


  useEffect(() => {
    axios.get(import.meta.env.VITE_API_URL + '/hotels')
    .then(response => {
      setHotels(response.data)
      console.log(response.data)
    })
    .catch(error => {
      console.log(error)
    })
  }, [])

  return (
    <>
      <Typo variant="h4">Escolha de hotel e quarto</Typo>
      <Typo variant="h6" color="#8E8E8E">Primeiro, escolha seu hotel</Typo>
      <ContainerPai>
        <ContainerHotels>
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
          {hotels.map(hotel => (
      <HotelCard key={hotel.id} onClick={() => setSelectedHotel(hotel)} 
      selected={selectedHotel?.id === hotel.id}
    >
        <div>
          <img src={hotel.image} alt= "imagem do hotel"/>
          <h2>{hotel.name}</h2>
          <h4>Tipos de acomodação:</h4>
          <h6>Single e Double</h6>
          <h4>Vagas disponíveis:</h4>
          <h6>50</h6>
        </div>     
      </HotelCard>
      ))}
      </ContainerHotels>
      {selectedHotel && (
          <>
            <Typo variant="h6" color="#8E8E8E">Ótima pedida! Agora escolha seu quarto:</Typo>
            <ContainerRooms>
              <RoomCard>
                <p>101</p>
                <div>
                  <BsPerson size={27} />
                  <BsFillPersonFill size={27} />
                </div>
              </RoomCard>
            </ContainerRooms>
          </>
        )}
      </ContainerPai>
      </>
  )
}


const ContainerPai = styled.div`
display: flex;
flex-direction: column;
flex-wrap: wrap;
`

const ContainerHotels = styled.div`
display: flex;
margin-bottom: 15px;
`

const ContainerRooms = styled.div`
display: flex;
margin-top: 15px;
`
const RoomCard = styled.div`
width: 190px;
height: 45px;
border-radius: 10px;
border: 1px solid #CECECE;
padding: 10px;
display: flex;
justify-content: space-between;
align-items: center;

p{
color: #454545;
font-size: 20px;
font-weight: 700;
}
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
