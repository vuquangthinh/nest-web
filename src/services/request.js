import { DEBUG } from '@/constants';
import request from '@/utils/request';

export const createResult = ({ success, data, code = 200, ...rest }, _d = undefined) => ({
  success,
  data,
  code,
  ...rest,
  ...(DEBUG ? { _d } : undefined),
});

export async function invokeRequest(method, path, params, headers) {
  const options = {
    headers,
  };

  const result = await request(path, {
    ...options,
    method: 'POST',
    body: params,
  });

  return createResult(result);
}
