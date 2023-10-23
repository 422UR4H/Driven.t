import styled from 'styled-components';
import Typo from '../../../components/Dashboard/Content/Typo';
import { BsPerson } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import axios from 'axios';
import useToken from '../../../hooks/useToken';

export default function Hotel() {
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingInfo, setBookingInfo] = useState(false);
  const token = useToken();

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + '/hotels', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setHotels(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function showRooms(hotel) {
    axios
      .get(import.meta.env.VITE_API_URL + `/hotels/${hotel.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setSelectedHotel(hotel);
        setRooms([]);
        setRooms(response.data.Rooms);
        console.log(response.data.Rooms);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function booking() {
    const data = {
      userId: selectedHotel.id,
      roomId: selectedRoom.id,
    };

    axios
      .post(import.meta.env.VITE_API_URL + '/booking', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setBookingInfo(true);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  if (bookingInfo) {
    return (
      <>
        <Typo variant="h4">Escolha de hotel e quarto</Typo>
        <Typo variant="h6" color="#8E8E8E">
          Você já escolheu seu quarto
        </Typo>
        <HotelCard key={selectedHotel.id} selected={true}>
          <div>
            <img src={selectedHotel.image} alt="imagem do hotel" />
            <h2>{selectedHotel.name}</h2>
            <h4>Quarto Reservado:</h4>
            <h6>{selectedRoom.name}</h6>
          </div>
        </HotelCard>
        <Button>Trocar de quarto</Button>
      </>
    );
  }

  return (
    <>
      <Typo variant="h4">Escolha de hotel e quarto</Typo>
      <Typo variant="h6" color="#8E8E8E">
        Primeiro, escolha seu hotel
      </Typo>
      <ContainerPai>
        <ContainerHotels>
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} onClick={() => showRooms(hotel)} selected={selectedHotel?.id === hotel.id}>
              <div>
                <img src={hotel.image} alt="imagem do hotel" />
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
            <Typo variant="h6" color="#8E8E8E">
              Ótima pedida! Agora escolha seu quarto:
            </Typo>
            <ContainerRooms>
              {rooms.map((room) => (
                <RoomCard key={room.id} selected={selectedRoom?.id === room.id} onClick={() => setSelectedRoom(room)}>
                  <p>{room.name}</p>
                  <div>
                    {Array.from({ length: room.capacity }).map((_, index) => (
                      <BsPerson key={index} />
                    ))}
                  </div>
                </RoomCard>
              ))}
            </ContainerRooms>
          </>
        )}
        {selectedRoom && <Button onClick={booking}>RESERVAR QUARTO</Button>}
      </ContainerPai>
    </>
  );
}

const ContainerPai = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;

const ContainerHotels = styled.div`
  display: flex;
  margin-bottom: 15px;
`;

const ContainerRooms = styled.div`
  display: flex;
  margin-top: 15px;
  flex-wrap: wrap;
`;
const RoomCard = styled.div`
  width: 190px;
  height: 45px;
  border-radius: 10px;
  border: 1px solid #cecece;
  margin: 10px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${(props) => (props.selected ? '#FFEED2' : '#ffffff')};

  p {
    color: #454545;
    font-size: 20px;
    font-weight: 700;
  }
`;
const HotelCard = styled.div`
  margin: 10px;
  width: 196px;
  height: 264px;
  border-radius: 10px;
  background: ${(props) => (props.selected ? '#FFEED2' : '#ebebeb')};
  font-family: 'Roboto';

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

const Button = styled.button`
  width: 182px;
  height: 37px;
  margin: 10px;
  border-radius: 4px;
  background: #e0e0e0;
  border: none;
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.25);
`;
