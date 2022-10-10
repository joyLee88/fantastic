import { mitts } from './tool';

/*
 * @Author: lzx
 * @Date: 2022-05-25 15:42:37
 * @LastEditors: lzx
 * @LastEditTime: 2022-08-18 15:01:38
 * @Description: Fuck Bug
 * @FilePath: \talk_pc\src\utils\socket.ts
 */
let socketUrl: any = ''; // socket地址
let websocket: any = null; // websocket 实例
let heartTime: any = null; // 心跳定时器实例
let socketHeart = 0; // 心跳次数
const HeartTimeOut = 3000; // 心跳超时时间
let socketError = 0; // 错误次数

// 初始化socket
const initWebSocket = (url: any) => {
  socketUrl = url;
  // 初始化 websocket
  websocket = new WebSocket(url);
  websocketonopen();
  websocketonmessage();
  sendSocketHeart();
};

// socket 连接成功
const websocketonopen = () => {
  websocket.onopen = function (e: any) {
    console.log('连接 websocket 成功', e);
    resetHeart();
  };
};

// socket 连接失败
const websocketonerror = () => {
  websocket.onerror = function (e: any) {
    console.log('连接 websocket 失败', e);
  };
};

// socket 断开链接
const websocketclose = () => {
  websocket.onclose = function (e: any) {
    console.log('断开连接', e);
  };
};

// socket 接收数据
const websocketonmessage = () => {
  websocket.onmessage = function (e: any) {
    const msg = JSON.parse(e.data);
    if (msg.type === 'heartbeat') {
      resetHeart();
      console.log('心跳');
    }
    // console.log("收到socket消息", JSON.parse(e.data));
    test(msg); // 测试数据
  };
};

// socket 发送数据
const sendMsg = (data: any) => {
  websocket.send(data);
};

// socket 错误
const websocketError = () => {
  websocket.onerror = function (e: any) {
    console.log('socket 错误', e);
  };
};

// socket 重置心跳
const resetHeart = () => {
  socketHeart = 0;
  socketError = 0;
  clearInterval(heartTime);
  sendSocketHeart();
};

// socket心跳发送
const sendSocketHeart = () => {
  heartTime = setInterval(() => {
    if (socketHeart <= 2) {
      console.log('心跳发送：', socketHeart);
      websocket.send(
        JSON.stringify({
          content: '',
          requestId: 'aa9872be-d5b9-478e-aba4-50527cd3ef32',
          type: 'heartbeat',
        })
      );
      socketHeart = socketHeart + 1;
    } else {
      reconnect();
    }
  }, HeartTimeOut);
};

// socket重连
const reconnect = () => {
  if (socketError <= 2) {
    clearInterval(heartTime);
    initWebSocket(socketUrl);
    socketError = socketError + 1;
    console.log('socket重连', socketError);
  } else {
    console.log('重试次数已用完的逻辑', socketError);
    clearInterval(heartTime);
  }
};

// 测试收到消息传递
const test = (msg: any) => {
  switch (msg.type) {
    case 'heartbeat': //加入会议
      mitts.emit('heartbeat', msg);
      break;
  }
};
export {
  initWebSocket,
  websocketonmessage,
  sendMsg,
  websocketonopen,
  websocketonerror,
  websocketclose,
  websocketError,
  resetHeart,
  sendSocketHeart,
  reconnect,
};
