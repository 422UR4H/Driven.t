import { Typography } from '@mui/material';
import React, { useEffect, Fragment } from 'react';
import { useState } from 'react';
import Button from '../../../components/Form/Button';
import { Row } from '../../../components/Auth';
import { RiCalendarEventLine } from 'react-icons/ri';
import { BsFillTicketPerforatedFill, BsFillCalendar2DateFill } from 'react-icons/bs';
import { MdHotel } from 'react-icons/md';
import Input from '../../../components/Form/Input';
import axios from 'axios';
import useEvent from '../../../hooks/api/useEvent';
import useToken from '../../../hooks/useToken';
import { getHotelsWithAllRooms } from '../../../services/hotelApi';
import HotelCard from '../../../components/HotelCard';
import { v4 as uuid } from 'uuid';
import { formatPrice } from '../../../utils/formatPrice';
import { useNavigate } from 'react-router-dom';
import useTicketTypesAdmin from '../../../hooks/api/useTicketTypesAdmin';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { display } from '@mui/system';
import { left } from '@popperjs/core';

const State = {
  event: 'event',
  tickets: 'tickets',
  hotels: 'hotels',
  activities: 'activities',
};

const TicketMock = {
  name: 'Ticket Name',
  price: 100,
  isRemote: false,
  includesHotel: true,
};

const DEFAULT_TICKET = { id: 1, name: '', price: 0, isRemote: false, includesHotel: false };

export default function AdministrationPage() {
  const [eventData, setEventData] = useState(null);
  const [tickets, setTickets] = useState([TicketMock]);
  const [hotels, setHotels] = useState(null);
  const [activities, setActivities] = useState(null);
  const [state, setState] = useState(State.event);
  const { event, eventError, eventLoading } = useEvent();
  const { ticketTypes, ticketTypesError, ticketTypesLoading, ticketTypesProcess } = useTicketTypesAdmin();
  const [currentTicket, setCurrentTicket] = useState(DEFAULT_TICKET);
  const [editingTicket, setEditingTicket] = useState(false);
  const [hotelsLoading, setHotelsLoading] = useState(false);
  const [editingHotel, setEditingHotel] = useState(false);
  const [currentHotelFormInfo, setCurrentHotelFormInfo] = useState(null);
  const [loadingEventEdition, setLoadingEventEdition] = useState(false);
  const token = useToken();
  const navigate = useNavigate();
  useEffect(() => {
    getHotelsInfo();
    if (!localStorage.getItem('admin')) {
      return navigate('/sign-in');
    }
  }, []);
  useEffect(() => {
    if (event) {
      setEventData({ ...event, startsAt: event.startsAt.split('T')[0], endsAt: event.endsAt.split('T')[0] });
    }
  }, [event]);

  async function getHotelsInfo() {
    setHotelsLoading(true);
    try {
      const foundHotels = await getHotelsWithAllRooms(token);
      setHotels(foundHotels);
      setHotelsLoading(false);
    } catch (err) {
      console.log(err);
      setHotelsLoading(false);
    }
  }
  function startEditingHotel(hotel) {
    setEditingHotel(true);
    setCurrentHotelFormInfo(hotel);
  }
  function increaseRoomInCurrentEditingHotel() {
    setCurrentHotelFormInfo({
      ...currentHotelFormInfo,
      Rooms: [...currentHotelFormInfo.Rooms, { id: uuid(), name: '', capacity: 0, Booking: [] }],
    });
  }
  function removeRoomInCurrentEditingHotel(roomId) {
    setCurrentHotelFormInfo({
      ...currentHotelFormInfo,
      Rooms: currentHotelFormInfo.Rooms.filter((room) => room.id !== roomId),
    });
  }
  function saveHotelEdition() {
    const data = currentHotelFormInfo;
    data.Rooms = data.Rooms.map((room) => {
      delete room.Booking;
      return room;
    });
    data.rooms = data.Rooms;
    delete data.Rooms;
    //console.log(currentHotelFormInfo);
    axios
      .put(`http://localhost:4000/hotels/${currentHotelFormInfo.id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        getHotelsInfo()
          .then((res) => {
            toast('Sucesso ao editar hotel!');
          })
          .catch((err) => {
            console.log(err);
            toast('Não foi possível fazer a edição!');
          });
      })
      .catch((err) => {
        console.log(err);
      });
    cancelHotelEdition();
  }
  function updateObject(roomId, newValue, key) {
    const updatedData = currentHotelFormInfo.Rooms.map((room) => {
      if (room.id === roomId) {
        // Create a new object with the updated value
        return { ...room, [key]: newValue };
      }
      return room;
    });

    setCurrentHotelFormInfo({ ...currentHotelFormInfo, Rooms: updatedData });
  }
  function cancelHotelEdition() {
    setEditingHotel(false);
    setCurrentHotelFormInfo({
      id: 0,
      name: '',
      image: '',
      rooms: [],
    });
  }
  function startEditingTicket(ticket) {
    setEditingTicket(true);
    setCurrentTicket({
      id: ticket.id,
      name: ticket.name,
      price: ticket.price,
      isRemote: ticket.isRemote,
      includesHotel: ticket.includesHotel,
    });
  }
  function saveTicketEdition() {
    axios
      .put('http://localhost:4000/tickets/types', currentTicket, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        toast('Sucesso ao editar ticket!');
        ticketTypesProcess()
          .then((res) => {
            setEditingTicket(false);
            setCurrentTicket(DEFAULT_TICKET);
          })
          .catch((err) => {
            console.log(err);
            toast('Falha ao editar ticket!');
          });
      })
      .catch((err) => {
        console.log(err);
        setEditingTicket(false);
      });
  }
  function cancelTicketEdition() {
    setEditingTicket(false);
    setCurrentTicket(DEFAULT_TICKET);
  }
  function createNewTicket(e) {
    e.preventDefault();
    axios
      .post('http://localhost:4000/tickets/types', currentTicket, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        toast('Sucesso ao criar ticket!');
        setCurrentTicket(DEFAULT_TICKET);
      })
      .catch((err) => {
        console.log(err);
        toast('Falha ao criar ticket!');
      });
  }
  function updateEvent() {
    setLoadingEventEdition(true);
    axios
      .put('http://localhost:4000/event', eventData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        toast('Sucesso ao criar/editar evento!');
      })
      .catch((err) => {
        console.log(err);
        toast('Falha ao criar/editar evento!');
      })
      .finally(() => {
        setLoadingEventEdition(false);
      });
  }
  function getAvailableVacancy(rooms) {
    if (!rooms) return 0;
    let availableVacancy = 0;
    rooms.forEach((room) => {
      availableVacancy += room.capacity - room?.Booking?.length;
    });
    return availableVacancy;
  }

  return (
    <ContainerMain>
      <AdmButtons>
        <AdmButton onClick={() => setState(State.event)}>
          <RiCalendarEventLine color="#124090" size="40px" />
          Event
        </AdmButton>
        <AdmButton onClick={() => setState(State.tickets)}>
          <BsFillTicketPerforatedFill color="#124090" size="40px" />
          Tickets
        </AdmButton>
        <AdmButton onClick={() => setState(State.hotels)}>
          <MdHotel color="#124090" size="40px" />
          Hotels
        </AdmButton>
        <AdmButton onClick={() => setState(State.activities)}>
          <BsFillCalendar2DateFill color="#124090" size="40px" />
          Activities
        </AdmButton>
      </AdmButtons>
      {state === State.event && (
        <div style={{ backgroundSize: '80%' }}>
          <Typography variant="h2" style={{ color: '#fff', display: 'flex', justifyContent: 'center' }}>
            Administration
          </Typography>
          <AdmContainer>
            <div>
              <Typography variant="h3">Event information</Typography>
              <AdmForm onSubmit={(e) => e.preventDefault()}>
                <div>
                  <AdmInputs>
                    <label htmlFor="event-title">Title</label>
                    <Input
                      disabled={loadingEventEdition}
                      onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                      id="event-title"
                      name="event-title"
                      type="text"
                      placeholder="Title"
                      value={eventData?.title}
                    />
                  </AdmInputs>
                  <AdmInputs>
                    <label htmlFor="event-background">Background URL</label>
                    <Input
                      disabled={loadingEventEdition}
                      onChange={(e) => setEventData({ ...eventData, backgroundImageUrl: e.target.value })}
                      id="event-background"
                      name="event-background"
                      type="text"
                      placeholder="Background URL"
                      value={eventData?.backgroundImageUrl}
                    />
                  </AdmInputs>
                  <AdmInputs>
                    <label htmlFor="event-logo">Logo URL</label>
                    <Input
                      disabled={loadingEventEdition}
                      onChange={(e) => setEventData({ ...eventData, logoImageUrl: e.target.value })}
                      id="event-logo"
                      name="event-logo"
                      type="text"
                      placeholder="Logo URL"
                      value={eventData?.logoImageUrl}
                    />
                  </AdmInputs>
                </div>
                <div>
                  <AdmInputs>
                    <label htmlFor="event-start-date">Start Date</label>
                    <Input
                      disabled={loadingEventEdition}
                      onChange={(e) => setEventData({ ...eventData, startsAt: e.target.value })}
                      id="event-start-date"
                      name="event-start-date"
                      type="date"
                      value={eventData?.startsAt}
                    />
                  </AdmInputs>
                  <AdmInputs>
                    <label htmlFor="event-end-date">End Date</label>
                    <Input
                      disabled={loadingEventEdition}
                      onChange={(e) => setEventData({ ...eventData, endsAt: e.target.value })}
                      id="event-end-date"
                      name="event-end-date"
                      type="date"
                      value={eventData?.endsAt}
                    />
                  </AdmInputs>
                </div>
              </AdmForm>
              <Button disabled={loadingEventEdition} onClick={() => updateEvent()} style={{ width: '200px' }}>
                {loadingEventEdition ? 'Carregando...' : 'Salvar'}
              </Button>
            </div>
            <EventCard>
              <img src={eventData?.backgroundImageUrl} alt="background-image" />
              <CardImg>
                <img
                  style={{ maxWidth: 168, maxHeight: 109 }}
                  className="logo"
                  src={eventData?.logoImageUrl}
                  alt="background"
                />
                <h2>{eventData?.title}</h2>
              </CardImg>
              <CardDates>
                <h4>Start Date: </h4>
                <span>{eventData?.startsAt}</span>
                <h4>End Date: </h4>
                <span>{eventData?.endsAt}</span>
              </CardDates>
            </EventCard>
          </AdmContainer>
        </div>
      )}
      {state === State.tickets && (
        <div style={{ backgroundSize: '80%' }}>
          <Typography variant="h2" style={{ color: '#fff', display: 'flex', justifyContent: 'center' }}>
            Administration
          </Typography>
          <AdmContainer style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h3">Tickets</Typography>
            <div>
              <Typography variant="h4">
                {editingTicket ? `Editando ticket ${currentTicket.name}` : ' Lista de tickets'}
              </Typography>
              <ul style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                {!editingTicket &&
                  ticketTypes &&
                  !ticketTypesLoading &&
                  !ticketTypesError &&
                  ticketTypes.map((ticket, index) => {
                    return (
                      <TicketCard>
                        <h2>{ticket.name}</h2>
                        <h4>R${formatPrice(ticket.price)}</h4>
                        <h4>{ticket.isRemote ? 'Remote' : 'Presential'}</h4>
                        <h4>{ticket.includesHotel ? 'Includes Hotel' : "Doesn't include Hotel"}</h4>
                        <Button onClick={() => startEditingTicket(ticket)}>Edit</Button>
                      </TicketCard>
                    );
                  })}
              </ul>
            </div>
            {ticketTypesLoading && <Typography variant="h4">Loading...</Typography>}
            <AdmForm onSubmit={createNewTicket} style={{ margin: '0' }}>
              <>
                <AdmInputs>
                  <label htmlFor="ticket-name">Name</label>
                  <Input
                    onChange={(e) => setCurrentTicket({ ...currentTicket, name: e.target.value })}
                    id="ticket-name"
                    name="ticket-name"
                    type="text"
                    placeholder="TicketName"
                    value={currentTicket.name}
                  />
                </AdmInputs>
                <AdmInputs>
                  <label htmlFor="ticket-price">Price</label>
                  <Input
                    onChange={(e) => setCurrentTicket({ ...currentTicket, price: e.target.value })}
                    id="ticket-price"
                    name="ticket-price"
                    type="number"
                    placeholder="TicketPrice"
                    value={currentTicket.price}
                  />
                </AdmInputs>
                <AdmInputs>
                  <label htmlFor="ticket-is-remote">Is Remote</label>
                  <Input
                    onChange={(e) => setCurrentTicket({ ...currentTicket, isRemote: e.target.checked })}
                    id="ticket-is-remote"
                    name="ticket-is-remote"
                    type="checkbox"
                    checked={currentTicket.isRemote}
                  />
                </AdmInputs>
                <AdmInputs>
                  <label htmlFor="ticket-includes-hotel">Includes Hotel</label>
                  <Input
                    onChange={(e) => setCurrentTicket({ ...currentTicket, includesHotel: e.target.checked })}
                    id="ticket-includes-hotel"
                    name="ticket-includes-hotel"
                    type="checkbox"
                    checked={currentTicket.includesHotel}
                  />
                </AdmInputs>
              </>
            </AdmForm>
            <div>
              {!editingTicket && <Button type="submit">Create New</Button>}
              {editingTicket && (
                <Button onClick={saveTicketEdition} style={{ margin: '10px' }}>
                  Save
                </Button>
              )}
              {editingTicket && (
                <Button onClick={cancelTicketEdition} style={{ margin: '10px' }}>
                  Cancel
                </Button>
              )}
            </div>
          </AdmContainer>
        </div>
      )}
      {state === State.hotels && (
        <div style={{ backgroundSize: '80%' }}>
          <Typography variant="h2" style={{ color: '#fff', display: 'flex', justifyContent: 'center' }}>
            Administration
          </Typography>
          <AdmContainer style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h2">Hotels</Typography>
            <div>
              <Typography variant="h3">
                {editingHotel ? `Editando hotel ${currentHotelFormInfo.name}` : ' Lista de hoteis'}
              </Typography>
              {!editingHotel ? (
                <div>
                  <ul style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '20px' }}>
                    {hotelsLoading && <Typography variant="h4">Loading...</Typography>}
                    {hotels &&
                      hotels.map((hotel, index) => {
                        return (
                          <div key={index}>
                            <HotelCard
                              selected={false}
                              name={hotel.name}
                              image={hotel.image}
                              room={hotel.name}
                              availableVacancy={getAvailableVacancy(hotel.Rooms)}
                            />
                            <Button onClick={() => startEditingHotel(hotel)}>Edit</Button>
                          </div>
                        );
                      })}
                  </ul>
                </div>
              ) : (
                <AdmForm style={{ margin: '20px', flexDirection: 'column' }}>
                  <div style={{ display: 'flex' }}>
                    <AdmInputs>
                      <label htmlFor="event-title">Name</label>
                      <Input
                        onChange={(e) => setCurrentHotelFormInfo({ ...currentHotelFormInfo, name: e.target.value })}
                        id="event-title"
                        name="event-title"
                        type="text"
                        placeholder="Title"
                        value={currentHotelFormInfo?.name}
                      />
                    </AdmInputs>
                    <AdmInputs>
                      <label htmlFor="event-background">Imagem URL</label>
                      <Input
                        onChange={(e) => setCurrentHotelFormInfo({ ...currentHotelFormInfo, image: e.target.value })}
                        id="event-background"
                        name="event-background"
                        type="text"
                        placeholder="Background URL"
                        value={currentHotelFormInfo?.image}
                      />
                    </AdmInputs>
                  </div>
                  <div>
                    {currentHotelFormInfo &&
                      currentHotelFormInfo.Rooms &&
                      currentHotelFormInfo.Rooms.map((room, index) => {
                        return (
                          <div style={{ display: 'flex' }}>
                            <AdmInputs key={index}>
                              <label htmlFor="event-title">Room Name</label>
                              <Input
                                value={room.name}
                                onChange={(e) => {
                                  updateObject(room.id, e.target.value, 'name');
                                }}
                                id="event-title"
                                name="event-title"
                                type="text"
                                placeholder="Title"
                              />
                            </AdmInputs>
                            <AdmInputs>
                              <label htmlFor="event-title">Room Capacity</label>
                              <Input
                                onChange={(e) => {
                                  updateObject(room.id, Number(e.target.value), 'capacity');
                                }}
                                value={room.capacity}
                                id="event-title"
                                name="event-title"
                                type="text"
                                placeholder="Title"
                              />
                            </AdmInputs>
                            <AdmInputs style={{ height: '55px', marginTop: 40 }}>
                              <Button
                                onClick={() =>
                                  removeRoomInCurrentEditingHotel(
                                    currentHotelFormInfo.Rooms[currentHotelFormInfo.Rooms.length - 1].id
                                  )
                                }
                                style={{ height: '50px' }}
                              >
                                Remove Room
                              </Button>
                            </AdmInputs>
                          </div>
                        );
                      })}
                  </div>
                  <div>
                    <div style={{ display: 'flex', gap: '20px', marginTop: 20 }}>
                      <Button onClick={saveHotelEdition}>Save</Button>
                      <Button onClick={cancelHotelEdition}>Cancel</Button>
                      <Button onClick={increaseRoomInCurrentEditingHotel}>Add Room</Button>
                    </div>
                  </div>
                </AdmForm>
              )}
            </div>
          </AdmContainer>
        </div>
      )}
      {state === State.activities && (
        <div style={{ backgroundSize: '80%' }}>
          <Typography variant="h2" style={{ color: '#fff', display: 'flex', justifyContent: 'center' }}>
            Administration
          </Typography>
          <AdmContainer>
            <Typography variant="h2">Atividades</Typography>
          </AdmContainer>
        </div>
      )}
    </ContainerMain>
  );
}
/*
    (Evento) editar as informações do evento.//
    (Ingressos) editar as informações sobre os tipos de ingressos do evento.//
    (Hotéis) editar as informações sobre os hotéis e seus respectivos quartos.
    (Atividades) editar as informações sobre as atividades do evento.
*/

const ContainerMain = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(90deg, #ff4791 0.17%, #ffd77f 99.83%);
  height: 100vh;
  width: 100%;
`;

const AdmContainer = styled.div`
  display: flex;
  padding: 30px;
  gap: 30px;
  background-color: #d9d9d9;
  height: 628px;
  width: 800px;
`;

const AdmButtons = styled.nav`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 130px;
  position: fixed;
  left: 0;
  top: 0;
`;

const AdmButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border: none;
  background: #ccc;
`;

const AdmInputs = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin: 10px;
`;

const AdmForm = styled.form`
  display: flex;
  margin-top: 80px;
  gap: 10px;
`;

const EventCard = styled.div`
  width: 196px;
  height: 264px;
  margin-top: 20%;
  border-radius: 10px;
  padding: 10px;
  background-color: #fff;
`;

const CardImg = styled.div`
  margin: 5px;
  img {
    margin-bottom: 5px;
  }
  h2 {
    color: #343434;
    font-size: 20px;
    font-weight: 400;
  }
`;

const CardDates = styled.div`
  margin: 5px;
  h4 {
    color: #3c3c3c;
    font-size: 12px;
    font-weight: 700;
    margin: 5px 0 5px 0;
  }
  span {
    color: #3c3c3c;
    font-size: 12px;
    font-weight: 700;
  }
`;

const TicketCard = styled.div`
  width: 196px;
  height: 200px;
  margin-top: 5%;
  border-radius: 10px;
  padding: 10px;
  background-color: #fff;
  h2 {
    color: #343434;
    font-size: 20px;
    font-weight: 400;
    margin: 10px;
  }
  h4 {
    color: #3c3c3c;
    font-size: 12px;
    font-weight: 400;
    margin: 10px;
  }
  button {
    margin: 10px;
  }
`;
