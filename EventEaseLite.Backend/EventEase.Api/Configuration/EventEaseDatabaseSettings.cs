namespace EventEase.Configuration
{
    public class EventEaseDatabaseSettings
    {
        public string ConnectionString { get; set; } = string.Empty;
        public string DatabaseName { get; set; } = string.Empty;
        public string UsersCollectionName { get; set; } = string.Empty;
        public string EventsCollectionName { get; set; } = string.Empty;
        public string BookingsCollectionName { get; set; } = string.Empty;
    }
}