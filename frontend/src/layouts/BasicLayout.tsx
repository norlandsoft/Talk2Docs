import React, {useEffect} from 'react';
import { connect, Outlet } from 'umi';

import '../global.less';

const BasicLayout: React.FC = (props: any) => {

  const {
    dispatch,
  } = props;

  const handleWindowResize = () => {
    dispatch({
      type: 'global/changeFrameSize'
    });
  }

  useEffect(() => {
    handleWindowResize();

    // 监听窗口尺寸变化事件
    window.addEventListener('resize', handleWindowResize);

    return () => {
      // 移除监听
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return <Outlet />;
}

export default connect(({global}) => ({
  global
}))(BasicLayout);