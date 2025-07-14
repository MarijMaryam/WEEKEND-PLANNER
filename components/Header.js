function Header({ currentUser, onLogin, onLogout, currentView, onViewChange }) {
  try {
    const [showAuthModal, setShowAuthModal] = React.useState(false);
    const [authMode, setAuthMode] = React.useState('login');
    const [email, setEmail] = React.useState('');
    const [name, setName] = React.useState('');

    const handleAuth = async (e) => {
      e.preventDefault();
      try {
        if (authMode === 'login') {
          const user = await login(email);
          onLogin(user);
        } else {
          const user = await signup(email, name);
          onLogin(user);
        }
        setShowAuthModal(false);
        setEmail('');
        setName('');
      } catch (error) {
        alert('Authentication failed. Please try again.');
      }
    };

    return (
      <header className="bg-white shadow-sm border-b" data-name="header" data-file="components/Header.js">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-blue-600">WeekendFlow</h1>
              
              <nav className="flex space-x-6">
                <button
                  onClick={() => onViewChange('discover')}
                  className={`font-medium ${currentView === 'discover' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <div className="icon-search text-lg mr-2 inline-block"></div>
                  Discover
                </button>
                <button
                  onClick={() => onViewChange('plans')}
                  className={`font-medium ${currentView === 'plans' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <div className="icon-calendar text-lg mr-2 inline-block"></div>
                  My Plans
                </button>
                <button
                  onClick={() => onViewChange('wishlist')}
                  className={`font-medium ${currentView === 'wishlist' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <div className="icon-heart text-lg mr-2 inline-block"></div>
                  Wishlist
                </button>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              {currentUser ? (
                <div className="flex items-center space-x-3">
                  <span className="text-gray-700">Hello, {currentUser.name}</span>
                  <button onClick={onLogout} className="btn-secondary">
                    <div className="icon-log-out text-sm mr-1 inline-block"></div>
                    Logout
                  </button>
                </div>
              ) : (
                <button onClick={() => setShowAuthModal(true)} className="btn-primary">
                  <div className="icon-user text-sm mr-1 inline-block"></div>
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>

        {showAuthModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">{authMode === 'login' ? 'Sign In' : 'Sign Up'}</h2>
              
              <form onSubmit={handleAuth} className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
                
                {authMode === 'signup' && (
                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                )}
                
                <div className="flex space-x-3">
                  <button type="submit" className="btn-primary flex-1">
                    {authMode === 'login' ? 'Sign In' : 'Sign Up'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowAuthModal(false)} 
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
              
              <p className="text-center mt-4 text-sm text-gray-600">
                {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                  className="text-blue-600 hover:underline"
                >
                  {authMode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        )}
      </header>
    );
  } catch (error) {
    console.error('Header component error:', error);
    return null;
  }
}