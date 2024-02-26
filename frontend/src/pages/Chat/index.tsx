import React from "react";
import { connect } from "umi";
import { FloatButton } from 'antd';
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
    <div className={styles.container} style={{height: frameSize.height, width: frameSize.width}}>
      <div className={styles.task} style={{width: taskWidth}}>
        <div className={styles.title}>Talk2Documents</div>
        <div style={{height: frameSize.height - 90}}>
          <ChatHistory />
        </div>
        <div className={styles.foot}>
          <div className={styles.options}>
            <div style={{display: 'flex'}}>
              <Icon name='setting' size={20}/>
            </div>
            <div style={{display: 'flex'}}>
              <Icon name='knowledge' size={18}/>
            </div>
          </div>
          <div className={styles.toggle} onClick={handleToggleSidebar}>
            <Icon name='toggle_close' size={14} color='#1C274C'/>
          </div>
        </div>
      </div>
      <div className={styles.work} style={{height: frameSize.height, width: frameSize.width - taskWidth}}>
        <WorkPage height={frameSize.height} width={frameSize.width - taskWidth}/>
      </div>
      {
        collapsed ? (
          <FloatButton onClick={handleToggleSidebar}
            shape="square"
            icon={<Icon name='toggle_open' size={14} color='#1C274C'/>}
            style={{position: 'fixed', bottom: 0, left: 0, boxShadow: 'none'}}
          />
        ) : null
      }
    </div>
  );
}

export default connect(({global}) => ({
  collapsed: global.collapsed,
  frameSize: global.frameSize,
}))(Chat);