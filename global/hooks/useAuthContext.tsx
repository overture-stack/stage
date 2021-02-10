import React, { createContext, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

import { EGO_JWT_KEY } from '../utils/constants';
import { decodeToken, extractUser, getPermissionsFromToken } from '../utils/egoTokenUtils';
import { UserWithId } from '../../global/types';

type T_AuthContext = {
  token?: string;
  logout: () => void;
  user?: UserWithId;
  fetchWithAuth: typeof fetch;
};

const AuthContext = createContext<T_AuthContext>({
  token: undefined,
  logout: () => {},
  user: undefined,
  fetchWithAuth: fetch,
});

export const AuthProvider = ({
  egoJwt,
  children,
}: {
  egoJwt?: string;
  children: React.ReactElement;
}) => {
  const router = useRouter();
  const [token, setTokenState] = useState(egoJwt);

  const removeToken = () => {
    Cookies.remove(EGO_JWT_KEY);
    setTokenState(undefined);
  };

  const logout = () => {
    removeToken();
    router.push('/login');
  };

  if (token !== egoJwt) {
    setTokenState(egoJwt);
  }

  const fetchWithAuth = (url: string, options: any) => {
    return fetch(url, {
      ...options,
      headers: { ...options.headers, accept: '*/*', Authorization: `Bearer ${token || ''}` },
      body: null,
    });
  };

  const userInfo = token ? decodeToken(token) : null;
  // ts error on userInfo from type discrepancy between dms and ego-token-utils user.preferredLanguage
  // dms will need to use token-utils version updated for ego 4.x.x
  const user = userInfo ? extractUser(userInfo) : {};
  const authData = {
    token,
    logout,
    user,
    fetchWithAuth,
  };

  return <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>;
};

export default function useAuthContext() {
  return React.useContext(AuthContext);
}
