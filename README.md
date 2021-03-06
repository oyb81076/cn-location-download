# 省市区统计局爬虫
# 使用
安装 ``yarn install``
### 帮助
``yarn build --help``
### 运行
``yarn build --depth=2 ``
### options
```
  --depth [depth]             搜索深度1:省,2:市,3:区,4:镇,5:办事处 (default: "1")
  --url [url]                 网址 (default: "http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/index.html")
  --delay-time [delayTime]    每次请求间隔(毫秒) (default: "1000")
  --concurrent [concurrent]   并发数量 (default: "5")
  --retry-count [retryCount]  下载失败的时候重复请求次数 (default: "3")
  --timeout [timeout]         超时时间(毫秒) (default: "10000")
  -h, --help                  output usage information
```
# 导出
* 导出的文件位置 ``build/data.json``
* 下载的网页存放的位置 ``temp``
* 发生错误的文件位置 ``temp/error``

### 数据结构
```ts
export interface IResult {
  name: string;
  code: number;
  children?: IResult[];
}
type DataJSON = IResult[]; // 最终数据
```
### EXAMPLE:
```json
[
  {
    "code": 1100000000,
    "name": "北京市",
    "children": [
      {
        "code": 110100000000,
        "name": "市辖区",
        "children": [
          {"code": 110101000000, "name": "东城区"},
          {"code": 110102000000, "name": "西城区"},
          {"code": 110105000000, "name": "朝阳区"},
```

# 注意事项
## 并发数量
不要把请求间隔和并发数调的太高, 容易造成对方站点的一些问题, 放在那里慢慢下载就可以了
## 抓取错误
有时候运营商或者并发太高会造成验证码的问题, 这类无法识别的HTML都会导出``temp/error``文件夹下,
因为网站是gb2312编码, 但是验证码站点是utf8, 所以导出的文件看起来会有中文乱码。
## 顺序问题
省 -> 市 -> 区 -> 镇 -> 街道, 这个顺序并不是固定的,  
有时候会出现 省 -> 市 -> 镇 -> 街道
省市区镇街道的判定标准依照code属性来判定
* AA0000000000 省
* AABB00000000 市
* AABBCC000000 区
* AABBCCDDD000 街道
* AABBCCDDDEEE 居委会

## 统计局统计用区划代码(code)编码规则
{省:2位}{市:2位}{县:2位}{镇:3位}{办事处:3位}
```
130102004016
13 河北省
01 石家庄市
02 长安区
004	育才街道办事处
016 药东社区居民委员会
```