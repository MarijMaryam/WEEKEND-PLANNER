function PlanBuilder({ currentUser, plans, activities, wishlist, selectedPlan, onPlanSelect, onPlanUpdate }) {
  try {
    const [showNewPlanModal, setShowNewPlanModal] = React.useState(false);
    const [newPlanTitle, setNewPlanTitle] = React.useState('');
    const [planItems, setPlanItems] = React.useState([]);
    const [showActivitySelector, setShowActivitySelector] = React.useState(false);

    React.useEffect(() => {
      if (selectedPlan) {
        loadPlanItems(selectedPlan.objectId);
      }
    }, [selectedPlan]);

    const loadPlanItems = async (planId) => {
      try {
        const result = await trickleListObjects(`plan_item:${planId}`, 50, false);
        setPlanItems(result.items || []);
      } catch (error) {
        console.error('Failed to load plan items:', error);
      }
    };

    const createNewPlan = async (e) => {
      e.preventDefault();
      if (!currentUser) return;

      try {
        const newPlan = await trickleCreateObject(`plan:${currentUser.id}`, {
          title: newPlanTitle,
          description: '',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          ownerId: currentUser.id,
          collaborators: [],
          isPublic: false,
          shareLink: ''
        });
        
        setNewPlanTitle('');
        setShowNewPlanModal(false);
        onPlanUpdate(currentUser.id);
        onPlanSelect(newPlan);
      } catch (error) {
        alert('Failed to create plan');
      }
    };

    const addActivityToPlan = async (activity, day = 'saturday') => {
      if (!selectedPlan) return;

      try {
        await trickleCreateObject(`plan_item:${selectedPlan.objectId}`, {
          planId: selectedPlan.objectId,
          activityId: activity.objectId,
          day: day,
          startTime: '10:00',
          endTime: '12:00',
          notes: '',
          order: planItems.filter(item => item.objectData.day === day).length
        });
        
        loadPlanItems(selectedPlan.objectId);
        setShowActivitySelector(false);
      } catch (error) {
        alert('Failed to add activity to plan');
      }
    };

    const getWishlistActivities = () => {
      return activities.filter(activity => 
        wishlist.some(item => item.objectData.activityId === activity.objectId)
      );
    };

    const getPlanItemsByDay = (day) => {
      return planItems
        .filter(item => item.objectData.day === day)
        .sort((a, b) => a.objectData.order - b.objectData.order);
    };

    if (!currentUser) {
      return (
        <div className="text-center py-12" data-name="plan-builder-auth" data-file="components/PlanBuilder.js">
          <div className="icon-calendar text-4xl text-gray-300 mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Sign in to create plans</h3>
          <p className="text-gray-600">Create an account to start building your weekend itineraries.</p>
        </div>
      );
    }

    return (
      <div data-name="plan-builder" data-file="components/PlanBuilder.js">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Weekend Plans</h1>
            <p className="text-gray-600">Build and organize your perfect weekend itineraries.</p>
          </div>
          <button 
            onClick={() => setShowNewPlanModal(true)}
            className="btn-primary"
          >
            <div className="icon-plus text-sm mr-1 inline-block"></div>
            New Plan
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="card">
              <h3 className="font-semibold mb-4">My Plans</h3>
              <div className="space-y-2">
                {plans.map(plan => (
                  <button
                    key={plan.objectId}
                    onClick={() => onPlanSelect(plan)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedPlan?.objectId === plan.objectId
                        ? 'bg-blue-50 border-blue-200 border'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium">{plan.objectData.title}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(plan.objectData.startDate).toLocaleDateString()}
                    </div>
                  </button>
                ))}
                
                {plans.length === 0 && (
                  <p className="text-gray-500 text-sm">No plans yet. Create your first plan!</p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {selectedPlan ? (
              <div>
                <div className="card mb-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">{selectedPlan.objectData.title}</h2>
                    <button 
                      onClick={() => setShowActivitySelector(true)}
                      className="btn-primary"
                    >
                      <div className="icon-plus text-sm mr-1 inline-block"></div>
                      Add Activity
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="card">
                    <h3 className="font-semibold mb-4 flex items-center">
                      <div className="icon-calendar text-lg mr-2"></div>
                      Saturday
                    </h3>
                    <div className="space-y-3">
                      {getPlanItemsByDay('saturday').map(item => (
                        <PlanItem 
                          key={item.objectId} 
                          item={item} 
                          activities={activities}
                          onUpdate={() => loadPlanItems(selectedPlan.objectId)}
                        />
                      ))}
                      {getPlanItemsByDay('saturday').length === 0 && (
                        <p className="text-gray-500 text-sm">No activities planned for Saturday</p>
                      )}
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="font-semibold mb-4 flex items-center">
                      <div className="icon-calendar text-lg mr-2"></div>
                      Sunday
                    </h3>
                    <div className="space-y-3">
                      {getPlanItemsByDay('sunday').map(item => (
                        <PlanItem 
                          key={item.objectId} 
                          item={item} 
                          activities={activities}
                          onUpdate={() => loadPlanItems(selectedPlan.objectId)}
                        />
                      ))}
                      {getPlanItemsByDay('sunday').length === 0 && (
                        <p className="text-gray-500 text-sm">No activities planned for Sunday</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card text-center py-12">
                <div className="icon-calendar text-4xl text-gray-300 mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a plan to get started</h3>
                <p className="text-gray-600">Choose an existing plan or create a new one to start building your weekend itinerary.</p>
              </div>
            )}
          </div>
        </div>

        {/* New Plan Modal */}
        {showNewPlanModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Create New Plan</h2>
              <form onSubmit={createNewPlan}>
                <input
                  type="text"
                  placeholder="Plan title (e.g., 'Weekend Adventure')"
                  value={newPlanTitle}
                  onChange={(e) => setNewPlanTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg mb-4"
                  required
                />
                <div className="flex space-x-3">
                  <button type="submit" className="btn-primary flex-1">Create Plan</button>
                  <button type="button" onClick={() => setShowNewPlanModal(false)} className="btn-secondary flex-1">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Activity Selector Modal */}
        {showActivitySelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-96 overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Add Activity to Plan</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getWishlistActivities().map(activity => (
                  <ActivityCard
                    key={activity.objectId}
                    activity={activity}
                    currentUser={currentUser}
                    showAddToPlan={true}
                    onAddToPlan={(activity) => addActivityToPlan(activity, 'saturday')}
                  />
                ))}
              </div>
              <div className="mt-4">
                <button onClick={() => setShowActivitySelector(false)} className="btn-secondary">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('PlanBuilder component error:', error);
    return null;
  }
}
