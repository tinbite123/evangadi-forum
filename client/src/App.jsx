import { createContext, useEffect, useContext, useReducer } from 'react'
import Footer from './components/Footer'
import Header from './components/Header'
import NotFound from './components/NotFound'
import Ask from './pages/Ask'
import Dashboard from './pages/Dashboard'
import HomePage from './pages/HomePage'
import PostAnswer from './pages/PostAnswer'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './pages/ProtectedRoute'
import { reducer } from './context/reducer'
import Loading from './components/Loading'
import { useNavigate } from 'react-router-dom'

import axios from './axios'

const AppProvider = createContext();
export const useAppData = () => useContext(AppProvider);

function App() {
    const initialState = {
        user: "",
        loading: false,
        alert: "",
    }

    const [state, dispatch] = useReducer(reducer, initialState)
    const navigate = useNavigate();

    const checkUser = async () => {
        const token = localStorage.getItem("token");
        dispatch({ type: "LOADING" })
        try {
            const { data } = await axios.get("/users/check", {
                headers: {
                    Authorization: "Bearer " + token
                },
            })
            dispatch({ type: "SET_USER", payload: data.username })
        } catch ({ response }) {
            console.log(response)
            localStorage.setItem("token", "")
            dispatch({ type: "LOGOUT" })
            navigate('/')
        }
    };

    useEffect(() => {
        if (!state.user) {
            checkUser()
        }
    }, [state.user]);

    return (
            <AppProvider.Provider value={{ state, dispatch }}>
                <Header />
                {state.loading ? (
                    <Loading />
                ) : (
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route 
                        path="/home"
                        element={
                            <ProtectedRoute>
                                <HomePage />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/ask"
                        element={
                            <ProtectedRoute>
                                <Ask />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/post-answer"
                        element={
                            <ProtectedRoute>
                                <PostAnswer />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/question/:id"
                        element={
                            <ProtectedRoute>
                                <PostAnswer />
                            </ProtectedRoute>
                        } 
                    />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            )}
            <Footer />
            </AppProvider.Provider>
    )
}

export default App
