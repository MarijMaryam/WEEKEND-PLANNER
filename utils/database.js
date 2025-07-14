// Database utility functions for common operations

async function createPlanWithItems(userId, planData, activities) {
  try {
    // Create the plan
    const plan = await trickleCreateObject(`plan:${userId}`, planData);
    
    // Add activities to the plan if provided
    if (activities && activities.length > 0) {
      for (let i = 0; i < activities.length; i++) {
        const activity = activities[i];
        await trickleCreateObject(`plan_item:${plan.objectId}`, {
          planId: plan.objectId,
          activityId: activity.activityId,
          day: activity.day || 'saturday',
          startTime: activity.startTime || '10:00',
          endTime: activity.endTime || '12:00',
          notes: activity.notes || '',
          order: i
        });
      }
    }
    
    return plan;
  } catch (error) {
    throw error;
  }
}

async function duplicatePlan(originalPlan, userId, newTitle) {
  try {
    // Create new plan
    const newPlan = await trickleCreateObject(`plan:${userId}`, {
      ...originalPlan.objectData,
      title: newTitle,
      ownerId: userId,
      collaborators: [],
      shareLink: ''
    });

    // Copy all plan items
    const planItems = await trickleListObjects(`plan_item:${originalPlan.objectId}`, 100, false);
    
    for (const item of planItems.items) {
      await trickleCreateObject(`plan_item:${newPlan.objectId}`, {
        ...item.objectData,
        planId: newPlan.objectId
      });
    }

    return newPlan;
  } catch (error) {
    throw error;
  }
}

async function getActivityById(activityId) {
  try {
    return await trickleGetObject('activity', activityId);
  } catch (error) {
    return null;
  }
}

async function searchActivities(query, category = '', limit = 20) {
  try {
    const result = await trickleListObjects('activity', limit, true);
    let filtered = result.items;

    if (query) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(activity =>
        activity.objectData.name.toLowerCase().includes(searchTerm) ||
        activity.objectData.description.toLowerCase().includes(searchTerm) ||
        activity.objectData.location.toLowerCase().includes(searchTerm) ||
        (activity.objectData.tags && activity.objectData.tags.toLowerCase().includes(searchTerm))
      );
    }

    if (category) {
      filtered = filtered.filter(activity => 
        activity.objectData.category === category
      );
    }

    return {
      items: filtered,
      nextPageToken: result.nextPageToken
    };
  } catch (error) {
    throw error;
  }
}