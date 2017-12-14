"""Inspector.
"""
import json
import IPython
import google.colab.output
from google.colab.output import _js
import uuid
import traceback

_root = {}

def inspect(target):
  """Displays an interactive inspector for the given object.

  Args:
    target: the object to be inspected.
  """

  _js.register_callback('inspect.create_specification_for_js',
                           create_specification_for_js)

  object_id = 'id_%s' % str(uuid.uuid4()).replace('-', '_')
  _root[object_id] = target

  display(IPython.display.HTML('''
    <link rel='stylesheet' href='/nbextensions/google.colab.labs.inspector/inspector.css'>
    <script src='/nbextensions/google.colab.labs.inspector/inspector.bundle.js'></script>
    <script>
      inspect('{id}');
    </script>
  '''.format(id=object_id)))


def create_specification_for_js(paths):
  """Creates a type specification for JS consumption.

  Args:
    paths: the variable paths to be evaluated.

  Returns:
    The JSON display object to be returned to JS.
  """
  print('paths: %s' % (paths));
  specs = []
  for path in paths:
    try:
      specs.append(create_specification(path, _root))
    except AttributeError as e:
      specs.append(_create_error_spec(e))
    except BaseException as e:  # pylint: disable=broad-except
      display(e)
      traceback.print_exc()
      specs.append(_create_error_spec(e))

  return IPython.display.JSON(specs)


def _create_error_spec(exception):
  return {
      'type': 'error',
      'spec_type': 'error',
      'error': str(exception),
  }

def create_specification(path, namespace):
  target = eval(path, namespace)  # pylint: disable=eval-used

  return _create_spec_for(target)


_PRIMITIVE_TYPES = [
    'bool',
    'int',
    'str',
    'NoneType',
]


def _create_spec_for(item):
  """Creates a type specification for an arbitrary Python object.

  Args:
    item: the item to be inspected.

  Returns:
    The item specification.
  """
  item_type = _get_item_type(item)

  spec = {
      'type': item_type,
  }

  spec_type = item_type
  if item_type == 'list':
    _fill_list_spec(item, spec)
  elif item_type == 'dict':
    _fill_dict_spec(item, spec)
  elif item_type == 'instancemethod':
    spec_type = 'function'
    _fill_function_spec(item, spec)
  elif item_type == 'function':
    _fill_function_spec(item, spec)
  elif item_type in _PRIMITIVE_TYPES:
    spec_type = 'primitive'
    _fill_primitive_spec(item, spec)
  else:
    spec_type = 'instance'
    _fill_instance_spec(item, spec)

  spec['spec_type'] = spec_type

  return spec


def _get_item_type(item):
  item_type = type(item).__name__
  return item_type


def _fill_primitive_spec(item, spec):
  spec['string'] = str(item)


def _fill_list_spec(item, spec):
  """Populates the type specification for a list type.

  Args:
    item: the list to be inspected.
    spec: the specification to be populated.
  """
  spec['length'] = len(item)
  length = min(10, len(item))
  items = []
  for i in range(length):
    items.append(_create_spec_for(item[i]))

  spec['items'] = items


def _fill_instance_spec(item, spec):
  """Populates the type specification for an item type.

  Args:
    item: the item to be inspected.
    spec: the specification to be populated.
  """
  keys = dir(item)
  spec['keys'] = keys
  spec['length'] = len(keys)


def _fill_function_spec(item, spec):
  """Populates the type specification for a function type.

  Args:
    item: the function to be inspected.
    spec: the specification to be populated.
  """
  spec['arguments'] = list(item.__code__.co_varnames)
  spec['docs'] = item.__doc__


def _fill_dict_spec(item, spec):
  keys = item.keys()
  contents = {}
  for key in keys:
    contents[key] = _create_abbreviated_spec(str(key), item[key])
  spec['contents'] = contents
  spec['length'] = len(keys)


def _create_abbreviated_spec(key, item):
  item_type = _get_item_type(item)
  description = key
  if item_type == 'int' or item_type == 'str':
    description = str(item)
  spec = {'type': item_type, 'description': description}
  return spec
