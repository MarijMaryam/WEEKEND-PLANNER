function ActivitySearch({ activities, currentUser, wishlist, onAddToWishlist }) {
  try {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedCategory, setSelectedCategory] = React.useState('');
    const [filteredActivities, setFilteredActivities] = React.useState(activities);

    const categories = [
      { value: '', label: 'All Categories' },
      { value: 'restaurants', label: 'Restaurants' },
      { value: 'events', label: 'Events' },
      { value: 'outdoors', label: 'Outdoors' },
      { value: 'arts-culture', label: 'Arts & Culture' },
      { value: 'shopping', label: 'Shopping' },
      { value: 'nightlife', label: 'Nightlife' },
      { value: 'wellness', label: 'Wellness' }
    ];

    React.useEffect(() => {
      let filtered = activities;

      if (searchTerm) {
        filtered = filtered.filter(activity =>
          activity.objectData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.objectData.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.objectData.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (selectedCategory) {
        filtered = filtered.filter(activity => 
          activity.objectData.category === selectedCategory
        );
      }

      setFilteredActivities(filtered);
    }, [activities, searchTerm, selectedCategory]);

    const isInWishlist = (activityId) => {
      return wishlist.some(item => item.objectData.activityId === activityId);
    };

    return (
      <div data-name="activity-search" data-file="components/ActivitySearch.js">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Weekend Activities</h1>
          <p className="text-gray-600">Find amazing things to do and save them to your wishlist for planning later.</p>
        </div>

        <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="icon-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></div>
                <input
                  type="text"
                  placeholder="Search activities, locations, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map(activity => (
            <ActivityCard
              key={activity.objectId}
              activity={activity}
              currentUser={currentUser}
              onAddToWishlist={onAddToWishlist}
              isInWishlist={isInWishlist(activity.objectId)}
            />
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <div className="icon-search text-4xl text-gray-300 mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters.</p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('ActivitySearch component error:', error);
    return null;
  }
}