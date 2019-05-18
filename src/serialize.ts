import { IResult, ISource } from "./faces";
export function serialize(nodes: ISource[]): IResult[] {
  return nodes.map(({ children, data }) => {
    const { code, name } = data!;
    const res: IResult = { code, name };
    if (children) { res.children = serialize(children); }
    return res;
  });
}
