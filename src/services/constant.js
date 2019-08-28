import { privateRequest } from './auth';

// eslint-disable-next-line import/prefer-default-export
export const queryAll = () => privateRequest('/constants');

