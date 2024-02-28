import {error} from '@/components/Notification';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  400: '发出的请求有错误，服务器无法解析参数数据。',
  401: '用户没有权限（令牌、用户名、密码错误），或登录超时。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  415: 'Unsupported Media Type',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '应用服务产生错误，请检查服务日志。',
  501: '无法处理服务请求。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

// 封装请求头
function requestHeader() {
  // const token = sessionStorage.getItem("air-auth-token");
  return {
    // 'Authorization': 'Bearer ' + token,
    'Connection': 'keep-alive',
    'Content-Type': 'application/json;charset=UTF-8',
  };
}

// 判断是否为JSON格式字符串
export function isJSON(str: string) {
  if (typeof str == 'string') {
    try {
      const obj = JSON.parse(str);
      return !!(typeof obj == 'object' && obj);
    } catch (e) {
      return false;
    }
  } else {
    return true;
  }
}

export async function SSE(url: string | URL, params: ChatMessageRequestProps, callback: any) {
  const {taskId, chatId} = params;
  const eventSource = new EventSource(url + '?task=' + taskId + '&chat=' + chatId);

  eventSource.onmessage = (event: any) => {
    if (event.data === '<OPEN>') {
      return;
    }

    if (event.data === '<END>') {
      callback(event.data);
      eventSource.close();
      return;
    }

    callback(event.data);
  }

  eventSource.onerror = (event: any) => {
    callback('<ERROR>');
    eventSource.close();
  }
}

export async function POST(url: string | URL | Request, params: any) {
  return new Promise(
    (resolve, _) => {
      fetch(url, {
        method: 'POST',
        headers: requestHeader(),
        mode: 'cors',
        cache: "no-cache",
        body: isJSON(params) ? JSON.stringify(params) : params
      }).then((res) => {
        switch (res.status) {
          case 400:
            return resolve({
              success: false,
              code: 'HTTP-400',
              message: '异常 [HTTP-400], 请求参数错误'
            });
          case 404:
            return resolve({
              success: false,
              code: 'HTTP-404',
              message: '异常 [HTTP-404], 请求地址不存在'
            });
          case 408:
            return resolve({
              success: false,
              code: 'HTTP-408',
              message: '异常 [HTTP-408], 请求超时'
            });
          case 500:
            return resolve({
              success: false,
              code: 'HTTP-500',
              message: '异常 [HTTP-500], 服务端无法处理当前请求'
            });
          case 501:
            return resolve({
              success: false,
              code: 'HTTP-501',
              message: '异常 [HTTP-501], 服务端无法处理当前请求'
            });
          case 502:
          case 503:
          case 504:
            return resolve({
              success: false,
              code: `HTTP-${res.status}`,
              message: '无法访问服务, 请检查服务是否正常运行，或联系平台管理员。'
            });
          case 200:
            // 判断返回数据raw是否为空
            if (res.headers.get('Content-Length') === '0') {
              return resolve({
                success: false,
                message: '服务端无法处理当前请求, 请检查服务是否正常运行，或联系平台管理员查看系统日志。'
              });
            }

            // 判断返回数据是否为JSON格式
            if (res.headers.get('Content-Type')?.indexOf('application/json') !== -1) {
              return resolve(res.json());
            } else {
              // 非json格式, 返回blob
              return resolve(res.blob());
            }
          default:
            error({
              title: `HTTP ${res.status}`,
              message: codeMessage[res.status]
            });
        }
      }).catch(err => {
        error({
          title: '网络错误',
          message: err.message
        });
      });
    }
  );
}