/* eslint-disable import/prefer-default-export */
import { formatMessage } from 'umi/locale';
import memoizeOne from 'memoize-one';

// Conversion router to menu.
function formatter(data, parentAuthority, parentName) {
  return data
    .map(item => {
      if (!item.name || !item.path) {
        return null;
      }

      const locale = parentName ? `${parentName}.${item.name}` : `menu.${item.name}`;

      const result = {
        ...item,
        name: formatMessage({ id: locale, defaultMessage: item.name }),
        locale,
        authority: item.authority || parentAuthority,
      };

      if (item.routes) {
        const children = formatter(item.routes, item.authority, locale);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter); // , isEqual);


export { memoizeOneFormatter };
