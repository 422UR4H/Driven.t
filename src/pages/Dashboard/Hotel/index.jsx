import styled from 'styled-components';
import Typo from '../../../components/Dashboard/Content/Typo';
import { BsPerson, BsPersonFill } from 'react-icons/bs';
import { useContext, useEffect, useState } from 'react';
import useToken from '../../../hooks/useToken';
import HotelCard from '../../../components/HotelCard';
import { postBooking, getBooking, getHotelsWithAllRooms, changeBooking } from '../../../services/hotelApi';
import { v4 as uuid } from 'uuid';
import DefaultLoader from '../../../components/DefaultLoader.jsx';
import useEnrollment from '../../../hooks/api/useEnrollment';
import { useGetTicket } from '../../../hooks/api/useTicket';
import UserContext from '../../../contexts/UserContext';

export default function Hotel() {
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [reservedRoom, setReservedRoom] = useState(false);
  const [userHasBooked, setUserHasBooked] = useState(false);
  const [inChangeMode, setInChangeMode] = useState(false);
  const [creatingBooking, setCreatingBooking] = useState(false);
  const [gettingNewHotels, setGettingNewHotels] = useState(false);
  const token = useToken();
  const [loading, setLoading] = useState(false);
  const {userData} = useContext(UserContext);
  const [ validOperation, setValidOperation ] = useState(null);
  const { enrollment } = useEnrollment();
  const { ticket } = useGetTicket();

  useEffect(() => {

    const { isValidOperation } = validateUserOperation();
    if (!isValidOperation) {
      setValidOperation(false);
    }

    getInfo();

  }, [enrollment]);

  async function getInfo() {
    setLoading(true);
    try {
      const booking = await getBooking(token);
      const foundHotels = await getHotelsWithAllRooms(token);
      setHotels(foundHotels);
      if (booking) {
        setUserHasBooked(true);
        const hotelBooked = foundHotels.find((hotel) => hotel.id === booking.Room.hotelId);
        setSelectedHotel(hotelBooked);
        const roomBooked = hotelBooked.Rooms.find((room) => room.id === booking.Room.id);
        setSelectedRoom(roomBooked);
        setReservedRoom(true);
        setValidOperation(true);
      } else {
        setUserHasBooked(false);
      }
    } finally {
      setLoading(false);
    }
  }

  async function reserveRoom() {
    if (creatingBooking) return;
    setCreatingBooking(true);
    setReservedRoom(true);
    const booking = await getBooking(token);
    if (booking) {
      await changeBooking(token, { roomId: selectedRoom.id });
      const hg = await getHotelsWithAllRooms(token);
      const rb = hg.find((hotel) => hotel.id === selectedHotel.id).Rooms.find((room) => room.id === selectedRoom.id);
      setSelectedRoom(rb);
      setHotels(hg);
    } else {
      await postBooking(token, { roomId: selectedRoom.id });
      const ht = await getHotelsWithAllRooms(token);
      const rc = ht.find((hotel) => hotel.id === selectedHotel.id).Rooms.find((room) => room.id === selectedRoom.id);
      setSelectedRoom(rc);
      setHotels(ht);
    }
    setCreatingBooking(false);
    setInChangeMode(false);
  }

  async function enterChangeRoomMode(id) {
    if (creatingBooking) return;
    setGettingNewHotels(true);
    const newHotelList = await getHotelsWithAllRooms(token);
    const newSelectedHotel = newHotelList.find((hotel) => hotel.id === id);
    setSelectedHotel(newSelectedHotel);
    setHotels(newHotelList);
    setReservedRoom(null);
    setSelectedRoom(null);
    setInChangeMode(true);
    setGettingNewHotels(false);
  }

  function getAvailableVacancy(rooms) {
    if (!rooms) return 0;
    let availableVacancy = 0;

    rooms.forEach((room) => {
      availableVacancy += (room.capacity - room.Booking.length);
    });
    return availableVacancy;
  }

  function getAvailableVacancyOfRoom(room) {
    if (!room) return 0;
    return room.capacity - room.Booking.length;
  }

  function getVacancyIcons(room, selected = false) {
    let occupiedIcons = [];
    let emptyIcons = [];
    for (let index = 0; index < room.Booking.length; index++) {
      occupiedIcons.push(<BsPersonFill key={`${uuid()}-fill`} />);
    }
    let vacancies = getAvailableVacancyOfRoom(room);
    for (let index = 0; index < vacancies; index++) {
      emptyIcons.push(<BsPerson key={`${uuid()}-empty`} />);
    }
    const data = JSON.parse(localStorage.getItem('userData'));
    const imAmAtRoom = data && room.Booking.find((booking) => booking.userId === data.user?.id);
    if (occupiedIcons.length > 0 && imAmAtRoom) {
      occupiedIcons[0] = <BsPersonFill style={{ color: '#FF4791' }} key={`${uuid()}-fill`} />;
    }
    if (emptyIcons.length > 0 && selected) {
      emptyIcons[0] = <BsPersonFill style={{ color: '#ffd380' }} key={`${uuid()}-fill`} />;
    }
    const icons = [...occupiedIcons, ...emptyIcons]
    return icons.map((icon) => (icon));
  }

  function validateUserOperation() {

    let isValidOperation = true;
    let message = null;

    if (!enrollment) {
      message = `Você precisa completar sua inscrição antes de prosseguir pra escolha de hoteis`;
    }

    else if (!ticket) {
      message = `Você precisa efetuar o pagamento do seu ingresso antes de prosseguir pra escolha de hoteis`;
    }

    else if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
      message = `O tipo do seu ingresso não permite a escolha de hoteis`;
    }

    if (message !== null) {
      isValidOperation = false;
    } else {
      setValidOperation(true);
    }

    return { isValidOperation, message };
  }

  if (!validOperation) {

    const { message } = validateUserOperation();
    return (
      <>
        <Typo variant="h4">Escolha de hotel e quarto</Typo>
        <VoidContainer>
          <Typo variant="h6" color="#8E8E8E">{message}</Typo>
        </VoidContainer>
      </>
    )
  }

  if (selectedHotel && selectedRoom && reservedRoom) {
    return (
      <>
        <Typo variant="h4">Escolha de hotel e quarto</Typo>
        <Typo variant="h6" color="#8E8E8E">
          Você já escolheu seu quarto
        </Typo>
        <HotelCard
          selected={true}
          name={selectedHotel.name}
          image={selectedHotel.image}
          room={selectedRoom.name}
          availableVacancy={getAvailableVacancy(selectedHotel.Rooms)}
        />
        <Button disabled={creatingBooking || gettingNewHotels} onClick={() => enterChangeRoomMode(selectedHotel.id)}>
          {creatingBooking || gettingNewHotels ? 'Aguarde..' : 'Trocar de quarto'}
        </Button>
      </>
    );
  }

  return (
    <>
      {
        (!userHasBooked || inChangeMode) &&
        <>
          <Typo variant="h4">Escolha de hotel e quarto</Typo>
          <Typo variant="h6" color="#8E8E8E">
            Primeiro, escolha seu hotel
          </Typo>
          <ContainerPai>
            <ContainerHotels>
              {hotels && hotels.map((hotel) => (
                <HotelCard
                  key={hotel.id}
                  onClick={() => setSelectedHotel(hotel)}
                  selected={selectedHotel?.id === hotel.id}
                  name={hotel.name}
                  image={hotel.image}
                  room={hotel.name}
                  availableVacancy={getAvailableVacancy(hotel.Rooms)}
                />
              ))}
            </ContainerHotels>
            {(loading && !inChangeMode) &&
              <DefaultLoader />
            }
            {selectedHotel && (
              <>
                <Typo variant="h6" color="#8E8E8E">
                  Ótima pedida! Agora escolha seu quarto:
                </Typo>
                <ContainerRooms>
                  {selectedHotel.Rooms.map((room) => (
                    <RoomCard
                      $disabled={(getAvailableVacancyOfRoom(room) === 0).toString()}
                      key={room.id}
                      $selected={selectedRoom?.id === room.id}
                      onClick={() => {
                        if (getAvailableVacancyOfRoom(room) !== 0) {
                          setSelectedRoom(room);
                        }
                      }}>
                      <p>{room.name}</p>
                      <div>
                        {
                          getVacancyIcons(room, selectedRoom?.id === room.id)
                        }
                      </div>
                    </RoomCard>
                  ))}
                </ContainerRooms>
              </>
            )}
            {selectedRoom && <Button onClick={() => reserveRoom()} >{userHasBooked ? 'TROCAR DE QUARTO' : 'RESERVAR QUARTO'}</Button>}
          </ContainerPai>
        </>
      }
    </>
  );
}

const VoidContainer = styled.div`
    text-align: center;
    height: 80%;

    display: flex;
    align-items: center;
    justify-content: center;
`;

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
  background: ${(props) => (props.$selected ? '#FFEED2' : '#ffffff')};
  opacity: ${(props) => (props.$disabled == 'true' ? '0.5' : '1')};
  cursor: ${(props) => (props.$disabled == 'true' ? 'not-allowed' : 'pointer')};
  &:hover{
    opacity: ${(props) => (props.$disabled == 'true' ? '0.5' : '0.8')};;
  }
  p {
    color: #454545;
    font-size: 20px;
    font-weight: 700;
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

 &:enabled{
  cursor: pointer;
  &:hover{
    opacity: 0.8;
  }
 }
 &:disabled{
  cursor: wait;
 }
`;
