import React from "react";

import add from './svg/Add';
import chat from './svg/Chat';
import close from './svg/Close';
import dialog from './svg/Dialog';
import document from './svg/Document';
import document_add from './svg/DocumentAdd';
import flash from './svg/Flash';
import knowledge from './svg/Knowledge';
import more from './svg/More';
import send from './svg/Send';
import setting from './svg/Setting';
import talker from './svg/Talker';
import toggle_open from './svg/Toggle-Open';
import toggle_close from './svg/Toggle-Close';
// 图标组件对象
const iconComponents: { [key: string]: React.ElementType } = {
  add,
  chat,
  close,
  dialog,
  document,
  document_add,
  flash,
  knowledge,
  more,
  send,
  setting,
  talker,
  toggle_close,
  toggle_open
};

const Icons = ({name, size = 24, color = '#1C274C', thickness = 1.5}: IconProps) => {
  // 根据传入的名称动态选择对应的图标组件
  const IconComponent = iconComponents[name.toLowerCase()];
  // 如果找到对应的图标组件，则渲染它；否则返回 null
  return IconComponent ? <IconComponent size={size} color={color} thickness={thickness}/> : null;
}

export default Icons;