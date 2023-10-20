import useAsync from '../useAsync';
import useToken from '../useToken';

import * as ticketApi from '../../services/ticketApi.js';

export default function useTicket() {
  const token = useToken();
  
  const {
    data: ticket,
    loading: ticketLoading,
    error: ticketError,
    act: createTicket
  } = useAsync((body) => ticketApi.postTicket(token, body), false);

  return {
    ticket,
    ticketLoading,
    ticketError,
    createTicket
  };
}
