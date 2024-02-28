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
  chat: any;
}

const WorkPage: React.FC<WorkPageProps> = (props: WorkPageProps) => {

  const {
    dispatch,
    collapsed,
    frameSize,
    height,
    width,
    chat: {
      currentTask,
      chatList,
      lastContent
    },
  } = props;

  const [inputHeight, setInputHeight] = React.useState(0);
  const [loading, setLoading] = React.useState<boolean>(false);

  const langWidth = frameSize.width - (collapsed ? 0 : 260) - 175;

  const sendQuestion = (question: string) => {
    if (loading) {
      return;
    }
    setLoading(true);

    dispatch({
      type: 'chat/sendChatMessage',
      payload: {
        taskId: 'temp-123',
        content: question
      },
      callback: (chatId: string) => {
        // fetch response
        dispatch({
          type: 'chat/fetchChatResponse',
          payload: {
            taskId: 'temp-123',
            chatId
          },
          callback: (response: any) => {

            if (response === '<OPEN>') {
              setLoading(true);
              return;
            }

            if (response === '<END>' || response === '<ERROR>') {
              // 结束对话，将最后一次的回答保存到chatList
              dispatch({
                type: 'chat/copyLastResponse',
                payload: chatId,
                callback: () => {
                  // 清空最后一次的回答
                  dispatch({
                    type: 'chat/clearLastContent'
                  });
                  setLoading(false);
                }
              });
              return;
            }

            dispatch({
              type: 'chat/saveLastContent',
              payload: response
            });
          }
        });
      }
    });
  }

  return (
    <div className={styles.container} style={{ width, height }}>
      <ChatView
        height={frameSize.height - inputHeight - 85}
        width={langWidth}
        chatList={chatList}
        lastResponse={lastContent}
      />
      <div className={styles.input}>
        <ChatInput
          width={langWidth}
          onHeightChange={h => setInputHeight(h)}
          onSend={(text: string) => sendQuestion(text)}
          finished={!loading}
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