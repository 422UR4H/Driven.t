import { useEffect, useState } from 'react';
import useActivitiesDetails from '../../hooks/api/useActivitiesDetails';
import { toast } from 'react-toastify';

export default function SelectActivity({ selectedDay }) {

  const { getActivitiesDetails } = useActivitiesDetails();
  const [activitiesFromDay, setActivitiesFromDay] = useState(null);
  const [userActivitiesIds, setUserActivitiesIds] = useState(null);

  async function fetchData() {
    try {
      const data = await getActivitiesDetails(selectedDay);
      console.log(data);
      setActivitiesFromDay(data.activitiesFromDay);
      setUserActivitiesIds(data.userActivitiesIds);
    } catch (err) {
      toast('Não foi possível carregar os dados');
      return;
    }
  }
  
  useEffect(() => {
    fetchData();
  }, [selectedDay]);

  if (!activitiesFromDay) {
    return;
  }

  return (
    <h1>ok</h1>
  )
}