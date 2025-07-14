class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">We're sorry, but something unexpected happened.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  try {
    const [currentView, setCurrentView] = React.useState('discover');
    const [currentUser, setCurrentUser] = React.useState(null);
    const [activities, setActivities] = React.useState([]);
    const [plans, setPlans] = React.useState([]);
    const [wishlist, setWishlist] = React.useState([]);
    const [selectedPlan, setSelectedPlan] = React.useState(null);

    React.useEffect(() => {
      loadActivities();
      const user = getCurrentUser();
      if (user) {
        setCurrentUser(user);
        loadUserPlans(user.id);
        loadUserWishlist(user.id);
      }
    }, []);

    const loadActivities = async () => {
      try {
        const result = await trickleListObjects('activity', 20, true);
        setActivities(result.items || []);
      } catch (error) {
        console.error('Failed to load activities:', error);
      }
    };

    const loadUserPlans = async (userId) => {
      try {
        const result = await trickleListObjects(`plan:${userId}`, 10, true);
        setPlans(result.items || []);
      } catch (error) {
        console.error('Failed to load plans:', error);
      }
    };

    const loadUserWishlist = async (userId) => {
      try {
        const result = await trickleListObjects(`wishlist:${userId}`, 50, true);
        setWishlist(result.items || []);
      } catch (error) {
        console.error('Failed to load wishlist:', error);
      }
    };

    const handleLogin = (user) => {
      setCurrentUser(user);
      loadUserPlans(user.id);
      loadUserWishlist(user.id);
    };

    const handleLogout = () => {
      logout();
      setCurrentUser(null);
      setPlans([]);
      setWishlist([]);
      setSelectedPlan(null);
    };

    return (
      <div className="min-h-screen bg-gray-50" data-name="app" data-file="app.js">
        <Header 
          currentUser={currentUser}
          onLogin={handleLogin}
          onLogout={handleLogout}
          currentView={currentView}
          onViewChange={setCurrentView}
        />
        
        <main className="max-w-7xl mx-auto px-4 py-8">
          {currentView === 'discover' && (
            <ActivitySearch 
              activities={activities}
              currentUser={currentUser}
              wishlist={wishlist}
              onAddToWishlist={loadUserWishlist}
            />
          )}
          
          {currentView === 'plans' && (
            <PlanBuilder 
              currentUser={currentUser}
              plans={plans}
              activities={activities}
              wishlist={wishlist}
              selectedPlan={selectedPlan}
              onPlanSelect={setSelectedPlan}
              onPlanUpdate={loadUserPlans}
            />
          )}
          
          {currentView === 'wishlist' && (
            <Wishlist 
              currentUser={currentUser}
              wishlist={wishlist}
              activities={activities}
              onWishlistUpdate={loadUserWishlist}
            />
          )}
        </main>
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);