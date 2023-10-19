import { useEffect, useState } from "react";
import Typo from "../Dashboard/Content/Typo.jsx";
import TicketContainer from "./TicketContainer.jsx";
import useEnrollment from "../../hooks/api/useEnrollment.js";
import styled from "styled-components";
import ReserveTicket from "./ReserveTicket.jsx";
import useTicketTypes from "../../hooks/api/useTicketTypes.js";

export default function TicketAndPayment() {
    const { enrollment } = useEnrollment();
    const [modality, setModality] = useState(undefined);
    const [haveHotel, setHaveHotel] = useState(undefined);
    const [hotelPrice, setHotelPrice] = useState(undefined);
    const [remoteTicketPrice, setRemoteTicketPrice] = useState(undefined);
    const [ticketWithoutHotelPrice, setTicketWithoutHotelPrice] = useState(undefined);
    const {
        ticketTypes,
        ticketTypesProcess,
        ticketTypesLoading,
        ticketTypesError
    } = useTicketTypes();

    function handlePrice() {
        if (modality === "Online") return remoteTicketPrice / 100;
        if (modality === "Presencial") {
            if (haveHotel === "Sem Hotel") return ticketWithoutHotelPrice / 100;
            if (haveHotel === "Com Hotel") return (ticketWithoutHotelPrice + hotelPrice) / 100;
        }
        return 0;
    }

    async function instanceTicketTypes() {
        await ticketTypesProcess();
    }

    useEffect(() => {
        instanceTicketTypes();
        // if (ticketTypesError) // FIXME: finish this
    }, [ticketTypesError]);
    
    useEffect(() => {
        if (ticketTypes && ticketTypes.length > 0) {
            const priceWithoutHotel = ticketTypes.find(t => !t.isRemote && !t.includesHotel).price;
            const priceWithHotel = ticketTypes.find(t => !t.isRemote && t.includesHotel).price;
            setTicketWithoutHotelPrice(priceWithoutHotel);
            setHotelPrice(priceWithHotel - priceWithoutHotel)
            setRemoteTicketPrice(ticketTypes.find(t => t.isRemote).price);
        } 
    }, [ticketTypes]);
    

    return (
        <StyledTicketAndPayment>
            <Typo variant="h4">Ingresso e pagamento</Typo>

            {!enrollment ? (
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
                        price1={"R$ " + (ticketWithoutHotelPrice || 100) / 100}
                        price2={"R$ " + (remoteTicketPrice || 100) / 100}
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
                            price2={"+ R$ " + (hotelPrice || 100) / 100}
                            option={haveHotel}
                            setOption={setHaveHotel}
                        />
                    </>)}
                    {(modality === "Online" || haveHotel !== undefined) && (
                        <ReserveTicket value={handlePrice()} />
                    )}
                </>
            )}
        </StyledTicketAndPayment>
    );
}

// FIXME: finish this
const StyledTicketAndPayment = styled.div`
    /* .test {
        margin-top: 100px;
    } */
`;

const VoidContainer = styled.div`
    text-align: center;
    height: 80%;

    display: flex;
    align-items: center;
    justify-content: center;
`;