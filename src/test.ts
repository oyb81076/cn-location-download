import { of } from "rxjs";
import { mergeMap, retry } from "rxjs/operators";

of(1)
  .pipe(mergeMap(() => {
    console.log("trigger");
    return new Promise((_, j) => {
      j(new Error("err"));
    });
  }))
  .pipe(retry(3))
  .subscribe();
