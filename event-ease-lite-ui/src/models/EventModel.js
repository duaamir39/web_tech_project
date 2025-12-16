class EventModel {
    constructor(id, title, description, location, date, ticketPrice, availableSeats) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.location = location;
        this.date = date;
        this.ticketPrice = ticketPrice;
        this.availableSeats = availableSeats;
    }
}

export default EventModel;
