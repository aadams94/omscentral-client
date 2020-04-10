import { User } from 'firebase/app';
import { IUser } from '../../data/interfaces';

export const toInternal = (user: User): Partial<IUser> => {
  const [providerData] = user.providerData;

  const email = user.email || providerData!.email || null;

  const name =
    user.displayName ||
    providerData!.displayName ||
    (email && email.split('@').shift()) ||
    null;

  const photo_url = user.photoURL || providerData!.photoURL || null;

  return {
    id: user.uid,
    auth_provider: providerData!.providerId,
    email,
    name,
    photo_url,
    last_signed_in: new Date().getTime()
  };
};