
import { queryAll, create, remove, update, queryOne } from '@/services/interaction';

import build from '@/utils/model-build';

export default build(
  'interaction',
  {
    listUrls: ['/interactions'],
    queryAll,
    queryOne,
    create,
    remove,
    update
  }
);
