import { useEffect, useState } from "react";
import Typo from "../Dashboard/Content/Typo.jsx";
import TicketContainer from "./TicketContainer.jsx";
import styled from "styled-components";
import ReserveTicket from "./ReserveTicket.jsx";
import { formatPrice } from "../../utils/formatPrice.js";


export default function TicketAndPayment({ setStatus, setTicketType, ticketTypes, hasEnrollment }) {
    const [modality, setModality] = useState(undefined);
    const [haveHotel, setHaveHotel] = useState(undefined);
    const [hotelPrice, setHotelPrice] = useState(undefined);
    const [remoteTicketPrice, setRemoteTicketPrice] = useState(undefined);
    const [ticketWithoutHotelPrice, setTicketWithoutHotelPrice] = useState(undefined);

    function handlePrice() {
        if (modality === "Online") return formatPrice(remoteTicketPrice);
        if (modality === "Presencial") {
            if (haveHotel === "Sem Hotel") return formatPrice(ticketWithoutHotelPrice);
            if (haveHotel === "Com Hotel") return formatPrice(ticketWithoutHotelPrice + hotelPrice);
        }
        return 0;
    }

    function handleUserTicket() {
        const isRemote = modality === "Online";
        if (isRemote) {
            return ticketTypes.find(t => t.includesHotel === false && t.isRemote === isRemote);
        }
        const includesHotel = haveHotel === "Com Hotel";
        return ticketTypes.find(t => t.includesHotel === includesHotel && t.isRemote === false);
    }

    useEffect(() => {
        if (ticketTypes && ticketTypes?.length > 0) {
            const priceWithoutHotel = ticketTypes.find(t => !t.isRemote && !t.includesHotel).price;
            const priceWithHotel = ticketTypes.find(t => !t.isRemote && t.includesHotel).price;
            setTicketWithoutHotelPrice(priceWithoutHotel);
            setHotelPrice(Math.abs(priceWithHotel - priceWithoutHotel))
            setRemoteTicketPrice(ticketTypes.find(t => t.isRemote).price);
        }
    }, [ticketTypes]);

    async function handleClick() {
        const ticketType = handleUserTicket();
        if (!ticketType.isRemote && ticketType.includesHotel) {
            ticketType.price = ticketWithoutHotelPrice + hotelPrice;
        }
        setTicketType(ticketType);
        setStatus("payment");
    }

    return (
        <StyledTicketAndPayment>

            {!hasEnrollment ? (
                <VoidContainer>
                    <Typo variant="h6" color="#8E8E8E">
                        Você precisa completar sua inscrição antes<br />
                        de prosseguir pra escolha de ingresso
                    </Typo>
                </VoidContainer>) : (
                <>
                    <Typo variant="h6" color="#8E8E8E">
                        Primeiro, escolha sua modalidade de ingresso
                    </Typo>
                    <TicketContainer
                        text1="Presencial"
                        text2="Online"
                        price1={"R$ " + formatPrice(ticketWithoutHotelPrice)}
                        price2={"R$ " + formatPrice(remoteTicketPrice)}
                        option={modality}
                        setOption={setModality}
                    />
                    {modality === "Presencial" && (<>
                        <Typo variant="h6" color="#8E8E8E">
                            Ótimo! Agora escolha sua modalidade de hospedagem
                        </Typo>
                        <TicketContainer
                            text1="Sem Hotel"
                            text2="Com Hotel"
                            price1="+ R$ 0"
                            price2={"+ R$ " + formatPrice(hotelPrice)}
                            option={haveHotel}
                            setOption={setHaveHotel}
                        />
                    </>)}
                    {(modality === "Online" || haveHotel !== undefined) && (
                        <ReserveTicket
                            value={handlePrice()}
                            handleClick={handleClick}
                        />
                    )}
                </>
            )}
        </StyledTicketAndPayment>
    );
}

const StyledTicketAndPayment = styled.div`
    height: 90%;
`;

const VoidContainer = styled.div`
    text-align: center;
    height: inherit;

    display: flex;
    align-items: center;
    justify-content: center;
`;