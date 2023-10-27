import { useEffect, useState } from 'react';
import styled from 'styled-components';
import useActivitiesDetails from '../../hooks/api/useActivitiesDetails';
import ActivityDetails from './ActivityDetails';
import { toast } from 'react-toastify';
import { v4 as uuid } from 'uuid';

export default function SelectActivity({ selectedDay }) {

  const { getActivitiesDetails } = useActivitiesDetails();
  const [activitiesHashtable, setActivitiesHashtable] = useState(null);
  const [userActivitiesIds, setUserActivitiesIds] = useState(null);

  function initActivitiesHashtable(activitiesFromDay) {
    const hashTable = {};
    for (let i = 0; i < activitiesFromDay.length; i++) {
      const element = activitiesFromDay[i];
      const location = element.location;
      if (!hashTable[location]) {
        hashTable[location] = [element];
      } else {
        hashTable[location] = [...hashTable[location], element];
      }
    }
    return hashTable;
  }

  function initUserActivitiesHashtable(userActivitiesIds) {
    const hashTable = {};
    for (let i = 0; i < userActivitiesIds.length; i++) {
      const element = userActivitiesIds[i];
      hashTable[element] = element;
    }
    return hashTable;
  }

  async function fetchData() {
    try {
      const data = await getActivitiesDetails(selectedDay);
      const activitiesHashtable = initActivitiesHashtable(data.activitiesFromDay);
      const userActivitiesHashtable = initUserActivitiesHashtable(data.userActivitiesIds);

      setActivitiesHashtable(activitiesHashtable);
      setUserActivitiesIds(userActivitiesHashtable);

    } catch (err) {
      toast('Não foi possível carregar os dados.');
      return;
    }
  }
  
  useEffect(() => {
    fetchData();
  }, [selectedDay]);

  if (!activitiesHashtable) {
    return;
  }

  return (
    <ContentWrapper>
      {Object.keys(activitiesHashtable).map((key) => (
        <ActivityDetails
          key={uuid()}
          activitiesFromDay={activitiesHashtable[key]}
          userActivitiesIds={userActivitiesIds}
        />
      ))}
    </ContentWrapper>
  )
}

const ContentWrapper = styled.div`

  display: flex;
  margin: 30px 0;
`;