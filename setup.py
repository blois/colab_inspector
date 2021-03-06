import os

from setuptools import find_packages
from setuptools import setup

setup(
    name='google-colab-inspector',
    version='0.0.1a1',
    author='blois',
    author_email='github@blois.us',
    description='Inspector for Google Colaboratory',
    long_description='Inspector for Google Colaboratory.',
    url='https://github.com/blois/colab_inspector',
    packages=find_packages(where='source', exclude=('tests*',)),
    package_dir={'': 'source'},
    license='Apache 2.0',
    keywords='google colab ipython jupyter',
    classifiers=(
        'Programming Language :: Python :: 2',
        'Programming Language :: Python :: 2.7',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: Apache Software License',
        'Operating System :: POSIX',
        'Operating System :: Microsoft :: Windows',
        'Operating System :: MacOS :: MacOS X',
        'Operating System :: OS Independent',
        'Topic :: Internet :: WWW/HTTP',
    ),
    include_package_data=True,
    package_data={
        'inspector': [
            'resources/inspector.bundle.js',
            'resources/inspector.css',
        ],
    },
    install_requires=[
        'ipykernel',
        'google-auth',
        'google-cloud-bigquery',
        'portpicker',
        'requests',
        'six',
    ],
    extras_require={
        "tests": [
            "pytest",
            "six",
            "numpy",
        ],
    }
)
