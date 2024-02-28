import React from "react";
import { connect } from "umi";
import Icons from "@/components/Icons";

import styles from './ChatHistory.less';

const ChatHistory: React.FC = (props: any) => {

  const {
    frameSize,
  } = props;

  return (
    <div className={styles.container}>
      <div className={styles.button}>
        <Icons name='add' size={20} color='#fff' /> 新建任务
      </div>

      <div className={styles.menu} style={{ height: frameSize.height - 98 }}>
        {
          [1, 2].map((item, index) => (
            <div key={index} className={styles.item}>
              <span>任务描述</span>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default connect(({ global }) => ({
  frameSize: global.frameSize,
}))(ChatHistory);