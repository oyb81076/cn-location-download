# 省市区统计局爬虫
安装 ``yarn install``
# 帮助
``yarn build --help``
# usage
``yarn build --depth=2 ``
# options
```
Options:
  -d, --depth [depth]  搜索深度1:省,2:市,3:区,4:镇,5:办事处 (default: "1")
  -u, --url [url]      网址 (default: "http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2017/index.html")
  -h, --help           output usage information
```
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