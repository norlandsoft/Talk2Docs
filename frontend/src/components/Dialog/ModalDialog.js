import React from 'react';
import {Spin} from 'antd';
import Button from '../Button';
import Icon from '../Icon';
import './ModalDialog.less';

class ModalDialog extends React.Component {

  constructor(props) {
    super(props);
    const {visible} = this.props;
    const {clientWidth, clientHeight} = document.documentElement;
    this.state = {
      visible: (visible !== '' && visible !== null) ? visible : false,
      clientWidth,
      clientHeight,
      pageX: clientWidth / 3,
      pageY: '10vh',
      moving: false,
    }
  }

  UNSAFE_componentWillReceiveProps({visible}) {
    if (visible !== '' && visible !== null) {
      this.setState({visible});
    }
  }

  componentDidMount() {
    this.resize();
    window.addEventListener('resize', this.resize);
  }

  resize = () => {
    const {clientWidth, clientHeight} = document.documentElement;
    // console.log(`监听到窗口大小变化 宽：${clientWidth} 高：${clientHeight}`)
    const modal = document.getElementById("modal");
    if (modal) {
      const pageY = (clientHeight - modal.offsetHeight) / 2;
      const pageX = (clientWidth - modal.offsetWidth) / 2;
      this.setState({clientWidth, clientHeight, pageX, pageY})
    }
  }

  doCancel = () => {
    const {onCancel, domId} = this.props;
    if (onCancel) {
      onCancel();
    }

    this.setState({visible: false});
    // 删除dom
    const dm = document.getElementById(domId ? domId : 'ant-modal-dialog');
    if (dm) {
      document.body.removeChild(dm);
    }
  }

  open = () => {
    this.setState({visible: true});
  }

  // 获取鼠标点击title时的坐标、title的坐标以及两者的位移
  getPosition = (e) => {
    // 标题DOM元素titleDom
    const titleDom = e.target;
    // titleDom的坐标
    const X = titleDom.getBoundingClientRect().left;
    const Y = titleDom.getBoundingClientRect().top;
    // 鼠标点击的坐标
    let mouseX = 0, mouseY = 0;
    if (e.pageX || e.pageY) {  //ff,chrome等浏览器
      mouseX = e.pageX;
      mouseY = e.pageY;
    } else {
      mouseX = e.clientX + document.body.scrollLeft - document.body.clientLeft;
      mouseY = e.clientY + document.body.scrollTop - document.body.clientTop;
    }
    // 鼠标点击位置与modal的位移
    const diffX = mouseX - X;
    const diffY = mouseY - Y;
    return {X, Y, mouseX, mouseY, diffX, diffY}
  }

  /**
   * 鼠标按下，设置modal状态为可移动，并注册鼠标移动事件
   * 计算鼠标按下时，指针所在位置与modal位置以及两者的差值
   **/
  onMouseDown = (e) => {
    const position = this.getPosition(e);
    window.onmousemove = this.onMouseMove;
    this.setState({moving: true, diffX: position.diffX, diffY: position.diffY});
  }

  // 松开鼠标，设置modal状态为不可移动,
  onMouseUp = (e) => {
    this.setState({moving: false});
  }

  // 鼠标移动重新设置modal的位置
  onMouseMove = (e) => {
    const {moving, diffX, diffY} = this.state;
    if (moving) {
      // 获取鼠标位置数据
      const position = this.getPosition(e);
      // 计算modal应该随鼠标移动到的坐标
      const x = position.mouseX - diffX;
      const y = position.mouseY - diffY;
      // 窗口大小
      const {clientWidth, clientHeight} = document.documentElement;
      const modal = document.getElementById("modal");
      if (modal) {
        // 计算modal坐标的最大值
        const maxHeight = clientHeight - modal.offsetHeight;
        const maxWidth = clientWidth - modal.offsetWidth;
        // 判断得出modal的最终位置，不得超出浏览器可见窗口
        const left = x > 0 ? (x < maxWidth ? x : maxWidth) : 0;
        const top = y > 0 ? (y < maxHeight ? y : maxHeight) : 0;
        this.setState({pageX: left, pageY: top})
      }
    }
  }

  render() {
    const {okText, onOk, cancelText, closable = true, children, width, height, title, mask = false} = this.props;
    const {visible, clientWidth, clientHeight, pageX, pageY} = this.state;
    const modal = (
        <div className={'custom_modal_mask'} style={{width: clientWidth, height: clientHeight}}>
          <div
              id="modal"
              className={'custom_modal_win'}
              style={{
                width: width ? width : clientWidth / 3,
                height: height ? height : 'unset',
                marginLeft: pageX,
                marginTop: pageY,
              }}>
            <div className={'custom_modal_header'}>
              <div
                  className={'custom_modal_header_inner'}
                  onMouseDown={this.onMouseDown}
                  onMouseUp={this.onMouseUp}
              >
                {title ? title : 'AirTaaS'}
              </div>

              {
                closable ? (
                    <div className={'custom_modal_header_close'} onClick={this.doCancel}>
                      <Icon name="close" size={16} style={{margin:'4px'}}/>
                    </div>
                ) : null
              }
            </div>
            <div className={'custom_modal_content'}>
              <div className={'mask'} style={{visibility: mask ? 'visible' : 'hidden'}}>
                <Spin size="large"/>
              </div>
              {children}
            </div>
            <div className={'custom_modal_footer'}>
              <div className={'custom_modal_footer_inner'}>
                <Button type="primary" onClick={onOk}>
                  {okText ? okText : '确定'}
                </Button>
                {
                  closable ? (
                      <Button onClick={this.doCancel} style={{marginLeft: '10px'}}>
                        {cancelText ? cancelText : '取消'}
                      </Button>
                  ) : null
                }
              </div>
            </div>
          </div>
        </div>
    )
    return <div>{!visible ? null : modal}</div>
  }
}

export default ModalDialog;
