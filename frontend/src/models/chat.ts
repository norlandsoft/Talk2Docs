import {POST, SSE} from '@/utils/HttpRequest';

export default {
  namespace: 'chat',
  state: {
    chatList: [],
    chatInput: '',
  },
  
  effects: {
    * sendChatMessage({payload, callback}, _: any) {
      const resp = yield POST('/rest/v1/chat/completions', payload);
      if (callback) callback(resp);
    },

    * fetchChatResponse({payload, callback}, _: any) {
      yield SSE('/rest/v1/chat/fetch', payload, callback);
    },
  },
  reducers: {
  }
}