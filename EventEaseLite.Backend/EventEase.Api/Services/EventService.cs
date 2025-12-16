using EventEase.Configuration;
using EventEase.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace EventEase.Services
{
    public class EventService
    {
        private readonly IMongoCollection<Event> _eventsCollection;

        public EventService(IOptions<EventEaseDatabaseSettings> settings)
        {
            var mongoClient = new MongoClient(settings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(settings.Value.DatabaseName);

            _eventsCollection = mongoDatabase.GetCollection<Event>(
                settings.Value.EventsCollectionName);
        }
        public async Task<List<Event>> GetAsync() =>
            await _eventsCollection.Find(_ => true).ToListAsync();

        public async Task<Event?> GetAsync(string id) =>
            await _eventsCollection.Find(eventItem => eventItem.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(Event newEvent) =>
            await _eventsCollection.InsertOneAsync(newEvent);
        public async Task UpdateSeatsAsync(FilterDefinition<Event> filter, UpdateDefinition<Event> update) =>
            await _eventsCollection.UpdateOneAsync(filter, update);
    }
}