
import { privateRequest } from './auth';

import { objectAsFormData } from '@/utils/utils';

export const users = () => privateRequest('/users');

export const queryCurrent = () => privateRequest('/profile');

export const updateUser = profile => privateRequest('/profile', { method: 'POST', body: profile });

export const uploadAvatar = avatar =>
  privateRequest('/profile/avatar', { method: 'POST', body: objectAsFormData({ avatar }) });

export const changePassword = ({ currentPassword, newPassword }) =>
  privateRequest('/auth/basic/password', {
    method: 'POST',
    body: {
      currentPassword,
      newPassword,
    },
  });
