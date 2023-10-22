import api from './api';

export async function getHotels(token) {
  const response = await api.get('/hotels', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function getRooms(token, hotel) {
  const response = await api.get(`/hotels/${hotel.id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function postBooking(token, data) {
  const response = await api.post('/booking', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
