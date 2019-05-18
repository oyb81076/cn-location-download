import { join } from "path";
import { urlToFilename } from "../fileUtils";

it("should be /tjsj/tjbz/tjyqhdmhcxhfdm/2018/12/01/05/120105001.html", () => {
  expect(urlToFilename("http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/12/01/05/120105001.html") )
    .toBe(join(__dirname, "../../temp", "tjsj/tjbz/tjyqhdmhcxhfdm/2018/12/01/05/120105001.html"));
});
