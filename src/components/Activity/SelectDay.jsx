import { useEffect } from 'react'
import styled from 'styled-components';
import useActivitiesDay from '../../hooks/api/useActivitiesDay';
import { ActivitiesWrapper } from './ActivitiesDayWrapper';
import Button from '../Form/Button';
import Typo from '../Dashboard/Content/Typo';
import formatDayMessage from '../../utils/formatDayMessage';

export default function SelectDay({ selectedDay, setSelectedDay }) {

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
      <Wrapper>
        <div>
          <Typo variant="h6" color="#8E8E8E">Primeiro, filtre pelo dia do evento:</Typo>
          <ActivitiesWrapper>
            {activitiesDay.map((activityDay) => {
              const selectedButton = (selectedDay === activityDay.id);
              return (
                <Content key={activityDay.id} $selectedButton={selectedButton}>
                  <Button onClick={() => selectDay(activityDay.id)}>{formatDayMessage(activityDay.startsAt)}</Button>
                </Content>
              )})
            }
          </ActivitiesWrapper>
        </div>
      </Wrapper>
    </>
  )
}

const Wrapper = styled.div`
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

const Content = styled.div`

  > button {
    background-color: ${(props) => (props.$selectedButton) ? '#FFD37D !important' : 'inherit'} 
  }
`;