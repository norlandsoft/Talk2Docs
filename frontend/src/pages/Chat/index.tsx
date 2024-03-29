import React from "react";
import { connect } from "umi";
import { FloatButton } from 'antd';
import { FileDoneOutlined, PaperClipOutlined, SettingOutlined } from '@ant-design/icons';
import Icon from "@/components/Icons";
import WorkPage from "./WorkPage";
import styles from './index.less';

import ChatHistory from "./components/ChatHistory";


const Chat: React.FC = (props: any) => {

  const {
    dispatch,
    collapsed,
    frameSize,
  } = props;

  const taskWidth = collapsed ? 0 : 260;

  const handleToggleSidebar = () => {
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: !collapsed,
    });
  }

  return (
    <div className={styles.container} style={{ height: frameSize.height, width: frameSize.width }}>
      <div className={styles.task} style={{ width: taskWidth }}>
        <div className={styles.title}>
          Talk<span>2</span>Documents
        </div>
        <div style={{ height: frameSize.height - 50 }}>
          <ChatHistory />
        </div>
      </div>
      <div className={styles.toggle} style={{ top: frameSize.height / 2, left: collapsed ? 0 : taskWidth }} onClick={handleToggleSidebar}>
        <div className={styles.toggleInner}>
          {
            collapsed ? <Icon name='toggle-open' size={12} thickness={3} /> : <Icon name='toggle-close' size={12} thickness={3} />
          }
        </div>
      </div>
      <div className={styles.work} style={{ height: frameSize.height, width: frameSize.width - taskWidth }}>
        <WorkPage height={frameSize.height} width={frameSize.width - taskWidth} />
      </div>
      <FloatButton.Group shape="square" style={{ bottom: '220px' }}>
        <FloatButton
          icon={<SettingOutlined />}
        />
        <FloatButton
          icon={<FileDoneOutlined />}
        />
        <FloatButton
          icon={<PaperClipOutlined />}
        />
      </FloatButton.Group>
    </div>
  );
}

export default connect(({ global }) => ({
  collapsed: global.collapsed,
  frameSize: global.frameSize,
}))(Chat);