function PlanItem({ item, activities, onUpdate }) {
  try {
    const [isEditing, setIsEditing] = React.useState(false);
    const [startTime, setStartTime] = React.useState(item.objectData.startTime);
    const [endTime, setEndTime] = React.useState(item.objectData.endTime);
    const [notes, setNotes] = React.useState(item.objectData.notes);

    const activity = activities.find(a => a.objectId === item.objectData.activityId);
    
    if (!activity) {
      return null;
    }

    const handleSave = async () => {
      try {
        await trickleUpdateObject('plan_item', item.objectId, {
          ...item.objectData,
          startTime,
          endTime,
          notes
        });
        setIsEditing(false);
        onUpdate();
      } catch (error) {
        alert('Failed to update plan item');
      }
    };

    const handleDelete = async () => {
      if (confirm('Remove this activity from your plan?')) {
        try {
          await trickleDeleteObject('plan_item', item.objectId);
          onUpdate();
        } catch (error) {
          alert('Failed to remove activity');
        }
      }
    };

    return (
      <div className="border rounded-lg p-3 bg-gray-50" data-name="plan-item" data-file="components/PlanItem.js">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-sm">{activity.objectData.name}</h4>
          <div className="flex space-x-1">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-gray-400 hover:text-blue-500 text-xs"
            >
              <div className="icon-edit text-sm"></div>
            </button>
            <button
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-500 text-xs"
            >
              <div className="icon-trash-2 text-sm"></div>
            </button>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="text-xs px-2 py-1 border rounded"
              />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="text-xs px-2 py-1 border rounded"
              />
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes..."
              className="w-full text-xs px-2 py-1 border rounded resize-none"
              rows="2"
            />
            <div className="flex space-x-2">
              <button onClick={handleSave} className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                Save
              </button>
              <button onClick={() => setIsEditing(false)} className="text-xs bg-gray-300 px-2 py-1 rounded">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-xs text-gray-600 mb-1">
              {startTime} - {endTime}
            </div>
            {notes && (
              <div className="text-xs text-gray-500">{notes}</div>
            )}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('PlanItem component error:', error);
    return null;
  }
}