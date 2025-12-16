using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace EventEase.Models
{
    public class Event
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("title")]
        public string Title { get; set; } = string.Empty;

        [BsonElement("description")]
        public string Description { get; set; } = string.Empty;

        [BsonElement("location")]
        public string Location { get; set; } = string.Empty;
        
        [BsonElement("date")]
        public string Date { get; set; } = string.Empty; 

        [BsonElement("ticketPrice")]
        public decimal TicketPrice { get; set; } 

        [BsonElement("availableSeats")]
        public int AvailableSeats { get; set; }
    }
}