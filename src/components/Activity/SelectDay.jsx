import { useEffect } from 'react'
import styled from 'styled-components';
import useActivitiesDay from '../../hooks/api/useActivitiesDay';
import { ActivitiesWrapper } from './ActivitiesDayWrapper';
import Button from '../Form/Button';
import Typo from '../Dashboard/Content/Typo';
import formatDayMessage from '../../utils/formatDayMessage';

export default function SelectDay({ setSelectedDay }) {

  const { activitiesDay } = useActivitiesDay();

  useEffect(() => {}, [activitiesDay]);

  if (!activitiesDay) {
    return;
  }

  function selectDay(activityDayId) {
    setSelectedDay(activityDayId);
  }

  return (
    <>
      <TopWrapper>
        <div>
          <Typo variant="h6" color="#8E8E8E">Primeiro, filtre pelo dia do evento:</Typo>
          <ActivitiesWrapper>
            {activitiesDay.map((activityDay) => (
              <div key={activityDay.id}>
                <Button onClick={() => selectDay(activityDay.id)}>{formatDayMessage(activityDay.startsAt)}</Button>
              </div>
            ))}
          </ActivitiesWrapper>
        </div>
      </TopWrapper>
    </>
  )
}

const TopWrapper = styled.div`
  display: flex;

  > div {
    width: 100%;
  }

  @media (max-width: 750px) {
    flex-direction: column;
    width: 100%;
    margin: auto;
  }
`;