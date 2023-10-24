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

export async function changeBooking(token, data) {
  const response = await api.put(`/booking/${data.roomId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function getBooking(token) {
  try {
    const result = await api.get('/booking', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return result.data;
  } catch (err) {
    if (err.response.status !== 404) console.log(err);
    return null;
  }
}


export async function getHotelsWithAllRooms(token) {
  const response = await api.get('/hotels/all-with-rooms', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
