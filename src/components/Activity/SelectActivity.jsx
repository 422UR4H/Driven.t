import { useEffect, useState } from 'react';
import styled from 'styled-components';
import useActivitiesDetails from '../../hooks/api/useActivitiesDetails';
import useRegisterActivities from '../../hooks/api/useRegisterActivities';
import { BiSolidDoorOpen } from 'react-icons/bi';
import { BsXCircle } from 'react-icons/bs';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { v4 as uuid } from 'uuid';

export default function SelectActivity({ selectedDay }) {

  const { getActivitiesDetails } = useActivitiesDetails();
  const { registerActivities } = useRegisterActivities();

  const [activitiesHashtable, setActivitiesHashtable] = useState(null);
  const [userActivitiesIds, setUserActivitiesIds] = useState(null);
  const [disable, setDisable] = useState(false);
  const [fetch, setFetch] = useState(null);

  function formatTimestamp(timestamp) {
    return Number(timestamp.split(':').join(''));
  }

  function activityIcon(hasUserActivityId, capacity) {

    if (hasUserActivityId) {
      return (
        <>
          <AiOutlineCheckCircle style={{ height: "3em", width: "1.5em", color: "#078632" }} />
          <p className='Available'>Inscrito</p>
        </>
      )
    }

    if (capacity > 0) {
      return (
        <>
          <BiSolidDoorOpen style={{ height: "3em", width: "1.5em", color: "#078632" }} />
          <p className='Available'>{capacity} vagas</p>
        </>
      )
    }

    return (
      <>
        <BsXCircle style={{ height: "3em", width: "1.5em", color: "#CC6666" }} />
        <p className='Unavailable'>Esgotado</p>
      </>
    )
  }

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

  async function selectActivity(hasUserActivityId, activity) {

    if (hasUserActivityId || activity.capacity <= 0 || disable) {
      return;
    }

    const body = {
      activityDayId: activity.activityDayId,
      activityId: activity.id,
    };

    try {
      setDisable(true);
      await registerActivities(body);
      toast('Atividade registrada com sucesso.');
      setDisable(false);
      setFetch(uuid());

    } catch (err) {
      toast('Erro ao registrar atividade. Tente novamente mais tarde');
      setDisable(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [selectedDay, fetch]);

  if (!activitiesHashtable) {
    return;
  }

  return (
    <PageWrapper>
      {Object.keys(activitiesHashtable).map((key) => {
        const activitiesFromDay = activitiesHashtable[key];
        return (
          <Wrapper key={uuid()}>
            <h2>{activitiesFromDay[0].location}</h2>
            <ContentWrapper>
              {activitiesFromDay.map((activity) => {
        
                const startsAt = formatTimestamp(activity.startsAt);
                const endsAt = formatTimestamp(activity.endsAt);
                const totalTime = Math.abs(endsAt - startsAt);
                const hasUserActivityId = (userActivitiesIds[activity.id]) ? true : false;
      
                return (
                  <Content
                    key={uuid()}
                    $totalTime={totalTime}
                    $hasUserActivityId={hasUserActivityId}
                    $capacity={activity.capacity}
                    onClick={() => selectActivity(hasUserActivityId, activity)}
                  >
                    <Details>
                      <p className='ActivityName'>{activity.name}</p>
                      <p className='ActivityTimestamp'>{activity.startsAt} - {activity.endsAt}</p>
                    </Details>
                    <Status>
                      {activityIcon(hasUserActivityId, activity.capacity)}
                    </Status>
                  </Content>
                )
              })}
            </ContentWrapper>
          </Wrapper>
        )
      })}
    </PageWrapper>
  )
}

const PageWrapper = styled.div`

  display: flex;
  margin: 30px 0;
`;

const Wrapper = styled.div`

  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  h2 {
    font-size: 16px;
  }
`;

const ContentWrapper = styled.div`

  width: 100%;
  border: 2px solid #D7D7D7;
  height: -webkit-fill-available;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Content = styled.div`

  height: ${(props) => {
    const totalTimeParts = String(props.$totalTime).split('');
    let height = 80;
    height = (Number(totalTimeParts[0]) * height); 
    height = (Number(totalTimeParts[1]) * 15 + height);
    return `${height}px`;
  }};

  background-color: ${(props) => (props.$hasUserActivityId) ? '#D0FFDB' : '#F1F1F1'};
  cursor: ${(props) => {
    if (props.$hasUserActivityId || props.$capacity <= 0) return 'not-allowed';
    return 'pointer';
  }};

  width: 90%;
  margin: 10px auto;
  padding: 10px 0;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  transition: 250ms;

  &:hover {
    opacity: 0.7;
  }
`;

const Details = styled.div`

  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 5px 10px;
  width: 80%;

  > p {
    font-size: 13px;
    word-break: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .ActivityName {
    color: #343434;
  }

  .ActivityTimestamp {
    color: #8E8E8E;
  }
`;

const Status = styled.div`

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 5px;
  border-left: 2px solid #CFCFCF;
  width: 30%;

  > p {
    font-size: 11px;
    text-align: center;
  }

  .Available {
    color: #078632;
  }

  .Unavailable { 
    color: #CC6666;
  }
`;