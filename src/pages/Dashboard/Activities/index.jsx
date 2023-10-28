import { useState } from "react";
import SelectDay from "../../../components/Activity/SelectDay";
import SelectActivity from "../../../components/Activity/SelectActivity";
import Typo from "../../../components/Dashboard/Content/Typo";

export default function Activities() {

  const [selectedDay, setSelectedDay] = useState(null);

  return (
    <>
      <Typo variant="h4">Escolha de atividades</Typo>
      <SelectDay
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
      />
      {selectedDay &&
        <SelectActivity selectedDay={selectedDay} />
      }
    </>
  )
}
