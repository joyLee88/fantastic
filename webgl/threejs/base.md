github 下载下来 本地启动（额，电脑老旧，先不装了）

parcel： 极速零配置 web 应用打包工具
为啥不用 vite、webpack。。。

# 一、基础搭建

1. 创建文件夹 threejstest/three-01，打开该空文件，终端输入初始化项目：

- npm init
- 配置构建工具，先装 parcel 吧，跟着做：yarn add --dev parcel
- 新建 src(官方文档说可以 yarn parcel src/index.html，直接配置)
  src/index.html
  src/assets/css/style.css
- package 修改 script，脚本配置
- index.htm
  link 引入公共 css
  script 引入主 main/main.js，进行模块化开发 type=“module”
- main.js
  yarn add three
  导入 threejs
  ```js
  import * as THREE from 'three';
  ```

2. 简单使用流程

```js
import * as THREE from 'three';
console.log(THREE);

// 1. 创建场景
const scene = new THREE.Scene();
// 2.创建相机，并设置相机的参数 视锥体垂直角度，宽高比，视锥体近端面，视锥体远端面
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// 设置相机位置， position是三维向量
camera.position.set(0, 0, 10);
// 把相机放入场景
scene.add(camera);

// 3.添加物体
// 创建几何体
const cubeGeometry = new THREE.BoxGeometry();
// 设置材质
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xfff000 });
// 根据几何体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
// 将几何体加入场景
scene.add(cube);

// 4.初始化渲染器，渲染出来
const renderer = new THREE.WebGLRenderer();
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
console.log(renderer); // 打印出来的对象中有canvas对象

// 5. 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement);
// 6.使用渲染器，通过相机将场景渲染进来
renderer.render(scene, camera);
```

3. 怎么动起来呢——控制器
   上面渲染出来是一个固定的

如 轨道控制器
先导入：

- import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

```js
import * as THREE from 'three';
console.log(THREE);
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// 1. 创建场景
const scene = new THREE.Scene();
// 2.创建相机，并设置相机的参数 视锥体垂直角度，宽高比，视锥体近端面，视锥体远端面
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// 设置相机位置， position是三维向量
camera.position.set(0, 0, 10);
// 把相机放入场景
scene.add(camera);

// 3.添加物体
// 创建几何体
const cubeGeometry = new THREE.BoxGeometry();
// 设置材质
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xfff000 });
// 根据几何体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
// 将几何体加入场景
scene.add(cube);

// 4.初始化渲染器，渲染出来
const renderer = new THREE.WebGLRenderer();
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
console.log(renderer); // 打印出来的对象中有canvas对象

// 5. 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement);
// 6.使用渲染器，通过相机将场景渲染进来
renderer.render(scene, camera);

// 7.创建轨道控制器，当前这个相机对着物体
const controls = new OrbitControls(camera, renderer.domElement);
// 要动起来，就要逐帧渲染
function render() {
  renderer.render(scene, camera);
  // 下一帧调用render函数
  requestAnimationFrame(render);
}

render();
```

简单实现鼠标拖动 cube 渲染

- 但是拖动场景的控制器很僵硬，没有阻尼或是惯性的感觉
  设置控制器
  controls.enableDamping = true

并要在 render 方法里更新
controls.update()

4. 坐标——坐标辅助器
   当前只能鼠标拖拽旋转，但看不出方向

使用线做成的
添加坐标轴辅助器, xyz 颜色对于 rgb，长度 5
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

5. 设置物体移动
   当前是在场景正中央
   cube 对象下有个 position 三维向量对象，就说明当前的具体位置，
   对其直接修改或者有个 set 方法进行修改
   cube.position.set(5, 0, 0)
   cube.poistion.x = 3; // 物体移动到坐标轴 x=3 处

那要让他匀速往返运动，直接在 render 方法里设置 cube 的 position

```js
// 实现反复运动
let v = 0.1;
function render() {
  v = cube.position.x > 5 || cube.position.x < 0 ? -v : v;
  cube.position.x += v;
  renderer.render(scene, camera);
  // 下一帧调用render函数
  requestAnimationFrame(render);
}
```

6. 物体的缩放和旋转
   cube 对象里除了 position，也有 scale、rotation 三维对象，赋值方法一样

可以看到立方体中心在坐标轴中心，以这个中心去缩放、旋转；
cube.scale.set(3, 2, 1); cube.scale.x = 5;
旋转可以设置旋转顺序
cube.rotation.set(Math.PI / 4, 0, 0) 旋转 45 度，按照 xyz 顺序
cube.rotation.set(Math.PI / 4, 0, 0， "xzy")

7. requestAnimationFrame
   正常屏幕 60 帧/1s，那每一帧相差时间一定一样吗

render 方法被其调用，默认有个参数 time 时间（ms），打印出来会发现间隔不一样。
那么以上也不算匀速运动
time 在第一次调用时间是 0，后面时间累积 ms
暂时就往单向运动，按照时间来算移动距离，有多少 ms，走多少步子

```js
function render(time) {
  const t = time / 1000;
  cube.position.x = t; // 从x=0开始运动
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
```

8. Clock
   用于跟踪时间，单位 s
   Clock(autoStart); 默认 true

有了间隔时间，就可以做到往返反复的匀速运动了

```js
import * as THREE from 'three';
console.log(THREE);
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// 1. 创建场景
const scene = new THREE.Scene();
// 2.创建相机，并设置相机的参数 视锥体垂直角度，宽高比，视锥体近端面，视锥体远端面
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// 设置相机位置， position是三维向量
camera.position.set(0, 0, 10);
// 把相机放入场景
scene.add(camera);

// 3.添加物体
// 创建几何体
const cubeGeometry = new THREE.BoxGeometry();
// 设置材质
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xfff000 });
// 根据几何体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
// 将几何体加入场景
scene.add(cube);

// 4.初始化渲染器，渲染出来
const renderer = new THREE.WebGLRenderer();
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
console.log(renderer); // 打印出来的对象中有canvas对象

// 5. 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement);
// 6.使用渲染器，通过相机将场景渲染进来
renderer.render(scene, camera);

// 7.创建轨道控制器，当前这个相机对着物体
const controls = new OrbitControls(camera, renderer.domElement);

// 8. 添加坐标轴辅助器, xyz颜色对于rgb，长度5
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 9. 修改物体的位置， 物体移动到坐标轴x=3处
// cube.position.set(5, 0, 0);
// cube.position.x = 3;

const clock = new THREE.Clock();

// 要动起来，就要逐帧渲染
let v = 0;
function render() {
  // render有个默认参数time，是个累积时间，在此不用
  // 获取时钟运行的总时长
  // const time = clock.getElapsedTime(); 类似于参数time，也是累积的
  // 两帧的间隔时间，根据间隔时间，保证匀速运动
  const deltaTime = clock.getDelta();
  v = v < 0 ? -deltaTime : deltaTime;
  v = cube.position.x > 5 || cube.position.x < 0 ? -v : v;
  cube.position.x += v;
  cube.rotation.x += 0.1; // 按照x轴逆时针旋转
  renderer.render(scene, camera);
  // 下一帧调用render函数
  requestAnimationFrame(render);
}

render();
```

9. 补间动画 gsap
   前面是要去计算，其实有专门的库 gsap，做动画

- yarn add gsap

```js
const ani1 = gsap.to(cube.position, {
  x: 5,
  duration: 5,
  ease: 'power1.inOut',
  repeat: 2, // 重复， -1指无限循环
  yoyo: true, // 往返运动
  delay: 2, // 延迟2s
  onComplete: () => {
    console.log('动画完成');
  },
  onStart: () => {
    console.log('动画开始');
  },
});
// {目标值，时长， 速度，回调函数}
gsap.to(cube.rotation, { x: 2 * Math.PI, duration: 5, ease: 'power1.inOut' });
// 实现双击暂停or启动
window.addEventListener('dblclick', () => {
  if (ani1.isActive()) {
    ani1.pause();
  } else {
    ani1.resume();
  }
});
```

10. 监听画面
    当窗口变化，画面要自适应

```js
window.addEventListener('resize', () => {
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  // 更新摄像机的投影矩阵
  camera.updateProjectionMatrix();
  // 更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
});
```

11. 画布全屏与退出全屏

```js
window.addEventListener('dblclick', () => {
  // 双击控制全屏
  // 全屏的时候才有值
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    // canvas对象申请全屏显示
    renderer.domElement.requestFullscreen();
  }
});
```

12. UI 界面库
    在 web 界面有一个直接控制 3d 参数的 ui

下载 ui 轻量库

- yarn add dat.gui
- 导入
  import \* as dat from "dat.gui"

```js
// 创建ui
const gui = new dat.GUI();
gui
  .add(cube.position, 'x')
  .min(0)
  .max(5)
  .step(0.01)
  .name('移动x坐标')
  .onChange((value) => {
    console.log('值被修改：', value);
  })
  .onFinishChange((value) => {
    console.log('完全停下来', value);
  }); // 可以改变position, 最小最大值，可设置单位
// 修改物体颜色
const params = {
  color: '#fff000',
  fn: () => {
    gsap.to(cube.position, { y: 5, duration: 2, yoyo: true, repeat: -1 });
  },
};
gui.addColor(params, 'color').onChange((value) => {
  console.log('颜色被修改', value);
  cube.material.color.set(value);
});
// 控制cube的visible属性
gui.add(cube, 'visible').name('是否显示');
// 控制cube做某个行为，添加个按钮
gui.add(params, 'fn').name('上下运动');
// 设置折叠面板
const folder = gui.addFolder('设置立方体');
// 折叠功能项里添加  将材质改为线板
folder.add(cube.material, 'wireframe');
```
