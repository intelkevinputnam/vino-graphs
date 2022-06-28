.. index:: pair: page; Documentation
.. _doxid-documentation:


Documentation
=============


.. toctree::
   :maxdepth: 1
   :caption: Tuning for Performance
   :hidden:

   openvino_docs_performance_benchmarks


This section provides reference documents that guide you through developing your own deep learning applications with the OpenVINO™ toolkit. These documents will most helpful if you have first gone through the guide.

Converting and Preparing Models
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

With the Model Downloader  guides, you will learn to download pre-trained models and convert them for use with the OpenVINO™ toolkit. You can provide your own model or choose a public or Intel model from a broad selection provided in the .

Deploying Inference
~~~~~~~~~~~~~~~~~~~

The  explains the process of creating your own application that runs inference with the OpenVINO™ toolkit. The `API Reference <./api_references.html>`__ defines the OpenVINO Runtime API for Python, C++, and C. The OpenVINO Runtime API is what you'll use to create an OpenVINO™ inference application, use enhanced operations sets and other features. After writing your application, you can use the for deploying to target devices.

Tuning for Performance
~~~~~~~~~~~~~~~~~~~~~~

The toolkit provides a and utilities for squeezing the best performance out of your application, including Accuracy Checker, , and other tools for measuring accuracy, benchmarking performance, and tuning your application.

Graphical Web Interface for OpenVINO™ Toolkit
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

You can choose to use the OpenVINO™ Deep Learning Workbench, a web-based tool that guides you through the process of converting, measuring, optimizing, and deploying models. This tool also serves as a low-effort introduction to the toolkit and provides a variety of useful interactive charts for understanding performance.

Media Processing and Computer Vision Libraries
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The OpenVINO™ toolkit also works with the following media processing frameworks and libraries:

* — A streaming media analytics framework based on GStreamer, for creating complex media analytics pipelines optimized for Intel hardware platforms. Go to the Intel® DL Streamer `documentation <https://dlstreamer.github.io/>`__ website to learn more.

* `Intel® oneAPI Video Processing Library (oneVPL) <https://www.intel.com/content/www/us/en/develop/documentation/oneapi-programming-guide/top/api-based-programming/intel-oneapi-video-processing-library-onevpl.html>`__ — A programming interface for video decoding, encoding, and processing to build portable media pipelines on CPUs, GPUs, and other accelerators.

You can also add computer vision capabilities to your application using optimized versions of `OpenCV <https://opencv.org/>`__.

