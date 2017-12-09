import {Path, Spec} from './specs';
import {SpecJson} from './specs_json';

export async function getSpecs(paths: Path[]): Promise<Spec[]> {
  const rawPaths = paths.map((path) => path.toString());

  return [];

  // const result = await colab.output.invokeKernelFunction(
  //     'inspect.create_specification_for_js', [rawPaths], {});
  // if (result.status !== 'ok') {
  //   throw new Error(result.ename);
  // }

  // const data = result.data;
  // const json = data['application/json'] as string;
  // const specJson = JSON.parse(json) as SpecJson[];
  // return specJson.map((json, index) => Spec.create(paths[index], json));
}
