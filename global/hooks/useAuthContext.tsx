import React, { createContext, useState } from 'react';
import { useRouter } from 'next/router';

import { EGO_JWT_KEY } from '../utils/constants';
import { decodeToken, extractUser, isValidJwt } from '../utils/egoTokenUtils';
import { UserWithId } from '../../global/types';
import getInternalLink from '../utils/getInternalLink';

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
  // TODO: typing this state as `string` causes a compiler error. the same setup exists in argo but does not cause
  // a type issue. using `any` for now
  const [token, setTokenState] = useState<any>(egoJwt);

  const removeToken = () => {
    localStorage.removeItem(EGO_JWT_KEY);
    setTokenState(null);
  };

  const logout = () => {
    removeToken();
    router.push(getInternalLink({ path: 'repository' }));
  };

  if (token !== egoJwt) {
    setTokenState(egoJwt);
  }

  if (token && !isValidJwt(token)) {
    logout();
  }

  const fetchWithAuth: T_AuthContext['fetchWithAuth'] = (url, options) => {
    return fetch(url, {
      ...options,
      headers: { ...options?.headers, accept: '*/*', Authorization: `Bearer ${token || ''}` },
      body: null,
    });
  };

  const userInfo = token ? decodeToken(token) : null;
  const user = userInfo ? extractUser(userInfo) : undefined;
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
