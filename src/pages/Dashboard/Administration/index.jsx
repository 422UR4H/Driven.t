import { Typography } from '@mui/material';
import React, { useEffect } from 'react';
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

const HotelsMock = [
    {
        name: "Hotel Name",
        image: "https://images.unsplash.com/photo-1525253086316-1a2e0cddc4e8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y29sb3JmdWwlMjBwcm9qZWN0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
        Rooms: [
            {
                name: "Room Name",
                capacity: 10
            }
        ],
        Bookings: [
            {
                userId: 1,
                roomId: 1,
            },
            {
                userId: 2,
                roomId: 1,
            },
            {
                userId: 3,
                roomId: 1,
            },
            {
                userId: 4,
                roomId: 1,
            },
            {
                userId: 5,
                roomId: 1,
            },
            {
                userId: 6,
                roomId: 1,
            },
            {
                userId: 7,
                roomId: 1,
            },
            {
                userId: 8,
                roomId: 1,
            },
            {
                userId: 9,
                roomId: 1,
            },
            {
                userId: 10,
                roomId: 1,
            },
        ]
    },

    {
        name: "Hotel Name",
        image: "https://images.unsplash.com/photo-1525253086316-1a2e0cddc4e8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y29sb3JmdWwlMjBwcm9qZWN0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
        Rooms: [
            {
                name: "Room Name",
                capacity: 10
            }
        ],
        Bookings: [
            {
                userId: 1,
                roomId: 1,
            },
            {
                userId: 2,
                roomId: 1,
            },
            {
                userId: 3,
                roomId: 1,
            },
            {
                userId: 4,
                roomId: 1,
            },
            {
                userId: 5,
                roomId: 1,
            },
            {
                userId: 6,
                roomId: 1,
            },
            {
                userId: 7,
                roomId: 1,
            },
            {
                userId: 8,
                roomId: 1,
            },
            {
                userId: 9,
                roomId: 1,
            },
            {
                userId: 10,
                roomId: 1,
            },
        ]
    },

]

export default function AdministrationPage() {
    const [eventData, setEventData] = useState(null);
    const [tickets, setTickets] = useState([TicketMock]);
    const [hotels, setHotels] = useState(HotelsMock);
    const [activities, setActivities] = useState(null);
    const [state, setState] = useState(State.event);
    const { event, eventError, eventLoading} = useEvent();

    function getAllInformation() {
       
    }

    useEffect(() => {
        getAllInformation();
    }, []);

    useEffect(()=>{
        if(event){
            console.log(event);
            setEventData({...event, startsAt: event.startsAt.split('T')[0], endsAt: event.endsAt.split('T')[0]});
        }
    },[event])

    function updateEvent() {
        axios.put('http://localhost:4000/event', eventData).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        })
    }

    return (
        <main>
            <Row style={{ width: '100%' }}>
                <Typography variant='h1'>Administration</Typography>
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
                            <form onSubmit={(e)=> e.preventDefault()}>
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
                        <Button onClick={()=> updateEvent()} style={{ width: '100%' }}>Save</Button>
                    </div>
                }
                {
                    state === State.tickets &&
                    <Dashboard style={{ padding: '20px ', display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant='h2'>
                            Tickets
                        </Typography>
                        <form>
                            {
                                tickets && tickets.map((ticket, index) => {
                                    return (
                                        <>
                                            <label htmlFor="ticket-name">Name</label>
                                            <Input id='ticket-name' name='ticket-name' type="text" placeholder='TicketName' value={tickets[0].name} />
                                            <label htmlFor="ticket-price">Price</label>
                                            <Input id='ticket-price' name='ticket-price' type="number" placeholder='TicketPrice' value={tickets[0].price} />
                                            <label htmlFor="ticket-is-remote">Is Remote</label>
                                            <Input id='ticket-is-remote' name='ticket-is-remote' type="checkbox" checked={tickets[0].isRemote} />
                                            <label htmlFor="ticket-includes-hotel">Includes Hotel</label>
                                            <Input id='ticket-includes-hotel' name='ticket-includes-hotel' type="checkbox" checked={tickets[0].includesHotel} />
                                            <Button>Save</Button>
                                        </>
                                    );
                                })
                            }
                        </form>
                    </Dashboard>
                }
                {
                    state === State.hotels &&
                    <Dashboard style={{ padding: '20px ', display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p variant='h2'>
                            Hotels
                        </p>
                    </Dashboard>
                }
                {
                    state === State.activities &&
                    <Dashboard style={{ padding: '20px ', display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p variant='h2'>
                            Activities
                        </p>
                    </Dashboard>
                }
            </Row>
        </main >
    );
}
/*
    (Evento) editar as informações do evento.
    (Ingressos) editar as informações sobre os tipos de ingressos do evento.
    (Hotéis) editar as informações sobre os hotéis e seus respectivos quartos.
    (Atividades) editar as informações sobre as atividades do evento.
*/