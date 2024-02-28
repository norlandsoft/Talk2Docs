import path from 'path';

// 扩展 require 类型，以便在 TypeScript 中使用 require.context
declare global {
  interface NodeRequire {
    context: (
      directory: string,
      useSubdirectories?: boolean,
      regExp?: RegExp
    ) => {
      (key: string): any;
      keys(): string[];
    };
  }
}

// 获取当前目录下所有文件
const req = require.context('./svg', false, /\.tsx$/);

// 图标组件对象
const iconComponents = {};

// 遍历每个文件
req.keys().forEach(key => {
  // 获取文件名作为 key，去除扩展名和路径
  const iconName = path.basename(key, '.tsx');
  // 导入组件并添加到 iconComponents 对象
  iconComponents[iconName.toLowerCase()] = req(key).default;
});

const Icons = ({name, size = 24, color = '#1C274C', thickness = 1.5}: IconProps) => {
  // 根据传入的名称动态选择对应的图标组件
  const IconComponent = iconComponents[name.toLowerCase()];
  // 如果找到对应的图标组件，则渲染它；否则返回 null
  return IconComponent ? <IconComponent size={size} color={color} thickness={thickness}/> : null;
}

export default Icons;