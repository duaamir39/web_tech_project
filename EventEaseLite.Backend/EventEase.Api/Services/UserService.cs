using EventEase.Configuration;
using EventEase.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace EventEase.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _usersCollection;

        public UserService(IOptions<EventEaseDatabaseSettings> settings)
        {
            var mongoClient = new MongoClient(settings.Value.ConnectionString);
            
            var mongoDatabase = mongoClient.GetDatabase(
                settings.Value.DatabaseName);

            _usersCollection = mongoDatabase.GetCollection<User>(
                settings.Value.UsersCollectionName);
        }

        public async Task<User?> GetByEmailAsync(string email) =>
            await _usersCollection.Find(user => user.Email == email).FirstOrDefaultAsync();
        public async Task CreateAsync(User newUser) =>
            await _usersCollection.InsertOneAsync(newUser);
    }
}