import { useRecoilValue, useRecoilState } from 'recoil';
import { AuthState } from './AuthState';

export const useAuth = () => {
    const [, setAuthState] = useRecoilState(AuthState);
    const authStateValue = useRecoilValue(AuthState);

    const loginAuth = (user) => {
        setAuthState({
            isAuthenticated: true,
            uid: user.uid,
            name: user.name,
            userDetailsId: user.userDetailsId,
        });
    };

    const logoutAuth = () => {
        setAuthState({
            isAuthenticated: false,
            uid: null,
            name: null,
            userDetailsId: null,
        });
    };

    const isAuthenticated = authStateValue.isAuthenticated;

    return { isAuthenticated, authStateValue, loginAuth, logoutAuth };
};
