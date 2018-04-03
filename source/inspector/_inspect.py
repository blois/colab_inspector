"""Inspector.
"""
import json
import IPython
import google.colab.output
from google.colab.output import _js
import uuid

_root = {}

_post_execute_hook = None

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
      inspectSpec('{id}', {spec}, true);
    </script>
  '''.format(id=object_id, spec=_create_spec_for(target))))

def watch_globals():
  user_globals = IPython.get_ipython().user_global_ns
  _root['user_global_ns'] = user_globals

  _js.register_callback('inspect.create_specification_for_js',
                           create_specification_for_js)
  display(IPython.display.HTML('''
    <link rel='stylesheet' href='/nbextensions/google.colab.labs.inspector/inspector.css'>
    <script src='/nbextensions/google.colab.labs.inspector/inspector.bundle.js'></script>
    <script>
      inspectSpec('user_global_ns', {spec}, false);
    </script>
  '''.format(spec=json.dumps(_create_spec_for(user_globals, include_private=False, filter_global_ns=True)))))

  global _post_execute_hook
  if not _post_execute_hook:
    _post_execute_hook = _refresh_watchers
    IPython.get_ipython().events.register('post_run_cell', _post_execute_hook)

def _refresh_watchers():
  display(IPython.display.HTML('''<script>
    (() => {
      const frames = window.parent.frames;
      for (let i = 0; i < frames.length; ++i) {
        try {
          const frame = frames[i];
          if (frame.window.refreshInspector) {
              frame.window.refreshInspector('user_global_ns');
          }
        } catch(e) {}
      }
    })();
    </script>'''))

def create_specification_for_js(paths):
  """Creates a type specification for JS consumption.

  Args:
    paths: the variable paths to be evaluated.

  Returns:
    The JSON display object to be returned to JS.
  """
  specs = []
  for path in paths:
    try:
      specs.append(create_specification(path, _root))
    except AttributeError as e:
      specs.append(_create_error_spec(e))
    except BaseException as e:  # pylint: disable=broad-except
      specs.append(_create_error_spec(e))

  return IPython.display.JSON(specs)


def _create_error_spec(exception):
  return {
      'type': 'error',
      'spec_type': 'error',
      'error': str(exception),
  }

_GLOBALS = [
  'user_global_ns',
]

def create_specification(path, namespace):
  target = eval(path, namespace)  # pylint: disable=eval-used
  is_global_ns = path in _GLOBALS
  return _create_spec_for(target, include_private=(not is_global_ns), filter_global_ns=is_global_ns)


_PRIMITIVE_TYPES = [
    'bool',
    'int',
    'str',
    'NoneType',
]


def _create_spec_for(item, preload=False, include_private=True, filter_global_ns=False):
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

  if item_type == 'list':
    _fill_list_spec(item, spec, preload=preload)
  elif item_type == 'tuple':
    _fill_tuple_spec(item, spec, preload=preload)
  elif item_type == 'dict':
    _fill_dict_spec(item, spec, preload=preload, include_private=include_private, filter_global_ns=filter_global_ns)
  elif item_type == 'instancemethod':
    _fill_function_spec(item, spec)
  elif item_type == 'function':
    _fill_function_spec(item, spec)
  elif item_type in _PRIMITIVE_TYPES:
    _fill_primitive_spec(item, spec)
  else:
    _fill_instance_spec(item, spec, preload=preload)

  return spec


def _get_item_type(item):
  item_type = type(item).__name__
  return item_type


def _fill_primitive_spec(item, spec):
  spec['spec_type'] = 'primitive'
  spec['description'] = str(item)


def _fill_instance_spec(item, spec, preload=False):
  """Populates the type specification for an item type.

  Args:
    item: the item to be inspected.
    spec: the specification to be populated.
  """
  spec['spec_type'] = 'instance'
  keys = dir(item)
  spec['length'] = len(keys)

  length = min(0, len(keys)) if preload else min(100, len(keys))
  keys.sort()
  keys.reverse()
  keys = keys[0:length]
  spec['keys'] = keys

  contents = {}
  for key in keys:
    if preload:
      contents[str(key)] = _create_abbreviated_spec(getattr(item, key))
    else:
      contents[str(key)] = _create_spec_for(getattr(item, key), preload=True)
  spec['contents'] = contents
  spec['partial'] = preload

def _fill_function_spec(item, spec):
  """Populates the type specification for a function type.

  Args:
    item: the function to be inspected.
    spec: the specification to be populated.
  """
  spec['spec_type'] = 'function'
  spec['arguments'] = list(item.__code__.co_varnames)
  spec['docs'] = item.__doc__


def _fill_list_spec(item, spec, preload=False):
  """Populates the type specification for a list type.

  Args:
    item: the list to be inspected.
    spec: the specification to be populated.
  """
  _fill_list_or_tuple_spec(item, spec, preload=preload)


def _fill_tuple_spec(item, spec, preload=False):
  """Populates the type specification for a tuple type.

  Args:
    item: the tuple to be inspected.
    spec: the specification to be populated.
  """
  _fill_list_or_tuple_spec(item, spec, preload=preload)


def _fill_list_or_tuple_spec(item, spec, preload=False):
  """Populates the type specification for a list or tuple type.

  Args:
    item: the list to be inspected.
    spec: the specification to be populated.
  """
  spec['spec_type'] = 'list'
  spec['length'] = len(item)
  length = min(10, len(item)) if preload else min(100, len(item))
  items = []
  for i in range(length):
    items.append(_create_abbreviated_spec(item[i]))

  spec['items'] = items
  spec['partial'] = preload

_FILTERED_GLOBAL_NS_ENTRIES = [
  'In',
  'Out',
]

def _fill_dict_spec(item, spec, preload=False, include_private=True, filter_global_ns=False):
  spec['spec_type'] = 'dict'
  keys = item.keys()
  if not include_private:
    keys = [k for k in keys if not k.startswith('_')]
  if filter_global_ns:
    keys = [k for k in keys if not k in _FILTERED_GLOBAL_NS_ENTRIES]

  spec['length'] = len(keys)
  length = min(10, len(keys)) if preload else min(100, len(keys))

  keys.sort()
  keys.reverse()
  keys = keys[0:length]

  contents = {}
  for key in keys:
    if preload:
      contents[str(key)] = _create_abbreviated_spec(item[key])
    else:
      contents[str(key)] = _create_spec_for(item[key], preload=True)
  spec['contents'] = contents
  spec['partial'] = preload



def _create_abbreviated_spec(item):
  item_type = _get_item_type(item)
  spec = {'type': item_type, 'spec_type': 'abbreviated'}

  if item_type in _PRIMITIVE_TYPES:
    _fill_primitive_spec(item, spec)
  elif item_type == 'dict':
    spec['description'] = 'dict({})'.format(len(item.keys()))
  elif item_type == 'list':
    spec['description'] = 'list[{}]'.format(len(item))
  else:
    spec['description'] = str(item)

  return spec
