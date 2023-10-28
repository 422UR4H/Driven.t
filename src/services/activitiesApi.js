import api from './api';

export async function getActivitiesDay(token) {
  const response = await api.get('/activities', {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });

  return response.data;
}

export async function getActivitiesDetails(activityDayId, token) {
  const response = await api.get(`/activities/${activityDayId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });

  return response.data;
}

export async function registerActivities(body, token) {
  const response = await api.post(`/activities/`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });

  return response.data;
}
