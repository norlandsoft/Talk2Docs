import { POST, SSE } from '@/utils/HttpRequest';
import { randomString } from "@/utils/StringUtils";

export default {
  namespace: 'chat',
  state: {
    currentTask: null,
    // 对话列表
    chatList: [],
    lastContent: '',
  },

  effects: {
    * sendChatMessage({ payload, callback }, { _, put }) {
      // 保存问题
      yield put({
        type: 'saveChatMessage',
        payload: {
          id: randomString(8),
          type: 'q',
          content: payload.content
        }
      });
      // 发送问题
      const resp = yield POST('/rest/v1/chat/completions', payload);
      if (resp.success) {
        callback(resp.data);
      } else {
        // 保存错误信息
        yield put({
          type: 'saveChatMessage',
          payload: {
            id: randomString(8),
            type: 'a',
            content: '```Error \n 服务器故障，请稍后再试\n ```'
          }
        });
      }
    },

    * fetchChatResponse({ payload, callback }, _: any) {
      yield SSE('/rest/v1/chat/fetch', payload, callback);
    },

    * copyLastResponse({ payload, callback }: any, { put }: any) {
      yield put({
        type: 'copyLastContent',
        payload: payload
      });

      if (callback) {
        callback();
      }
    },
  },
  reducers: {
    saveChatMessage(state: any, { payload }: any) {
      return {
        ...state,
        chatList: [...state.chatList, payload]
      }
    },
    saveLastContent(state: any, { payload }: any) {
      return {
        ...state,
        lastContent: state.lastContent + payload
      }
    },
    copyLastContent(state: any, { payload }: any) {
      const resp = {
        id: payload,
        type: 'a',
        content: state.lastContent
      }
      return {
        ...state,
        chatList: [...state.chatList, resp]
      }
    },
    clearLastContent(state: any, _: any) {
      return {
        ...state,
        lastContent: ''
      }
    },
  }
}