import dayjs from 'dayjs';

export default function formatDayMessage(date) {

  const dayMonth = dayjs(date).format('DD/MM');
  
  const formatedData = new Date(date);
  const weekday = (formatedData.toLocaleString('pt-BR', {weekday: "long"})).split('-feira')[0];

  return `${weekday}, ${dayMonth}`;
}