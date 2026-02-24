import TicketForm from '../../components/ticket/TicketForm'
import TrackProgress from '../../components/ticket/TrackProgress';
function CreateTicket() {
    return(
        <>
            <TicketForm />
            <TrackProgress />
        </>
    );
}
export default CreateTicket;