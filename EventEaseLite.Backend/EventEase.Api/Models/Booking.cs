using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace EventEase.Models
{
    public class Booking
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        
        [BsonElement("userId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; } = string.Empty; 

        [BsonElement("eventId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string EventId { get; set; } = string.Empty; 

        [BsonElement("bookingDate")]
        public DateTime BookingDate { get; set; } = DateTime.UtcNow;
    }
}