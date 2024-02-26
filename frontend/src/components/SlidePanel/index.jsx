import React from "react";
import {Drawer} from 'antd';
import Button from '../Button';
import Icon from '../Icon';
import './index.less';

const SlidePanel = props => {

  const {
    children,
    maskClosable = false,
    buttonStyles,
    hasCloseButton = false,
    hasButtonBar = true,
    onConfirm,
    onClose,
    confirmButtonText,
    closeButtonText,
    open,
    placement = 'right',
    title,
    bodyPadding = 24,
    type = 'default', /* small, default, large, huge, custom */
    width = 378
  } = props;

  const footerContent = (
      <div>
        {
          onConfirm ? (
              <Button type={'primary'} onClick={onConfirm} style={{marginRight: '12px', ...buttonStyles}}>
                {
                  confirmButtonText ? confirmButtonText : '确定'
                }
              </Button>
          ) : null
        }
        {
          onClose ? (
              <Button type={'default'} onClick={onClose}>
                {
                  closeButtonText ? closeButtonText : '取消'
                }
              </Button>
          ) : null
        }
      </div>
  );

  const getPanelWidth = () => {
    switch (type) {
      case 'small':
        return 290;
      case 'medium':
        return 520;
      case 'large':
        return 736;
      case 'huge':
        return 1024;
      case 'full':
        return '100%';
      case 'custom':
        return width;
      case 'default':
      default:
        return 378;
    }
  }

  const getPanelHeight = () => {
    return 255;
  }

  return (
      <Drawer
          extra={<div>&nbsp;</div>}
          closable={false}
          maskClosable={maskClosable}
          onClose={onClose}
          open={open}
          height={type === 'full' ? '100%' : getPanelHeight()}
          placement={type === 'full' ? 'top' : placement}
          footer={hasButtonBar ? footerContent : null}
          title={hasCloseButton || title ? ' ' : null}
          styles={{
            header: {
              height: '40px'
            },
            body: {
              padding: bodyPadding
            },
            footer: {
              padding: '8px 24px 9px 24px',
              borderTop: 'var(--panel-border)',
              background: '#fafafa',
              textAlign: type === 'full' ? 'right' : 'left'
            }
          }}
          width={getPanelWidth()}
          destroyOnClose={true}
      >
        {
          hasCloseButton || title ? (
              <div className={'ant-slide-header'}>
                {
                  title ? (
                      <div className={'ant-slide-header-title'}>
                        {title}
                      </div>
                  ) : null
                }
                {
                  hasCloseButton ? (
                      <div className={'ant-slide-header-close'} onClick={onClose}>
                        <Icon name={'close'} size={16}/>
                      </div>
                  ) : null
                }
              </div>
          ) : null
        }
        {children}
      </Drawer>
  );
}

export default SlidePanel;