import qs from 'qs';
import { privateRequest } from "./auth";

// eslint-disable-next-line import/prefer-default-export
export const selection = ({ search }) => privateRequest(`/currencies?${qs.stringify({
  filter: {
    q: search,
    limit: 10
  },
})}`);
