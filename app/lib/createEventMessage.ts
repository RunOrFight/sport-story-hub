import {IEventFull} from "./types";

const getDateFromMsString = (msString: string) => {
    return new Date(Number(msString)).toDateString()
}

const createEventMessage = ({date, place, price, participants, participantsCount}: IEventFull) => {
    return `
Date: <b>${getDateFromMsString(date)}</b>
Place: <b>${place}</b>
Price: <b>${price}</b>
Participants (${participants.length}/${participantsCount}):
${participants.map((it) => `@${it}`).join("\n")}`
}

export {createEventMessage}
