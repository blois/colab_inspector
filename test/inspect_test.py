"""Tests that inspector loads."""

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import pytest
import json
import unittest
import inspector._inspect as inspector


class InspectorLoadsTest(unittest.TestCase):

  def test_inspect_primitive_list(self):
    spec = inspector._create_spec_for([1, 2])
    assert spec['spec_type'] == 'list'
    items = spec['items']
    assert len(items) == 2

    assert items[0]['spec_type'] == 'primitive'
    assert items[0]['type'] == 'int'

  def test_inspect_complex_list(self):
    item = {'x': {'y': 'z'}}
    spec = inspector._create_spec_for([item])
    assert spec['spec_type'] == 'list'
    items = spec['items']
    assert len(items) == 1

    assert items[0]['spec_type'] == 'abbreviated'
    assert items[0]['type'] == 'dict'
    assert items[0]['description'] == "dict(1)"

  def test_inspect_dict(self):
    spec = inspector._create_spec_for({'x': {'y': 'z'}})
    assert spec['spec_type'] == 'dict'

    x = spec['contents']['x']
    assert x['spec_type'] == 'abbreviated'
    assert x['type'] == 'dict'