import {Path} from './path';
import * as wire from './wire';

export async function getSpec(path: Path): Promise<wire.Spec> {
  const result = await google.colab.kernel.invokeFunction(
      'inspect.create_specification_for_js', [[path.toString()]], {});
  if (result.status !== 'ok') {
    throw new Error(result.ename);
  }
  const specJson = result.data['application/json'] as wire.Spec[];
  return specJson[0];
}