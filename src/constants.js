export const API_URL = (() => {
  if (localStorage.getItem('__APIURL__')) {
    return localStorage.getItem('__APIURL__');
  }

  return process.env.APP__API_URL || 'http://localhost:3200';
})();

if (localStorage.getItem('___DEBUG___')) {
  console.log('----------process.env--------');
  console.log(process.env);
  console.log('----------------------------');
}

export const EMPTY_OBJECT = {};

export const EMPTY_ARRAY = [];

export const STATUS_ACTIVE = 1;
export const DISPLAY_YES = 1;


export const InteractionType = {
  SWIPEUP: 1,
  VOTE: 2,
  POLL: 3,
  COMMENT: 4,
  DIRECTMESSAGE: 5,
};
