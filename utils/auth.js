// Simple authentication utilities using localStorage
let currentUser = null;

function generateUserId() {
  return 'user_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

async function login(email) {
  try {
    // Check if user exists in database
    const users = await trickleListObjects('user', 100, true);
    const existingUser = users.items.find(user => user.objectData.email === email);
    
    if (existingUser) {
      currentUser = {
        id: existingUser.objectId,
        email: existingUser.objectData.email,
        name: existingUser.objectData.name
      };
      localStorage.setItem('weekendflow_user', JSON.stringify(currentUser));
      return currentUser;
    } else {
      throw new Error('User not found. Please sign up first.');
    }
  } catch (error) {
    throw error;
  }
}

async function signup(email, name) {
  try {
    // Check if user already exists
    const users = await trickleListObjects('user', 100, true);
    const existingUser = users.items.find(user => user.objectData.email === email);
    
    if (existingUser) {
      throw new Error('User already exists. Please sign in instead.');
    }

    // Create new user
    const newUser = await trickleCreateObject('user', {
      email: email,
      name: name,
      preferences: [],
      location: ''
    });

    currentUser = {
      id: newUser.objectId,
      email: newUser.objectData.email,
      name: newUser.objectData.name
    };
    
    localStorage.setItem('weekendflow_user', JSON.stringify(currentUser));
    return currentUser;
  } catch (error) {
    throw error;
  }
}

function logout() {
  currentUser = null;
  localStorage.removeItem('weekendflow_user');
}

function getCurrentUser() {
  if (currentUser) {
    return currentUser;
  }
  
  const stored = localStorage.getItem('weekendflow_user');
  if (stored) {
    currentUser = JSON.parse(stored);
    return currentUser;
  }
  
  return null;
}