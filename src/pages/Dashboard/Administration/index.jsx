import { Typography } from '@mui/material';
import React, { useEffect, Fragment } from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import Button from '../../../components/Form/Button';
import { Row } from '../../../components/Auth';
import Dashboard from '../../../layouts/Dashboard';
import { RiCalendarEventLine } from 'react-icons/ri';
import { BsFillTicketPerforatedFill, BsFillCalendar2DateFill } from 'react-icons/bs';
import { MdHotel } from 'react-icons/md';
import Input from '../../../components/Form/Input';
import axios from 'axios';
import useEvent from '../../../hooks/api/useEvent';
import useTicketTypes from '../../../hooks/api/useTicketTypes';
import useToken from '../../../hooks/useToken';
import { getHotelsWithAllRooms } from '../../../services/hotelApi';
import HotelCard from '../../../components/HotelCard';
import { v4 as uuid } from 'uuid';
import { formatPrice } from '../../../utils/formatPrice';
import { useNavigate } from 'react-router-dom';


const State = {
    event: "event",
    tickets: "tickets",
    hotels: "hotels",
    activities: "activities"
}

const TicketMock = {
    name: "Ticket Name",
    price: 100,
    isRemote: false,
    includesHotel: true
}

const DEFAULT_TICKET = { id: 0, name: '', price: 0, isRemote: false, includesHotel: false };

export default function AdministrationPage() {
    const [eventData, setEventData] = useState(null);
    const [tickets, setTickets] = useState([TicketMock]);
    const [hotels, setHotels] = useState(null);
    const [activities, setActivities] = useState(null);
    const [state, setState] = useState(State.event);
    const { event, eventError, eventLoading } = useEvent();
    const { ticketTypes, ticketTypesError, ticketTypesLoading, ticketTypesProcess } = useTicketTypes();
    const [currentTicket, setCurrentTicket] = useState(DEFAULT_TICKET);
    const [editingTicket, setEditingTicket] = useState(false);
    const [hotelsLoading, setHotelsLoading] = useState(false);
    const [editingHotel, setEditingHotel] = useState(false);
    const [currentHotelFormInfo, setCurrentHotelFormInfo] = useState(null);
    const token = useToken();
    const navigate = useNavigate();
    useEffect(() => {
        getHotelsInfo();
        if(!localStorage.getItem('admin')){
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
        setCurrentHotelFormInfo({ ...currentHotelFormInfo, Rooms: [...currentHotelFormInfo.Rooms, { id: uuid(), name: '', capacity: 0, Booking: [] }] });
    }
    function removeRoomInCurrentEditingHotel(roomId) {
        setCurrentHotelFormInfo({ ...currentHotelFormInfo, Rooms: currentHotelFormInfo.Rooms.filter((room) => room.id !== roomId) });
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
        axios.put(`http://localhost:4000/hotels/${currentHotelFormInfo.id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => {
            getHotelsInfo().then((res) => {

            }).catch((err) => {
                console.log(err);
            })
        }).catch((err) => {
            console.log(err);
        })
        cancelHotelEdition();
    }
    function updateObject(roomId, newValue, key) {
        const updatedData = currentHotelFormInfo.Rooms.map(room => {
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
            rooms: []
        });
    }
    function startEditingTicket(ticket) {
        setEditingTicket(true);
        setCurrentTicket({
            id: ticket.id,
            name: ticket.name,
            price: ticket.price,
            isRemote: ticket.isRemote,
            includesHotel: ticket.includesHotel
        });
    }
    function saveTicketEdition() {
        axios.put('http://localhost:4000/tickets/types', currentTicket, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => {
            console.log(res);
            ticketTypesProcess().then((res) => {
                setEditingTicket(false);
                setCurrentTicket(DEFAULT_TICKET);
            }).catch((err) => {
                console.log(err);
            })
        }).catch((err) => {
            console.log(err);
            setEditingTicket(false);
        })
    }
    function cancelTicketEdition() {
        setEditingTicket(false);
        setCurrentTicket(DEFAULT_TICKET);
    }
    function createNewTicket(e) {
        e.preventDefault();
        axios.post('http://localhost:4000/tickets/types', currentTicket, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => {
            setCurrentTicket(DEFAULT_TICKET);
            console.log(res);
        }).catch((err) => {
            console.log(err);
        })
    }
    function updateEvent() {
        axios.put('http://localhost:4000/event', eventData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        })
    }
    function getAvailableVacancy(rooms) {
        if (!rooms) return 0;
        let availableVacancy = 0;
        rooms.forEach((room) => {
            availableVacancy += (room.capacity - room?.Booking?.length);
        });
        return availableVacancy;
    }

    return (
        <main>
            <Row style={{ width: '100%' }}>
                <Typography variant='h2'>Administration</Typography>
                <nav>
                    <button onClick={() => setState(State.event)}>
                        <RiCalendarEventLine className='icon' />
                        Event
                    </button>
                    <button onClick={() => setState(State.tickets)}>
                        <BsFillTicketPerforatedFill className='icon' />
                        Tickets
                    </button>
                    <button onClick={() => setState(State.hotels)}>
                        <MdHotel className='icon' />
                        Hotels
                    </button>
                    <button onClick={() => setState(State.activities)}>
                        <BsFillCalendar2DateFill className='icon' />
                        Activities
                    </button>
                </nav>
                {
                    state === State.event &&
                    <div style={{ padding: '20px ', display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'space-between', alignItems: 'center' }}>

                        <div>
                            <form onSubmit={(e) => e.preventDefault()}>
                                <Typography variant='h3'>
                                    Event information
                                </Typography>
                                <div>
                                    <label htmlFor="event-title">Title</label>
                                    <Input onChange={(e) => setEventData({ ...eventData, title: e.target.value })} id='event-title' name='event-title' type="text" placeholder='Title' value={eventData?.title} />
                                </div>
                                <div>
                                    <label htmlFor="event-background">Background URL</label>
                                    <Input onChange={(e) => setEventData({ ...eventData, backgroundImageUrl: e.target.value })} id='event-background' name='event-background' type="text" placeholder='Background URL' value={eventData?.backgroundImageUrl} />
                                </div>
                                <div>
                                    <label htmlFor="event-logo">Logo URL</label>
                                    <Input onChange={(e) => setEventData({ ...eventData, logoImageUrl: e.target.value })} id='event-logo' name='event-logo' type="text" placeholder='Logo URL' value={eventData?.logoImageUrl} />
                                </div>
                                <div>
                                    <label htmlFor="event-start-date">Start Date</label>
                                    <Input onChange={(e) => setEventData({ ...eventData, startsAt: e.target.value })} id='event-start-date' name='event-start-date' type="date" value={eventData?.startsAt} />
                                </div>
                                <div>
                                    <label htmlFor="event-end-date">End Date</label>
                                    <Input onChange={(e) => setEventData({ ...eventData, endsAt: e.target.value })} id='event-end-date' name='event-end-date' type="date" value={eventData?.endsAt} />
                                </div>

                            </form>
                            <div>
                                <div className='images'>
                                    <img style={{ maxWidth: 300, maxHeight: 300 }} src={eventData?.backgroundImageUrl} alt="background" />
                                    <div className='banner'>
                                        <div className='main'>
                                            <img style={{ maxWidth: 60, maxHeight: 60 }} className='logo' src={eventData?.logoImageUrl} alt="background" />
                                            <h1>{eventData?.title}</h1>
                                        </div>
                                        <div className='dates'>
                                            <span>Start Date: {eventData?.startsAt}</span>
                                            <span>End Date: {eventData?.endsAt}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Button onClick={() => updateEvent()} style={{ width: '100%' }}>Save</Button>
                    </div>
                }
                {
                    state === State.tickets &&
                    <div style={{ padding: '20px ', display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant='h2'>
                            Tickets
                        </Typography>

                        <div>
                            <Typography variant='h3'>
                                {editingTicket ? `Editando ticket ${currentTicket.name}` : ' Lista de tickets'}
                            </Typography>
                            <ul style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                                {
                                    !editingTicket && ticketTypes && !ticketTypesLoading && !ticketTypesError && ticketTypes.map((ticket, index) => {
                                        return (
                                            <li style={{border:'1px solid blue', padding:'10px'}} key={index}>
                                                <Typography variant='h4'>
                                                    {ticket.name}
                                                </Typography>
                                                <Typography variant='h5'>
                                                    R${formatPrice(ticket.price)}
                                                </Typography>
                                                <Typography variant='h5'>
                                                    {ticket.isRemote ? 'Remote' : 'Presential'}
                                                </Typography>
                                                <Typography variant='h5'>
                                                    {ticket.includesHotel ? 'Includes Hotel' : 'Doesn\'t include Hotel'}
                                                </Typography>
                                                <Button onClick={() => startEditingTicket(ticket)}>Edit</Button>
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                        </div>
                        {
                            ticketTypesLoading && <Typography variant='h4'>Loading...</Typography>
                        }
                        <form onSubmit={createNewTicket}>
                            <>
                                <label htmlFor="ticket-name">Name</label>
                                <Input onChange={(e) => setCurrentTicket({ ...currentTicket, name: e.target.value })} id='ticket-name' name='ticket-name' type="text" placeholder='TicketName' value={currentTicket.name} />
                                <label htmlFor="ticket-price">Price</label>
                                <Input onChange={(e) => setCurrentTicket({ ...currentTicket, price: e.target.value })} id='ticket-price' name='ticket-price' type="number" placeholder='TicketPrice' value={currentTicket.price} />
                                <label htmlFor="ticket-is-remote">Is Remote</label>
                                <Input onChange={(e) => setCurrentTicket({ ...currentTicket, isRemote: e.target.checked })} id='ticket-is-remote' name='ticket-is-remote' type="checkbox" checked={currentTicket.isRemote} />
                                <label htmlFor="ticket-includes-hotel">Includes Hotel</label>
                                <Input onChange={(e) => setCurrentTicket({ ...currentTicket, includesHotel: e.target.checked })} id='ticket-includes-hotel' name='ticket-includes-hotel' type="checkbox" checked={currentTicket.includesHotel} />
                                <div style={{ gap: '20px', display: 'flex' }}>
                                    {!editingTicket && <Button type="submit">Create New</Button>}
                                    {editingTicket && <Button onClick={saveTicketEdition}>Save</Button>}
                                    {editingTicket && <Button onClick={cancelTicketEdition}>Cancel</Button>}
                                </div>
                            </>
                        </form>
                    </div>
                }
                {
                    state === State.hotels &&
                    <div style={{ padding: '20px ', display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant='h2'>
                            Hotels
                        </Typography>
                        <div>
                            <Typography variant='h3'>
                                {editingHotel ? `Editando hotel ${currentHotelFormInfo.name}` : ' Lista de hoteis'}
                            </Typography>
                            {
                                !editingHotel ?
                                    <div>
                                        <ul style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '20px' }}>
                                            {
                                                hotelsLoading && <Typography variant='h4'>Loading...</Typography>
                                            }
                                            {
                                                hotels && hotels.map((hotel, index) => {
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
                                                })
                                            }
                                        </ul>
                                    </div>
                                    :
                                    <form>
                                        <div>
                                            <label htmlFor="event-title">Name</label>
                                            <Input onChange={(e) => setCurrentHotelFormInfo({ ...currentHotelFormInfo, name: e.target.value })} id='event-title' name='event-title' type="text" placeholder='Title' value={currentHotelFormInfo?.name} />
                                        </div>
                                        <div>
                                            <label htmlFor="event-background">Imagem URL</label>
                                            <Input onChange={(e) => setCurrentHotelFormInfo({ ...currentHotelFormInfo, image: e.target.value })} id='event-background' name='event-background' type="text" placeholder='Background URL' value={currentHotelFormInfo?.image} />
                                        </div>
                                        <div>
                                            {
                                                currentHotelFormInfo && currentHotelFormInfo.Rooms && currentHotelFormInfo.Rooms.map((room, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <label htmlFor="event-title">Room Name</label>
                                                            <Input value={room.name} onChange={(e) => {
                                                                updateObject(room.id, e.target.value, 'name');
                                                            }} id='event-title' name='event-title' type="text" placeholder='Title' />
                                                            <label htmlFor="event-title">Room Capacity</label>
                                                            <Input onChange={(e) => {
                                                                updateObject(room.id, Number(e.target.value), 'capacity');

                                                            }} value={room.capacity} id='event-title' name='event-title' type="text" placeholder='Title' />
                                                        </div>
                                                    );
                                                })
                                            }
                                        </div>
                                        <div style={{ display: 'flex', gap: '20px', marginTop: 20 }}>
                                            <Button onClick={increaseRoomInCurrentEditingHotel}>Add Room</Button>
                                            <Button onClick={() => removeRoomInCurrentEditingHotel(currentHotelFormInfo.Rooms[currentHotelFormInfo.Rooms.length - 1].id)}>Remove Room</Button>

                                        </div>
                                        <div style={{ display: 'flex', gap: '20px', marginTop: 20 }}>
                                            <Button onClick={saveHotelEdition}>Save</Button>
                                            <Button onClick={cancelHotelEdition}>Cancel</Button>
                                        </div>
                                    </form>
                            }
                        </div>

                    </div>
                }
                {
                    state === State.activities &&
                    <div style={{ padding: '20px ', display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p variant='h2'>
                            
                        </p>
                    </div>
                }
            </Row>
        </main >
    );
}
/*
    (Evento) editar as informações do evento.//
    (Ingressos) editar as informações sobre os tipos de ingressos do evento.//
    (Hotéis) editar as informações sobre os hotéis e seus respectivos quartos.
    (Atividades) editar as informações sobre as atividades do evento.
*/ 