# openVINO development docs

This version of the docs is provided for the sole purpose of developing and testing new features for the site. 


## Installation of dependencies

It has a minimum of dependencies:

1. Python 3.8 or better
2. Sphinx
3. pydata-sphinx-theme

Assuming Python is already installed, install the remaining dependencies with ``pip`` or ``pip3``:

``` bash
pip install -r requirements.txt
```

## Build the docs

Build the docs like this:

``` bash
sphinx-build -b html . _build/html
```

The resulting files can be found in: ``_build/html``.

## Adding functionality

Add files anywhere in the ``_static`` directory.

You can add references to these files in the ``HTML`` output by adding code to the ``conf.py`` in the ``def setup(app)`` method. Note that these references will appear in every single output file for the site and that they are copied to the correct location in the output.

CSS and JavaScript references are added like this (paths are relative to the ``_static`` directory):

``` python
def setup(app):
    app.add_css_file('css/custom.css')
    app.add_js_file('js/custom.js')
```

To add raw ``HTML`` to a ``.rst`` document add a directive:

``` rest
.. raw:: html

    <div class="chart-block" data-loadcsv="csv/bert-base-cased124.csv"></div>
```

While, it is possible to add ``script`` tags in a raw directive, you'll have to copy the referenced file to the correct place in the output manually.

**NOTE**: Like Python, reStructuredText (.rst) is very sensitive to leading spaces/indents. We prefer to use four spaces per indent rather than tabs.