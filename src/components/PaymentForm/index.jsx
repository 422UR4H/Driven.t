/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Typo from '../Dashboard/Content/Typo.jsx';
import { toast } from 'react-toastify';
import { useForm } from '../../hooks/useForm';
import { useCreateTicket } from '../../hooks/api/useTicket';
import { TicketWrapper } from './TicketWrapper';
import { PaymentWrapper } from './PaymentWrapper';
import { FormWrapper } from './FormWrapper';
import { InputWrapper } from './InputWrapper';
import { FinishedPaymentWrapper } from './FinishedPaymentWrapper';
import { ErrorMsg } from '../PaymentForm/ErrorMsg';
import Input from '../Form/Input';
import Button from '../Form/Button';
import usePayment from '../../hooks/api/usePayment';
import FormValidations from './FormValidations';
import { formatPrice } from '../../utils/formatPrice.js';

import CheckCircleIcon from '../../assets/images/checkmark.svg';
import creditCardExample from '../../assets/images/creditCard.png';

export default function PaymentForm({ ticketType }) {
  const [disableForm, setDisableForm] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const { createTicket } = useCreateTicket();
  const { paymentProcess } = usePayment();

  const {
    handleSubmit,
    handleChange,
    data,
    errors,
  } = useForm({
    validations: FormValidations,

    onSubmit: async (data) => {
      const issuerIdentification = data.number.slice(0, 4);
      const firstDigit = parseInt(issuerIdentification[0], 10);
      const twoDigits = parseInt(issuerIdentification[0] + issuerIdentification[1], 10);
      const allDigits = parseInt(issuerIdentification, 10);

      /* Checking card issuer */
      let issuer = null;
      if (firstDigit === 4) issuer = 'VISA';
      else if ((twoDigits >= 51 && twoDigits <= 55) || (allDigits >= 2221 && allDigits <= 2720)) issuer = 'MASTERCARD';

      if (issuer === null) {
        toast('Cartão Inválido!');
        return;
      }

      let ticket = null;
      setDisableForm(true);

      try {
        ticket = await createTicket({ ticketTypeId: ticketType.id });
      } catch (err) {
        console.log(err.response.data.message);
        toast('Não foi possível realizar o pagamento!');
        setDisableForm(false);
        return;
      }

      const newData = {
        ticketId: ticket.id,
        price: ticketType.price,
        cardData: {
          issuer,
          number: data.number,
          name: data.name,
          expirationDate: data.expirationDate,
          cvv: data.cvv,
        }
      };

      try {
        await paymentProcess(newData);
        setPaymentStatus('succeed');
        toast('Pagamento efetuado com sucesso!');
      } catch (err) {
        console.log(err.response.data.message);
        toast('Não foi possível realizar o pagamento!');
        setDisableForm(false);
      }
    },

    initialValues: {
      number: '',
      name: '',
      expirationDate: '',
      cvv: '',
    },
  });

  useEffect(() => {
    if (!ticketType) return;
  }, []);

  function formatTicketMessage() {
    
    let message = '';
    if (ticketType.isRemote) {
      message += 'Online';
      return message;
    }

    if (!ticketType.includesHotel) message += 'Presencial';
    else message += 'Presencial + Hotel';

    return message;
  }

  const ticketMessage = formatTicketMessage();

  return (
    <>
      <Typo variant="h6" color="#8E8E8E">Ingressos escolhido</Typo>
      <TicketWrapper>
        <div>
          <Typo variant="h6">{ticketMessage}</Typo>
          <Typo variant="body1" color="#8E8E8E">R$ {formatPrice(ticketType.price)}</Typo>
        </div>
      </TicketWrapper>
      <Typo variant="h6" color="#8E8E8E">Pagamento</Typo>
      <PaymentWrapper>
        {paymentStatus === 'pending' &&
          <>
            <img src={creditCardExample} alt="creditCardExample" />
            <FormWrapper onSubmit={handleSubmit}>
              <InputWrapper>
                <Input
                  label="Card Number"
                  name="number"
                  size="small"
                  value={data.number}
                  mask="9999 9999 9999 9999"
                  onChange={handleChange('number')}
                />
                {errors.number && <ErrorMsg>{errors.number}</ErrorMsg>}
                <Typo variant="body1" color="#8E8E8E" fontSize="14px">E.g.: 49..., 51..., 55..., 22...</Typo>
              </InputWrapper>
              <InputWrapper>
                <Input
                  label="Name"
                  name="name"
                  size="small"
                  value={data.name}
                  onChange={handleChange('name')}
                />
                {errors.name && <ErrorMsg>{errors.name}</ErrorMsg>}
              </InputWrapper>
              <InputWrapper>
                <div>
                  <Input
                    label="Valid Thru"
                    name="expirationDate"
                    type="text"
                    mask="99/99"
                    size="small"
                    value={data.expirationDate}
                    onChange={handleChange('expirationDate')}
                  />
                  <Input
                    label="CVC"
                    name="cvv"
                    mask="999"
                    size="small"
                    value={data.cvv}
                    onChange={handleChange('cvv')}
                  />
                </div>
                {errors.expirationDate && <ErrorMsg>{errors.expirationDate}</ErrorMsg>}
                {errors.cvv && <ErrorMsg>{errors.cvv}</ErrorMsg>}
              </InputWrapper>
              <SubmitContainer>
                <Button type="submit" disabled={disableForm}>
                  Finalizar Pedido
                </Button>
              </SubmitContainer>
            </FormWrapper>
          </>
        }
        {paymentStatus === 'succeed' &&
          <FinishedPaymentWrapper>
            <img src={CheckCircleIcon} />
            <div>
              <Typo variant="body1">Pagamento confirmado!</Typo>
              <Typo variant="body2" color="#606060">Prossiga para escolha de hospedagem e atividades</Typo>
            </div>
          </FinishedPaymentWrapper>
        }
      </PaymentWrapper>
    </>
  )
}

const SubmitContainer = styled.div`
  margin-top: 20px!important;
  width: 100%!important;

  @media (max-width: 750px) {
    display: flex;
    justify-content: center;
  }
`;