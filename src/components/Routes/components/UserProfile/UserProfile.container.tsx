import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from '@apollo/react-hooks';
import { IUser } from '../../../../data/interfaces';
import { GET_USER } from '../../../../data/queries';
import { AuthContext } from '../../../Auth';
import UserProfile from './UserProfile';

const UserProfileContainer: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { data } = useQuery<{ user: IUser }>(GET_USER, {
    variables: {
      id: user!.uid,
    },
    fetchPolicy: 'no-cache',
  });

  return (
    <>
      <Helmet title="My Profile">
        <meta name="description" content="User profile settings." />
      </Helmet>
      <UserProfile user={data?.user} />
    </>
  );
};

export default UserProfileContainer;
