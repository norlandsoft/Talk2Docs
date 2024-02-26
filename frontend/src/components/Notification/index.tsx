import {notification} from "antd";
import './index.less';
import {IconType, NotificationPlacement} from "antd/es/notification/interface";

interface NotificationOptions {
  title?: string;
  message: string;
  type?: IconType;
  duration?: number;
  position?: NotificationPlacement;
}

const notice = (options: NotificationOptions) => {
  notification.open({
    message: options.title,
    description: options.message,
    duration: options.duration || 1,
    type: options.type || 'info',
    placement: options.position || 'topRight',
  });
}

const info = (options: NotificationOptions) => {
  notice({...options, type: 'info'});
};

const success = (options: NotificationOptions) => {
  notice({...options, type: 'success'});
}

const warn = (options: NotificationOptions) => {
  notice({...options, type: 'warning'});
}

const error = (options: NotificationOptions) => {
  notice({...options, type: 'error'});
}

export {info, success, warn, error};
