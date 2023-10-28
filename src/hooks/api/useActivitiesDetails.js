import useAsync from '../useAsync';
import useToken from '../useToken';

import * as activitiesApi from '../../services/activitiesApi';

export default function useActivitiesDetails() {
  const token = useToken();
  
  const {
    data: activitiesDetails,
    loading: activitiesDetailsLoading,
    error: activitiesDetailsError,
    act: getActivitiesDetails
  } = useAsync((activityDayId) => activitiesApi.getActivitiesDetails(activityDayId, token), false);

  return {
    activitiesDetails,
    activitiesDetailsLoading,
    activitiesDetailsError,
    getActivitiesDetails
  };
}
