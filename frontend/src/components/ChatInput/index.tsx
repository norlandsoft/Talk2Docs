import React, { useEffect, useRef, useState } from "react";
import Icon from '@/components/Icons';
import './index.less';

interface ChatInputProps {
  width?: number;
  onHeightChange?: (height: number) => void;
  onSend: (value: string) => void;
  finished?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = (props: ChatInputProps) => {

  const {
    width,
    onHeightChange,
    onSend,
    finished = true
  } = props;

  const [value, setValue] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showIME, setShowIME] = useState<boolean>(false);

  // 监听 textarea 内容变化，自动调整高度
  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };

  // 在组件加载后和内容变化时，调整高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '20px';
      const height = Math.min(180, textareaRef.current.scrollHeight);
      textareaRef.current.style.height = height + 'px';
      if (onHeightChange) {
        onHeightChange(height + 20);
      }
    }
  }, [value]);

  const handleSendMessage = (): void => {
    if (value.trim() === '') {
      return;
    }
    if (finished) {
      onSend(value);
      setValue('');
    }
  }

  return (
    <div className={'chat-input-wrapper'} style={{ width }}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleTextareaChange}
          onCompositionStart={() => {
            setShowIME(true)
          }}
          onCompositionEnd={() => {
            setShowIME(false)
          }}
          // 回车发送
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              if (showIME) {
                setShowIME(false);
                return;
              }
              if (event.ctrlKey || event.metaKey) {
                setValue(value + '\n');
                return;
              }
              event.preventDefault();
              handleSendMessage();
            }
          }}
          className={'chat-input'}
          placeholder={'请输入问题...'}
          rows={1}
        />
        <div className={`chat-input-submit ${finished ? '' : 'chat-input-disabled'}`}
          onClick={finished ? handleSendMessage : () => {
          }}>
          <Icon name={finished ? 'send' : 'Stop'} size={24} />
        </div>
      </div>
  );
}

export default ChatInput;