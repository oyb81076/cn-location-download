import { join } from "path";
import { fileDir } from "../fileUtils";

it("should be ok", () => {
  const url = join(__dirname, "../../temp", "tjsj/tjbz/tjyqhdmhcxhfdm/2018/12/01/05/120105001.html");
  const expectation = join(__dirname, "../../temp", "tjsj/tjbz/tjyqhdmhcxhfdm/2018/12/01/05");
  expect(fileDir(url)).toBe(expectation);
});
