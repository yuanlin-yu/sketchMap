# SketchMap

SketchMap 是有一个基于Cesium开发的网页应用，用户可以在cesium基础上进行地点搜索及信息获取、建立简单模型、进行光影分析、测量、调用截取模型等，用户需要先注册cesium账户并输入access token。

主要功能：
* 搜索地址，自动弹出地点信息；
* 在线进行简单点、线、面、体建模；
* 调用周边建筑模型；
* 进行光影分析；
* 在地图上进行简单测量；

功能持续开发中

## :rocket: 开始使用

**1. 克隆本仓库链接**:

或从本页面下载。

**2. 输入access token**:

打开`src`目录下的`sketchMap.js`文件，赋予`Cesium.Ion.defaultAccessToken`参数你的cesium账户access token, 具体登录https://cesium.com/注册后获取。

```javascript
// 初始化Cesium Viewer
Cesium.Ion.defaultAccessToken = '你的access token';
```

**3*. 应用浏览器打开网页**:

用浏览器打开`src`目录下的`sketchMap.html`即可使用

## :green_book: 许可证

[Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0.html).
