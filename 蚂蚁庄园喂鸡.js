/**
 * 计划：
 * uiselector 自定义金额 ->0.01
 * click
 * 
 * @author Martlet
 */
auto(); // 自动打开无障碍服务

//配制操作
var config = files.isFile("config.js") ? require("config.js") : {};
if (typeof config !== "object") {
    config = {};
}
var options = Object.assign({
    password: "",
    pattern_size: 3
}, config); // 用户配置合并


// 所有操作都是竖屏
const WIDTH = Math.min(device.width, device.height);
const HEIGHT = Math.max(device.width, device.height);
setScreenMetrics(WIDTH, HEIGHT);
start(options);


/**
* 开始运行
* @param options
*/
function start(options) {
   checkModule();

   var Robot = require("Robot.js");
   var robot = new Robot(options.max_retry_times);
   var dH5 = new mapp(robot, options);
   
   while (!device.isScreenOn()) {
       device.wakeUp();
       sleep(1000); // 等待屏幕亮起
   }
   
   // 先打开APP，节省等待时间
   threads.start(function () {
       dH5.openApp();
   });

   dH5.launch();
   click(940,1620);

   dH5.closeApp();

   // 退出
   exit();
   throw new Error("强制退出");
}

/**
* 检查必要模块, Robot.js
*/
function checkModule() {
   if (!files.exists("Robot.js")) {
       throw new Error("缺少Robot.js文件，请将文件放入和脚本相同文件夹");
   }
}


/**
* myapp operations
* @param robot
* @param options
* @constructor
*/

function mapp(robot, options) {
   this.robot = robot;
   options = options || {};
   var settings = {
       timeout: 8000, // 超时时间：毫秒
       max_retry_times: 10, // 最大失败重试次数
       takeImg: "take.png", // 收取好友能量用到的图片
       max_swipe_times: 100, // 好友列表最多滑动次数
       min_time: "7:14:00", // 检测时段
       max_time: "7:15:50",
       check_within_time: 5,
       help_img: ""
   };
   this.options = Object.assign(settings, options);
   this.package = "com.eg.android.AlipayGphone"; // 支付宝包名
   this.state = {};
   this.capture = null;
   this.bounds = [0, 0, WIDTH, 1100];
   this.icon_num = 1;
   this.start_time = (new Date()).getTime();
   this.detected = 0;
   
   toastLog("马上弄，按音量上键停止");
   

   this.openApp = function () {
       launch(this.package);
   };

   this.closeApp = function () {
       this.robot.kill(this.package);
   };

   // v lauch doLaunch waitForLoading for this.launch
   this.launch = function () {
       var times = 0;
       toastLog("Launch start");
       do {
           if (this.doLaunch()) {
               toastLog("doLaunch complete");
               return;
           } else {
               times++;
               this.back();
               sleep(1500);
               this.openApp();
           }
       //} while(1)
       } while (times < this.options.max_retry_times);

       throw new Error("运行失败");
   };

   this.doLaunch = function () {
       toastLog("打开url scheme");


       // 等待加载
       if (this.waitForLoading("更多")) {
           log("进入url成功");
       } else {
           toastLog("进入url失败");
           return false;
       }

       return true;
   };

   this.waitForLoading = function (keyword) {
       toastLog("waitForLoading")
       var timeout = this.options.timeout;
       var waitTime = 2000;
       sleep(2000);
       timeout -= 2000;
       for (var i = 0; i < timeout; i += waitTime) {
           if (desc(keyword).exists()) {
               sleep(1000);
               return true;
           }
           toastLog("start url")
           app.startActivity({
               action: "VIEW",
               data: "alipays://platformapi/startapp?appId=66666674"
           });
           sleep(waitTime); // 加载中
       }

       return false;
   };
   // ^ lauch doLaunch waitForLoading for this.launch
   
}