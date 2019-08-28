
import { privateRequest } from './auth';

import { objectAsFormData } from '@/utils/utils';

export const users = () => privateRequest('/users');

export const queryCurrent = () => privateRequest('/users/me');

export const updateUser = profile => privateRequest('/users/me', { method: 'POST', body: profile });

export const uploadAvatar = avatar =>
  privateRequest('/users/me/avatar', { method: 'POST', body: objectAsFormData({ avatar }) });

export const changePassword = ({ old_password, new_password }) =>
  privateRequest('/auth/basic/change-password', {
    method: 'POST',
    body: {
      currentPassword: old_password,
      newPassword: new_password,
    },
  });
