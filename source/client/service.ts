import {Path, Spec} from './specs';
import {SpecJson} from './specs_json';

export async function getSpecs(paths: Path[]): Promise<Spec[]> {
  const rawPaths = paths.map((path) => path.toString());

  const result = await google.colab.kernel.invokeFunction(
      'inspect.create_specification_for_js', [rawPaths], {});
  if (result.status !== 'ok') {
    throw new Error(result.ename);
  }

  const data = result.data;
  const specJson = data['application/json'] as SpecJson[];
  return specJson.map((json, index) => Spec.create(paths[index], json));
}
