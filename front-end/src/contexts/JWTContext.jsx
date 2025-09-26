import PropTypes from 'prop-types';
import React, { createContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { LOGIN, LOGOUT, SET_MENU_ITEMS } from 'store/actions';
import navigation from 'menu-items';

// API
import { api } from 'services/api';

const verifyToken = (token) => {
    if (!token) return false;
    try {
        const decoded = jwtDecode(token);
        return decoded.exp > Date.now() / 1000;
    } catch (e) {
        return false;
    }
};

const setSession = (token) => {
    if (token) {
        localStorage.setItem('token', token);
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
        localStorage.removeItem('token');
        delete api.defaults.headers.common.Authorization;
    }
};

const JWTContext = createContext(null);
export const JWTProvider = ({ children }) => {
    // O componente usa useDispatch e useSelector para interagir com o Redux
    const dispatch = useDispatch();
    const { isLoggedIn, isInitialized, user } = useSelector((state) => state.account);

    useEffect(() => {
        const init = async () => {
            console.log('Initializing session...');
            try {
                const token = localStorage.getItem('token');
                console.log('Token found:', token);

                if (token && verifyToken(token)) {
                    console.log('Token is valid, setting session.');
                    setSession(token);
                    const response = await api.get('/api/auth/me');
                    console.log('API response:', response);

                    const apiUser = response.data.user || response.data;
                    console.log('API user data:', apiUser);

                    if (!apiUser || typeof apiUser !== 'object' || !apiUser.usuario_id) {
                        console.error('Failed to initialize session: Invalid user data received from /api/auth/me', response.data);
                        dispatch({ type: LOGOUT });
                        return;
                    }

                    console.log('User data is valid, logging in.');
                    dispatch({ type: LOGIN, payload: { user: apiUser } });
                    dispatch({ type: SET_MENU_ITEMS, items: navigation.items });
                } else {
                    console.log('Token not found or invalid, logging out.');
                    dispatch({ type: LOGOUT });
                }
            } catch (error) {
                console.error('Error during init:', error);
                dispatch({ type: LOGOUT });
            }
        };
        init();
    }, [dispatch]); // Dependência do useEffect

    const login = async (email, senha) => {
        try {
            const response = await api.post('/api/auth/login', { email, senha });
            const { token, user: apiUser } = response.data || {};

            if (!token || !apiUser) {
                console.error('Login failed: Invalid response from server.', response.data);
                throw new Error('Não foi possível fazer login. Resposta inválida do servidor.');
            }

            setSession(token);
            dispatch({ type: LOGIN, payload: { user: apiUser } });
            dispatch({ type: SET_MENU_ITEMS, items: navigation.items });
        } catch (error) {
            // Log do erro completo para facilitar a depuração no console do navegador
            console.error('Login failed:', error.response || error);

            let errorMessage = 'Ocorreu um erro inesperado.';
            if (error.response && error.response.data) {
                // Handles { message: '...' } or a plain string response
                errorMessage = error.response.data.message || (typeof error.response.data === 'string' ? error.response.data : errorMessage);
            } else if (error.message) {
                // Catches network errors or TypeErrors from the try block
                errorMessage = error.message;
            }

            throw new Error(errorMessage);
        }
    };
    
    const logout = () => {
        setSession(null);
        dispatch({ type: LOGOUT });
        dispatch({ type: SET_MENU_ITEMS, items: [] });
    };
    
    // O valor do provider vem diretamente do estado do Redux
    return (
        <JWTContext.Provider value={{ isLoggedIn, isInitialized, user, login, logout }}>
            {children}
        </JWTContext.Provider>
    );
};

JWTProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default JWTContext;