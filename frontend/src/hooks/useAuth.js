import { useState, useEffect } from 'react';
import { getUserFromToken, isLoggedIn } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn()) {
            navigate('/login');
        } else {
            const userData = getUserFromToken();
            setUser(userData);
        }
    }, [navigate]);

    return { user };
}
