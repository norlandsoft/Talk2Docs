const randomString = (len: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let r = ' ';
  const charactersLength = characters.length;
  for (let i = 0; i < len; i++) {
    r += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return r;
}

function UUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

function shortId() {
  const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let shortBuffer = '';
  const uuid = UUID().replace(/-/g, '');

  for (let i = 0; i < 8; i++) {
    const str = uuid.substring(i * 4, i * 4 + 4);
    const x = parseInt(str, 16);
    shortBuffer += CHARS[x % 0x3E];
  }

  return shortBuffer;
}

function equalJsonArray(arr1, arr2) {
  // 首先检查数组长度是否相等
  if (arr1.length !== arr2.length) {
    return false;
  }

  // 将数组元素转换为字符串并排序
  const sortedArr1 = JSON.stringify(arr1.slice().sort());
  const sortedArr2 = JSON.stringify(arr2.slice().sort());

  // 比较排序后的字符串
  return sortedArr1 === sortedArr2;
}

function formatDate(dateString: string) {
  // 创建日期对象
  var dateObj = new Date(dateString);

  // 提取年、月、日、小时、分钟和秒
  var year = dateObj.getFullYear();
  var month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // 月份是从0开始的，需要加1并补零
  var day = dateObj.getDate().toString().padStart(2, '0');
  var hours = dateObj.getHours().toString().padStart(2, '0');
  var minutes = dateObj.getMinutes().toString().padStart(2, '0');
  var seconds = dateObj.getSeconds().toString().padStart(2, '0');

  // 构建新的日期字符串
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export {randomString, UUID, shortId, equalJsonArray, formatDate};