function Wishlist({ currentUser, wishlist, activities, onWishlistUpdate }) {
  try {
    const [selectedTags, setSelectedTags] = React.useState([]);

    const getWishlistActivities = () => {
      return activities.filter(activity => 
        wishlist.some(item => item.objectData.activityId === activity.objectId)
      );
    };

    const handleRemoveFromWishlist = async (activityId) => {
      try {
        const wishlistItem = wishlist.find(item => item.objectData.activityId === activityId);
        if (wishlistItem) {
          await trickleDeleteObject(`wishlist:${currentUser.id}`, wishlistItem.objectId);
          onWishlistUpdate(currentUser.id);
        }
      } catch (error) {
        alert('Failed to remove from wishlist');
      }
    };

    if (!currentUser) {
      return (
        <div className="text-center py-12" data-name="wishlist-auth" data-file="components/Wishlist.js">
          <div className="icon-heart text-4xl text-gray-300 mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Sign in to view your wishlist</h3>
          <p className="text-gray-600">Save activities you're interested in for easy planning later.</p>
        </div>
      );
    }

    const wishlistActivities = getWishlistActivities();

    return (
      <div data-name="wishlist" data-file="components/Wishlist.js">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">Activities you've saved for future weekend plans.</p>
        </div>

        {wishlistActivities.length === 0 ? (
          <div className="text-center py-12">
            <div className="icon-heart text-4xl text-gray-300 mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600">Start discovering activities to save them here for later planning.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistActivities.map(activity => (
              <div key={activity.objectId} className="relative">
                <ActivityCard
                  activity={activity}
                  currentUser={currentUser}
                  isInWishlist={true}
                />
                <button
                  onClick={() => handleRemoveFromWishlist(activity.objectId)}
                  className="absolute top-2 right-2 bg-red-100 text-red-600 p-1 rounded-full hover:bg-red-200 transition-colors"
                  title="Remove from wishlist"
                >
                  <div className="icon-x text-sm"></div>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Wishlist component error:', error);
    return null;
  }
}