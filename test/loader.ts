import { loadCities, loadCounties, loadProvinces, loadTowns, loadVillages } from "../src/loader";

test("provinces", async () => {
  await loadProvinces("http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2017/index.html");
});

test("cities", async () => {
  await loadCities("http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2017/13.html");
});
test("county", async () => {
  await loadCounties("http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2017/14/1407.html");
});
test("town", async () => {
  await loadTowns("http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2017/14/07/140725.html");
});
test("vellages", async () => {
  await loadVillages("http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2017/14/07/25/140725200.html");
});
