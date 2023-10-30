import useAsync from '../useAsync';
import useToken from '../useToken';

import * as ticketApi from '../../services/ticketApi.js';

export function useGetTicket() {
  const token = useToken();
  
  const {
    data: ticket,
    loading: ticketLoading,
    error: ticketError,
    act: getTicket
  } = useAsync(() => ticketApi.getTicket(token));

  return {
    ticket,
    ticketLoading,
    ticketError,
    getTicket
  };
}


export function useCreateTicket() {
  const token = useToken();
  
  const {
    data: createdTicket,
    loading: createdTicketLoading,
    error: createdTicketError,
    act: createTicket
  } = useAsync((body) => ticketApi.postTicket(token, body), false);

  return {
    createdTicket,
    createdTicketLoading,
    createdTicketError,
    createTicket
  };
}
