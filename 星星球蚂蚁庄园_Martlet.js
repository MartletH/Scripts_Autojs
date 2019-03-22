/**
 * Huge modification from ridersam <e1399579@gmail.com>
 * By Martlet
 */
auto(); // 自动打开无障碍服务

const WIDTH = device.width
const HEIGHT = device.height

/* console.show() // debug
console.setPosition(0, HEIGHT*3/4)
console.setSize(WIDTH, HEIGHT/4) */

   var dH5 = new mapp();
   
   dH5.launch();
   starballstart();
   dH5.play();

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

var x=0,x2=0;
var y=0,y2=0;

function AntManor() {
    this.colors = ["#FF4C4C", "#4E86FF", "#FFD950"]; // red, blue, gold
    this.find_time = 500;

    this.play = function (){
        var len = this.colors.length;
        var wait_time = 10;
        // var baseline = device.height * 0.412 | 0;
        var baseline = device.height * 0.45 | 0;
        var min_height = baseline * 0.5 | 0;
        // var min_height = baseline * 0.55 | 0;
        
        // 发球
        var point = this.findColorPoint(len);
        x = point.x;
        y = point.y;
        click(x, y);
        x2=x;
        y2=y;
        
        for(i=1;i<=500;i++)
        {

            var point = this.findColorPoint(len);
            x = point.x;
            y = point.y;
            // click(x,y);
                //while(y>y2)
                {
                if (min_height <= y && y <= baseline)
                {

                    if(x>=x2)
                    {                    
                        click(x-5, baseline-5);
                        click(x+5, baseline+5);
                        
                    }
                    else
                    {
                        click(x+5, baseline+5);
                        click(x-5, baseline-5);
                    };

                }
                else
                {
                    if(y>baseline)
                    {
                        click(x,y)
                    };
                };
                };
           /*  var point2 = this.findColorPoint(len);
            x2=point2.x;
            y2=point2.y;
            click(x2,y2);
            dx=x-x2;
            dy=y-y2;
            log("2:"+x2+","+y2)
            log("1:"+dx+","+dy) */
        };
    };

    this.findColorPoint = function (len) {
        var wait_time = 1;
        for (var time = 0;time < this.find_time;time += wait_time)
        {
            for (var i = 0;i < len;i++)
            {
                var capture = captureScreen();
                if (!capture)
                {
                    log("Capture Fail")
                    continue;
                }
                var color = this.colors[i];
                var point = findColorEquals(capture, color, WIDTH*0.2, HEIGHT*0.2, WIDTH*0.8, HEIGHT*0.7);
                if (point !== null)
                {
                    return point;
                }
            }
        }
        return null;
    };
};


function mapp() {


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
       var timeout = 8000;
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