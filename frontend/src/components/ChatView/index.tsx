import React, {useRef, useEffect, useState} from "react";
import {FloatButton, message} from 'antd';
import Icon from '@/components/Icons';
import {ArrowDownOutlined} from '@ant-design/icons';
import CopyCode from './copy-code-icon';
import ReactMarkdown from 'react-markdown';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {atomDark} from 'react-syntax-highlighter/dist/esm/styles/prism';

import styles from './index.less';

interface ChatViewProps {
  height: number;
  width: number;
  chatList: any[];
  lastResponse: string;
}

const ChatView: React.FC<ChatViewProps> = (props: ChatViewProps) => {

  const {
    height,
    width,
    chatList,
    lastResponse
  } = props;

  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [showButton, setShowButton] = useState(false)

  const userTitle = {
    padding: '12px 0 0 12px'
  }

  const respTitle = {
    padding: '12px 12px 0',
    background: '#fafafa',
    borderRadius: '5px 5px 0 0'
  }

  const userStyle = {
    paddingLeft: '43px',
    width: width - 80,
  }

  const respStyle = {
    padding: '0.1px 43px',
    background: '#fafafa',
    width: width - 80,
  }

  // 滚动到底部
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [chatList, lastResponse]);


  const handlePanelScroll = (e) => {
    if (messagesEndRef.current) {
      const show = messagesEndRef.current.scrollHeight - messagesEndRef.current.scrollTop - e.target.clientHeight;
      setShowButton(show > 28);
    }
  }

  const airDark = {
    ...atomDark,
    'pre[class*=\"language-\"]': {
      "color": "#c5c8c6",
      // "textShadow": "0 1px rgba(0, 0, 0, 0.3)",
      "fontFamily": "IBMPlexMono, Monaco, Consolas, 'Courier New', Courier, monospace",
      "fontSize": "0.9rem",
      "direction": "ltr",
      "textAlign": "left",
      "whiteSpace": "pre",
      "wordSpacing": "normal",
      "wordBreak": "normal",
      "lineHeight": "2",
      "MozTabSize": "4",
      "OTabSize": "4",
      "tabSize": "4",
      "WebkitHyphens": "none",
      "MozHyphens": "none",
      "msHyphens": "none",
      "hyphens": "none",
      "padding": "1em",
      "margin": "0",
      "overflow": "auto",
      "borderRadius": "0 0 0.3em 0.3em",
      "background": "#1d1f21"
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(function() {
      message.success('代码已复制');
    }).catch(function(err) {
      message.error('无法复制代码到剪贴板，请手动复制');
    });
  }

  const MarkDownRender = (props: any) => {
    const {message} = props;

    return (
      <div className={styles.content} style={(message.type === 'q') ? userStyle : respStyle}>
        <ReactMarkdown
          components={{
            code({node, className, children, ...props}) {
              const match = /language-(\w+)/.exec(className || '');
              const code = String(children).replace(/\n$/, '');
              return match ? (
                <div className={styles.markdown}>
                  <div className={styles.bar}>
                    <div>{match[1]}</div>
                    <div className={styles.copy} onClick={() => copyCode(code)}>
                      <CopyCode/>复制代码
                    </div>
                  </div>
                  <SyntaxHighlighter
                    style={airDark}
                    language={match[1]}
                    PreTag="div"
                    children={code}
                    {...props}
                  />
                </div>
              ) : (
                <code className={styles.code} {...props}>
                  {children}
                </code>
              );
            }
          }}>
          {message.content}
        </ReactMarkdown>
      </div>
    );
  }

  return (
    <div className={styles.message} style={{height: height}} id={'message_panel'} ref={messagesEndRef} onScroll={handlePanelScroll}>
      {
        chatList.map((message: any) => {
          return (
            <div className={styles.item} key={message.id}>
              <div className={styles.title} style={message.type === 'q' ? userTitle : respTitle}>
                <div className={styles.avatar}>
                  <Icon size={24} thickness={2} name={message.type === 'q' ? 'talker' : 'llm'}/>
                </div>
                <div className={styles.name}>{message.type === 'q' ? 'YOU' : 'MACHINE'}</div>
              </div>
              <MarkDownRender message={message}/>
              {
                message.type === 'a' && (
                  <div id={message.id} style={{
                    userSelect: 'none',
                    textAlign: 'right',
                    fontSize: '11px',
                    lineHeight: '14px',
                    background: '#fafafa',
                    borderRadius: '0 0 5px 5px'
                  }}>{message.id}</div>
                )
              }
            </div>
          )
        })
      }
      {
        (() => {
          return lastResponse.length > 0 && (
            <div className={styles.item}>
              <div className={styles.title} style={respTitle}>
                <div className={styles.avatar}>
                  <Icon size={24} thickness={2} name={'llm'}/>
                </div>
                <div className={styles.name}>MACHINE</div>
              </div>
              <MarkDownRender message={{type: 'a', content: lastResponse, id: 'last_response'}}/>
            </div>
          )
        })()
      }
      <FloatButton
        icon={<ArrowDownOutlined />}
        type="default"
        style={{bottom: 118, visibility: showButton ? 'visible' : 'hidden'}}
        onClick={() => scrollToBottom()}
      />
    </div>
  );
}

export default ChatView;