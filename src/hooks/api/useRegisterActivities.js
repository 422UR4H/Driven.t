import useAsync from '../useAsync';
import useToken from '../useToken';

import * as activitiesApi from '../../services/activitiesApi';

export default function useRegisterActivities() {
  const token = useToken();
  
  const {
    data: activitiesRegistration,
    loading: activitiesRegistrationLoading,
    error: activitiesRegistrationError,
    act: registerActivities
  } = useAsync((body) => activitiesApi.registerActivities(body, token), false);

  return {
    activitiesRegistration,
    activitiesRegistrationLoading,
    activitiesRegistrationError,
    registerActivities
  };
}
