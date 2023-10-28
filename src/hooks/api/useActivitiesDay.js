import useAsync from '../useAsync';
import useToken from '../useToken';

import * as activitiesApi from '../../services/activitiesApi';

export default function useActivitiesDay() {
  const token = useToken();
  
  const {
    data: activitiesDay,
    loading: activitiesDayLoading,
    error: activitiesDayError,
    act: getActivitiesDay
  } = useAsync(() => activitiesApi.getActivitiesDay(token));

  return {
    activitiesDay,
    activitiesDayLoading,
    activitiesDayError,
    getActivitiesDay
  };
}
