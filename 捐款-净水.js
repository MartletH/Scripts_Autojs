/**
 * 计划：
 * uiselector 自定义金额 ->0.01
 * click
 * 
 * @author Martlet
 * Simplified on 20200126
 */

// set url scheme: 净水计划
/* var H5url = "alipays://platformapi/startapp?appId=10000009&url=/www/detail.htm?donateId=2014022411390592522"
var desctxt = "净水计划" */

// Load program


// console.show()

app.startActivity({
    action: "VIEW",
    data: "alipays://platformapi/startapp?appId=10000009&url=/www/detail.htm?donateId=2014022411390592522"
})

do {
    sleep(100) // Time for loading
}
while (!text("净水计划").exists())
toastLog(text("净水计划").exists() + " url opened")

const WIDTH = Math.min(device.width, device.height);
const HEIGHT = Math.max(device.width, device.height);

text("再捐一笔").findOnce().click()
//click 匿名
// click(130,1460) //简单且有效的办法
sleep(500) // Wait for ammount enter
text("匿名捐助").findOnce().click()
// Enter amount
amount = className("android.widget.EditText").findOnce() //无自定义金额dsc/txt，只好找classname
amount.setText("1")//选中自定义金额

amount.click() // amount click to select 自定义金额
click(0.25 * WIDTH, 0.9 * HEIGHT); // first click to cancel amount enter

sleep(200)
click(0.25 * WIDTH, 0.9 * HEIGHT);
