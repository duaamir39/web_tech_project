using EventEase.Configuration;
using EventEase.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace EventEase.Services
{
    public class BookingService
    {
        private readonly IMongoCollection<Booking> _bookingsCollection;

        public BookingService(IOptions<EventEaseDatabaseSettings> settings)
        {
            var mongoClient = new MongoClient(settings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(settings.Value.DatabaseName);

            _bookingsCollection = mongoDatabase.GetCollection<Booking>(
                settings.Value.BookingsCollectionName);
        }

        public async Task CreateAsync(Booking newBooking) =>
            await _bookingsCollection.InsertOneAsync(newBooking);

        public async Task<List<Booking>> GetByUserIdAsync(string userId) =>
            await _bookingsCollection.Find(booking => booking.UserId == userId).ToListAsync();
    }
}