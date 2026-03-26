import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ThemeSelection from './pages/ThemeSelection'
import CareerSelect from './pages/CareerSelect'
import SetupCareer from './pages/SetupCareer'
import Dashboard from './pages/Dashboard'
import Roadmap from './pages/Roadmap'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Account from './pages/Account'
import TodoPage from './pages/TodoPage'
import AppLayout from './components/Layout/AppLayout'

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<Login />} />

                {/* Onboarding Routes (Protected logic later) */}
                <Route path="/theme-selection" element={<ThemeSelection />} />
                <Route path="/career-select" element={<CareerSelect />} />
                <Route path="/setup-career" element={<SetupCareer />} />

                {/* Protected Application Routes */}
                <Route element={<AppLayout />}>
// ... (updated import needed but imports are at top)
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/career-map" element={<Roadmap />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/todos" element={<TodoPage />} />
                    {/* Add other protected routes here later */}
                </Route>
            </Routes>
        </Router>
    )
}

export default App
