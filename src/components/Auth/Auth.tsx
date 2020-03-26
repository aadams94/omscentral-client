import React, { createContext, useState, useContext, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { User } from 'firebase/app';
import { FirebaseContext } from '../Firebase';
import { Nullable } from '../../core';
import { IUser } from '../../data/interfaces';
import { INSERT_USER } from '../../data/queries';
import { toInternal } from './Auth.utils';
import apollo from '../../data/apollo';

interface IState {
  initializing: boolean;
  authenticated: boolean;
  user: Nullable<User>;
}

const initialState: IState = {
  initializing: true,
  authenticated: false,
  user: null
};

export const AuthContext = createContext<IState>(initialState);

const Auth: React.FC = ({ children }) => {
  const firebase = useContext(FirebaseContext);
  const [state, setState] = useState<IState>(initialState);
  const [insertUser] = useMutation<{ insertUser: IUser }>(INSERT_USER);

  useEffect(() => {
    firebase.auth.onAuthStateChanged(async user => {
      apollo.resetStore();

      setState({
        initializing: false,
        authenticated: Boolean(user),
        user
      });

      if (!user) {
        localStorage.setItem('token', '');
        return;
      }

      localStorage.setItem('token', await user.getIdToken());

      const result = await insertUser({
        variables: {
          user: toInternal(user)
        }
      });

      if (result.errors && result.errors.length) {
        await firebase.auth.signOut();
        return;
      }

      const u = result.data!.insertUser;
      firebase.analytics.setUserId(u.id, { global: true });
      firebase.analytics.setUserProperties({ email: u.email });
      firebase.analytics.logEvent('login', { method: u.auth_provider });
      if (!u.updated) {
        firebase.analytics.logEvent('sign_up', { method: u.auth_provider });
      }
    });
  }, [firebase, insertUser]);

  return (
    <AuthContext.Provider value={{ ...state }}>{children}</AuthContext.Provider>
  );
};

export default Auth;
