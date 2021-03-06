import React, { useContext } from 'react';

import {
  useProgramsQuery,
  useSpecializationsQuery,
  useUpdateUserMutation,
  UserQuery,
  UserInputType,
} from 'src/graphql';
import { AuthContext } from '../Auth';
import { NotificationContext } from '../Notification';
import UserForm from './UserForm';

interface Props {
  user: UserQuery['user'];
}

const UserFormContainer: React.FC<Props> = ({ user }) => {
  const notification = useContext(NotificationContext)!;
  const auth = useContext(AuthContext);
  const mode = auth.user?.uid === user.id ? 'edit' : 'view';

  const [programs, specializations] = [
    useProgramsQuery(),
    useSpecializationsQuery(),
  ];

  const [update, { loading }] = useUpdateUserMutation();

  const handleSubmit = async (user: UserInputType) => {
    try {
      await update({ variables: { user } });
      notification.success('User updated.');
    } catch {
      notification.error('Something went wrong.');
    }
  };

  if (!programs.data?.programs || !specializations.data?.specializations) {
    return null;
  }

  return (
    <UserForm
      data={{ ...programs.data, ...specializations.data }}
      mode={mode}
      user={user}
      disabled={loading}
      onSubmit={handleSubmit}
    />
  );
};

export default UserFormContainer;
