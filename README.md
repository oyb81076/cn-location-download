# 省市区统计局爬虫
安装 ``yarn install``
# 帮助
``yarn build --help``
# usage
``yarn build --depth=2 ``
# options
```
统计局爬虫

Options:
  --depth [depth]             搜索深度1:省,2:市,3:区,4:镇,5:办事处 (default: "1")
  --url [url]                 网址 (default: "http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/index.html")
  --delay-time [delayTime]    每次请求间隔(毫秒) (default: "1000")
  --concurrent [concurrent]   并发数量 (default: "5")
  --retry-count [retryCount]  下载失败的时候重复请求次数 (default: "3")
  --timeout [timeout]         超时时间(毫秒) (default: "10000")
  -h, --help                  output usage information
```
# 注意事项
不要把请求间隔和并发数调的太高, 容易造成对方站点的一些问题, 放在那里慢慢下载就可以了

# 统计局统计用区划代码(code)编码规则
{省:2位}{市:2位}{县:2位}{镇:3位}{办事处:3位}
```
130102004016
13 河北省
01 石家庄市
02 长安区
004	育才街道办事处
016 药东社区居民委员会
```