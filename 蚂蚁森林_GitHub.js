/**
 * @Author Martlet
 * Leave comments for us to know what happens to Alipay
 * 20200126, Update desc to text, remove tasker functions (Not using)
  */

/**
 * This will work for all interface as you open
 */

textStartsWith("收集能量").find().forEach(function (t) {
    log(t.text())
    log(bnds = t.bounds())
    log(click(bnds.centerX(), bnds.centerY()))
})

