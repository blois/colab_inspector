from inspector._inspect import inspect, watch_globals

__all__ = ['inspect', 'watch_globals']

def _jupyter_nbextension_paths():
  # See:
  # http://testnb.readthedocs.io/en/latest/examples/Notebook/Distributing%20Jupyter%20Extensions%20as%20Python%20Packages.html#Defining-the-server-extension-and-nbextension
  return [{
      'dest': 'google.colab.labs.inspector',
      'section': 'notebook',
      'src': 'resources',
  }]
