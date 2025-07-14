function ActivityCard({ activity, onAddToWishlist, isInWishlist, currentUser, onAddToPlan, showAddToPlan = false }) {
  try {
    const getCategoryColor = (category) => {
      const colors = {
        restaurants: 'bg-orange-100 text-orange-700',
        events: 'bg-purple-100 text-purple-700',
        outdoors: 'bg-green-100 text-green-700',
        'arts-culture': 'bg-pink-100 text-pink-700',
        shopping: 'bg-blue-100 text-blue-700',
        nightlife: 'bg-indigo-100 text-indigo-700',
        wellness: 'bg-teal-100 text-teal-700'
      };
      return colors[category] || 'bg-gray-100 text-gray-700';
    };

    const handleAddToWishlist = async () => {
      if (!currentUser) {
        alert('Please sign in to save activities');
        return;
      }

      try {
        await trickleCreateObject(`wishlist:${currentUser.id}`, {
          userId: currentUser.id,
          activityId: activity.objectId,
          tags: []
        });
        onAddToWishlist && onAddToWishlist(currentUser.id);
      } catch (error) {
        alert('Failed to add to wishlist');
      }
    };

    return (
      <div className="activity-card" data-name="activity-card" data-file="components/ActivityCard.js">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg text-gray-900">{activity.objectData.name}</h3>
          <div className="flex space-x-2">
            {!isInWishlist && currentUser && (
              <button
                onClick={handleAddToWishlist}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Add to wishlist"
              >
                <div className="icon-heart text-lg"></div>
              </button>
            )}
            {isInWishlist && (
              <div className="p-2 text-red-500" title="In wishlist">
                <div className="icon-heart text-lg"></div>
              </div>
            )}
            {showAddToPlan && onAddToPlan && (
              <button
                onClick={() => onAddToPlan(activity)}
                className="btn-primary text-sm"
              >
                Add to Plan
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-2">
          <span className={`category-badge ${getCategoryColor(activity.objectData.category)}`}>
            {activity.objectData.category}
          </span>
          {activity.objectData.estimatedCost && (
            <span className="text-sm text-gray-600">
              ${activity.objectData.estimatedCost}
            </span>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-3">{activity.objectData.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <div className="icon-map-pin text-sm mr-1"></div>
            {activity.objectData.location}
          </div>
          
          {activity.objectData.website && (
            <a
              href={activity.objectData.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Learn More
            </a>
          )}
        </div>

        {activity.objectData.tags && activity.objectData.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {activity.objectData.tags.split(',').map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                {tag.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('ActivityCard component error:', error);
    return null;
  }
}