import useAsync from '../useAsync';
import useToken from '../useToken';

import * as ticketApi from '../../services/ticketApi.js';

export default function useTicketTypes() {
  const token = useToken();
  
  const {
    data: ticketTypes,
    loading: ticketTypesLoading,
    error: ticketTypesError,
    act: ticketTypesProcess
  } = useAsync(() => ticketApi.getTicketTypes(token), true);

  return {
    ticketTypes,
    ticketTypesLoading,
    ticketTypesError,
    ticketTypesProcess
  };
}
