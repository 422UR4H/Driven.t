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


const State = {
    event: "event",
    tickets: "tickets",
    hotels: "hotels",
    activities: "activities"
}

const EventMock = {
    title: "Festa de maluco",
    backgroundUrl: "https://www.eventsforce.com/wp-content/uploads/2020/03/What-event-planners-need-to-know-about-Coronavirus-scaled.jpg",
    logoUrl: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/beer-party-logo-design-template-7d706ba4c79dad786717ff45d97726e3_screen.jpg?ts=1611940642",
    startDate: "2021-10-10",
    endDate: "2021-10-20"
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
    const [event, setEvent] = useState(EventMock);
    const [tickets, setTickets] = useState([TicketMock]);
    const [hotels, setHotels] = useState(HotelsMock);
    const [activities, setActivities] = useState(null);
    const [state, setState] = useState(State.event);

    function getAllInformation() {

    }

    useEffect(() => {
        getAllInformation();
    }, []);

    return (
        <Page>
            <Row style={{ width: '100%' }}>
                <Typography variant='h1'>Administration</Typography>
                <Index>
                    <IndexButton $active={(state == State.event).toString()} onClick={() => setState(State.event)}>
                        <RiCalendarEventLine className='icon' />
                        Event
                    </IndexButton>
                    <IndexButton $active={(state == State.tickets).toString()} onClick={() => setState(State.tickets)}>
                        <BsFillTicketPerforatedFill className='icon' />
                        Tickets
                    </IndexButton>
                    <IndexButton $active={(state == State.hotels).toString()} onClick={() => setState(State.hotels)}>
                        <MdHotel className='icon' />
                        Hotels
                    </IndexButton>
                    <IndexButton $active={(state == State.activities).toString()} onClick={() => setState(State.activities)}>
                        <BsFillCalendar2DateFill className='icon' />
                        Activities
                    </IndexButton>
                </Index>
                {
                    state === State.event &&
                    <Dashboard style={{padding:'20px ', display:'flex',flexDirection:'column', gap:'20px',justifyContent:'space-between', alignItems:'center'}}>

                        <Content>
                        <EventForm>
                            <Typography variant='h3'>
                                Event information
                            </Typography>
                            <InputContainer>
                                <label htmlFor="event-title">Title</label>
                                <Input onChange={(e) => setEvent({...event,title:e.target.value})} id='event-title' name='event-title' type="text" placeholder='Title' value={event.title} />
                            </InputContainer>
                            <InputContainer>
                                <label htmlFor="event-background">Background URL</label>
                                <Input onChange={(e) => setEvent({...event,backgroundUrl:e.target.value})} id='event-background' name='event-background' type="text" placeholder='Background URL' value={event.backgroundUrl} />
                            </InputContainer>
                            <InputContainer>
                                <label htmlFor="event-logo">Logo URL</label>
                                <Input onChange={(e) => setEvent({...event,logoUrl:e.target.value})} id='event-logo' name='event-logo' type="text" placeholder='Logo URL' value={event.logoUrl} />
                            </InputContainer>
                            <InputContainer>
                                <label htmlFor="event-start-date">Start Date</label>
                                <Input onChange={(e) => setEvent({...event,startDate:e.target.value})} id='event-start-date' name='event-start-date' type="date" value={event.startDate} />
                            </InputContainer>
                            <InputContainer>
                                <label htmlFor="event-end-date">End Date</label>
                                <Input onChange={(e) => setEvent({...event,endDate:e.target.value})} id='event-end-date' name='event-end-date' type="date" value={event.endDate} />
                            </InputContainer>
                           
                        </EventForm>
                        <EventPreview>

                            <div className='images'>
                                <img src={event.backgroundUrl} alt="background" />
                                <div className='banner'>
                                    <div className='main'>
                                        <img className='logo' src={event.logoUrl} alt="background" />
                                        <h1>{event.title}</h1>
                                    </div>
                                    <div className='dates'>
                                        <span>Start Date: {event.startDate}</span>
                                        <span>End Date: {event.endDate}</span>
                                    </div>
                                </div>
                            </div>
                        </EventPreview>
                        </Content>
                        <Button style={{width:'100%'}}>Save</Button>
                    </Dashboard>
                }
                {
                    state === State.tickets &&
                    <Dashboard style={{padding:'20px ', display:'flex',flexDirection:'column', gap:'20px',justifyContent:'space-between', alignItems:'center'}}>
                        <Typography variant='h2'>
                            Tickets
                        </Typography>
                        <EventForm>
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
                        </EventForm>
                    </Dashboard>
                }
                {
                    state === State.hotels &&
                    <Dashboard style={{padding:'20px ', display:'flex',flexDirection:'column', gap:'20px',justifyContent:'space-between', alignItems:'center'}}>
                        <p variant='h2'>
                            Hotels
                        </p>
                    </Dashboard>
                }
                {
                    state === State.activities &&
                    <Dashboard style={{padding:'20px ', display:'flex',flexDirection:'column', gap:'20px',justifyContent:'space-between', alignItems:'center'}}>
                        <p variant='h2'>
                            Activities
                        </p>
                    </Dashboard>
                }
            </Row>
        </Page >
    );
}

const Content = styled.div`
width: 100%;
display: flex;
justify-content: space-between;
align-items: center;
gap: 20px;
`;

const EventForm = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 50%;
`;
const EventPreview = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: hidden;
    border-radius: 10px;
    width: 50%;
    .images {
        position: relative;
        img{
            width: 100%;
            height: 420px;
            object-fit: cover;
            
        }
        .banner{
            width: 100%;
            height: 120px;
            position: absolute;
            left: 0;
            bottom: 0;
            display: flex;
            flex-direction: column;
            gap: 20px;
            justify-content: space-between;
            background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.9) 100%);
            overflow: hidden;
            z-index: 4;
            .main{
                display: flex;
                align-items: center;
                justify-content: flex-start;
                gap: 20px;
                padding: 0 10px;
                img{
                    max-width: 80px;
                    min-width: 80px;
                    min-height: 80px;
                    max-height: 80px;
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    border: 3px solid white;
                    flex-shrink: 0;
                }
                h1{
                    color: white;
                }
            }
            .dates{
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 10px;
                padding-left: 10px;
                padding-right: 10px;
                height: 40px;
                span{
                    color: white;
                }
            }
        }
    }
`;

const InputContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    width: 100%;
`;

const AdmininstrationContent = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
    padding: 30px;
`;
const Index = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0px 10px;
    gap: 10px;
    width: 100%;
    height: 60px;
    background-color: #ccc;
`;
const IndexButton = styled.button`

        height: 100%;
        width: 100%;
        border: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: "Roboto","Helvetica","Arial",sans-serif;
        font-size: 18px;
        cursor: pointer;
        background-color: ${(props) => (props.$active == 'true' ? '#d7d7d7' : '#ebebeb')};
        .icon{
            font-size: 20px;
            margin-right: 10px;
            color:#124090 ;
        }
    
`;
const Page = styled.div`
 display: flex;
  width: 100%;
  flex-wrap: wrap;
 
`;

/*
    (Evento) editar as informações do evento.
    (Ingressos) editar as informações sobre os tipos de ingressos do evento.
    (Hotéis) editar as informações sobre os hotéis e seus respectivos quartos.
    (Atividades) editar as informações sobre as atividades do evento.
*/