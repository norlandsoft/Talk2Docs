import React from 'react';
import {connect} from 'umi';
import {Button} from 'antd';

interface WorkPageProps {
  dispatch: any;
  height: number;
  width: number;
}

const WorkPage: React.FC<WorkPageProps> = (props: WorkPageProps) => {

  const {
    dispatch,
    height,
    width,
  } = props;

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
    <div style={{width, height}}>
      <Button onClick={handleChat}>Send</Button>
    </div>
  );
}

export default connect(({chat}) => ({
  chat
}))(WorkPage);