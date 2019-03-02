/**
 * 计划：
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
   


   dH5.launch();
   starballstart();
   dH5.play();

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


function starballstart() {
    var timeout = 10000;
    // 截图权限申请
    threads.start(function () {
        var remember;
        var beginBtn;
        if (remember = id("com.android.systemui:id/remember").checkable(true).findOne(timeout)) {
            remember.click();
        }
        if (beginBtn = classNameContains("Button").textContains("立即开始").findOne(timeout)) {
            beginBtn.click();
        }
    });
    if (!requestScreenCapture(false)) {
        toastLog("请求截图失败");
        exit();
    }

    toast("打开星星球界面");
    app.startActivity({
        action: "VIEW",
        data: "alipays://platformapi/startapp?appId=66666782"
    });
    waitForActivity("com.alipay.mobile.nebulacore.ui.H5Activity");
    toast("进入星星球成功");
    sleep(5000);

    var antManor = new AntManor();

    antManor.play();

    exit();
}

function AntManor() {
    this.colors = ["#FF4C4C", "#4E86FF", "#FFD950"]; // red, blue, gold
    this.find_time = 5000;

    this.play = function () {
        var len = this.colors.length;
        var wait_time = 10;
        // var baseline = device.height * 0.412 | 0;
        var baseline = device.height * 0.412 | 0;
        var min_height = baseline * 0.55 | 0;
        // var min_height = baseline * 0.55 | 0;
        
        // 发球
        var point = this.findColorPoint(len);
        var x = point.x;
        var y = point.y;
        click(x, y);
        
        for(i=1;i<=1000;i++){
            var point = this.findColorPoint(len);
            var x = point.x;
            var y  = point.y;
            // click(x,y);
            if (min_height <= y && y <= baseline)
            click(x-20, baseline);
            click(x+20, baseline);
            // if(i=200|500|700){toastLog(i)}
                            
        }
    };

    this.findColorPoint = function (len) {
        var wait_time = 10;
        for (var time = 0;time < this.find_time;time += wait_time) {
            for (var i = 0;i < len;i++) {
                var capture = captureScreen();
                if (!capture) {
                    // sleep(50);
                    continue;
                }
                var color = this.colors[i];
                var point = findColorEquals(capture, color, 0, 0, WIDTH, HEIGHT);
                if (point !== null) {
                    return point;
                }
            }
        }

        return null;
    };
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