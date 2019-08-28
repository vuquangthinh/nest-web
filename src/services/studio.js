import { objectAsFormData, removeIfNull } from '@/utils/utils';
import { privateRequest } from './auth';

// eslint-disable-next-line import/prefer-default-export
export const fetchDetail = ({ id }) =>
  privateRequest(`/stories/${id}/content`, {
    method: 'GET',
  });

export const uploadAsset = async ({ assetUrl, valuesDefault }) => {

  const newData = removeIfNull(valuesDefault);
  newData.name = assetUrl.name
  delete newData.dispatch;

  const result = await privateRequest(`/assets`, {
    method: 'POST',
    body: newData,
  });

  if (result.success) {
    const { id } = result.data;

    // if (preview) {
      const uploadResult = await privateRequest(`/assets/${id}/content`, {
        method: 'PATCH',
        body: objectAsFormData({
          // preview,
          assetUrl
        })
      });

      return uploadResult;
    // }
  }

  return result;
};

export const patchStory = async ({ id, ...data }) => {
  const result = await privateRequest(`/stories/${id}/content`, {
    method: 'PATCH',
    body: data,
  });
  return result;
};
