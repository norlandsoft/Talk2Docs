import React from 'react';
import { connect } from 'umi';
import ChatInput from '@/components/ChatInput';
import ChatView from '@/components/ChatView';
import styles from './WorkPage.less';

interface WorkPageProps {
  dispatch: any;
  collapsed: boolean;
  frameSize: any;
  height: number;
  width: number;
}

const WorkPage: React.FC<WorkPageProps> = (props: WorkPageProps) => {

  const {
    dispatch,
    collapsed,
    frameSize,
    height,
    width,
  } = props;

  const [inputHeight, setInputHeight] = React.useState(0);
  const langWidth = frameSize.width - (collapsed ? 0 : 260) - 175;

  const handleChat = () => {
    dispatch({
      type: 'chat/sendChatMessage',
      payload: {
        content: 'JSON格式有什么优势？'
      },
      callback: resp => {
        if (resp.success) {
          dispatch({
            type: 'chat/fetchChatResponse',
            payload: {
              taskId: 'temp-123',
              chatId: resp.data
            },
            callback: response => {
              console.log(response);
            }
          });
        }
      }
    });
  }

  return (
    <div className={styles.container} style={{ width, height }}>
      <ChatView
        height={frameSize.height - inputHeight - 85}
        width={langWidth}
        chatList={[]}
        lastResponse='JSON格式有什么优势？'
      />
      <div className={styles.input}>
        <ChatInput
          width={langWidth}
          onHeightChange={h => setInputHeight(h)}
          onSend={() => console.log('ok')}
        />
      </div>
    </div>
  );
}

export default connect(({ global, chat }) => ({
  collapsed: global.collapsed,
  frameSize: global.frameSize,
  chat
}))(WorkPage);