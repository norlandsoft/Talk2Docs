export default {
  namespace: 'global',
  state: {
    collapsed: false,
    frameSize: {
      width: 0,
      height: 0
    },
  },
  effects: {},
  reducers: {
    changeLayoutCollapsed(state: any, { payload }: any) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    changeFrameSize(state: any, _: any) {

      const frameWidth = window.innerWidth;
      const frameHeight = window.innerHeight;

      return {
        ...state,
        frameSize: {
          width: frameWidth,
          height: frameHeight
        }
      }
    },
  }
}