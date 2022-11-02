..
   _ Changes to this title must require changes to custom.css as styling will 
   _ be lost (rst renders the title as an id that is used in a css selector #performance-information-frequently-asked-questions)

Performance Information Frequently Asked Questions
==================================================

The following questions and answers are related to published
`performance benchmarks <./performance_benchmarks.md>`__.

How often do performance benchmarks get updated?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

New performance benchmarks are typically published on every
``major.minor`` release of the Intel® Distribution of OpenVINO™ toolkit.

Where can I find the models used in the performance benchmarks?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

All models used are included in the GitHub repository of `Open
Model Zoo <https://github.com/openvinotoolkit/open_model_zoo>`__.

Will there be any new models added to the list used for benchmarking?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The models used in the performance benchmarks were chosen based
on general adoption and usage in deployment scenarios. New models that
support a diverse set of workloads and usage are added periodically.

What does “CF” or “TF” in the graphs stand for?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The “CF” means “Caffe”, and “TF” means “TensorFlow”.

How can I run the benchmark results on my own?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

All of the performance benchmarks were generated using the
open-source tool within the Intel® Distribution of OpenVINO™ toolkit
called ``benchmark_app``. This tool is available in both
`C++ <../../samples/cpp/benchmark_app/README.md>`__ and
`Python <../../tools/benchmark_tool/README.md>`__.

What image sizes are used for the classification network models?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The image size used in inference depends on the benchmarked
network. The table below presents the list of input sizes for each
network model:


.. list-table::
   :header-rows: 1

   * - Model
     - Public Network
     - Task
     - Input Size (Height x Width)
   * - `bert-base-cased <https://github.com/PaddlePaddle/PaddleNLP/tree/v2.1.1>`_
     - BERT
     - question / answer
     - 124
   * - `bert-large-uncased-whole-word-masking-squad-int8-0001 <https://github.com/openvinotoolkit/open_model_zoo/tree/master/models/intel/bert-large-uncased-whole-word-masking-squad-int8-0001>`_
     - BERT-large
     - question / answer
     - 384
   * - `bert-small-uncased-whole-masking-squad-0002 <https://github.com/openvinotoolkit/open_model_zoo/tree/master/models/intel/bert-small-uncased-whole-word-masking-squad-0002>`_
     - BERT-small
     - question / answer
     - 384
   * - `brain-tumor-segmentation-0001-MXNET <https://github.com/openvinotoolkit/open_model_zoo/tree/master/models/public/brain-tumor-segmentation-0001>`_
     - brain-tumor-segmentation-0001
     - semantic segmentation
     - 128x128x128
   * - `brain-tumor-segmentation-0002-CF2 <https://github.com/openvinotoolkit/open_model_zoo/tree/master/models/public/brain-tumor-segmentation-0002>`_
     - brain-tumor-segmentation-0002
     - semantic segmentation
     - 128x128x128
   * - `deeplabv3-TF <https://github.com/openvinotoolkit/open_model_zoo/tree/master/models/public/deeplabv3>`_
     -  DeepLab v3 Tf
     - semantic segmentation
     - 513x513
   * - `densenet-121-TF <https://github.com/openvinotoolkit/open_model_zoo/tree/master/models/public/densenet-121-tf>`_
     - Densenet-121 Tf
     - classification
     - 224x224
   * - `efficientdet-d0 <https://github.com/openvinotoolkit/open_model_zoo/tree/master/models/public/efficientdet-d0-tf>`_
     - Efficientdet
     - classification
     - 512x512
   * - `facenet-20180408-102900-TF <https://github.com/openvinotoolkit/open_model_zoo/tree/master/models/public/facenet-20180408-102900>`_
     - FaceNet TF
     - face recognition
     - 160x160
   * - `Facedetection0200 <https://github.com/openvinotoolkit/open_model_zoo/tree/master/models/intel/face-detection-0200>`_
     - FaceDetection0200
     - detection
     - 256x256 |
   * - `faster_rcnn_resnet50_coco-TF <https://github.com/openvinotoolkit/open_model_zoo/tree/master/models/public/faster_rcnn_resnet50_coco>`_
     - Faster RCNN Tf
     - object detection
     - 600x1024
   * - `forward-tacotron-duration-prediction <https://github.com/openvinotoolkit/open_model_zoo/tree/master/models/public/forward-tacotron>`_
     - ForwardTacotron
     - text to speech
     - 241
   * - `inception-v4-TF <https://github.com/openvinotoolkit/open_model_zoo/tree/master/models/public/googlenet-v4-tf>`_
     - Inception v4 Tf (aka GoogleNet-V4)
     - classification
     - 299x299
   * - `inception-v3-TF <https://github.com/openvinotoolkit/open_model_zoo/tree/master/models/public/googlenet-v3>`_
     - Inception v3 Tf
     - classification
     - 299x299
   * - `mask_rcnn_resnet50_atrous_coco <https://github.com/openvinotoolkit/open_model_zoo/tree/master/models/public/mask_rcnn_resnet50_atrous_coco>`_
     - Mask R-CNN ResNet50 Atrous
     - instance segmentation
     - 800x1365
   * - `mobilenet-ssd-CF <https://github.com/openvinotoolkit/open_model_zoo/tree/master/models/public/mobilenet-ssd>`_
     - SSD (MobileNet)_COCO-2017_Caffe
     - object detection
     - 300x300
   * - `mobilenet-v2-1.0-224-TF <https://github.com/openvinotoolkit/open_model_zoo/tree/master/models/public/mobilenet-v2-1.0-224>`_
     - MobileNet v2 Tf
     - classification
     - 224x224
   * - `mobilenet-v2-pytorch <https://github.com/openvinotoolkit/open_model_zoo/tree/master/models/public/mobilenet-v2-pytorch>`_
     - Mobilenet V2 PyTorch
     - classification
     - 224x224
   * - `Mobilenet-V3-small <https://github.com/openvinotoolkit/open_model_zoo/tree/master/models/public/mobilenet-v3-small-1.0-224-tf>`_
     - Mobilenet-V3-1.0-224
     - classifier
     - 224x224
   * - `Mobilenet-V3-large <https://github.com/openvinotoolkit/open_model_zoo/tree/master/models/public/mobilenet-v3-large-1.0-224-tf>`_
     - Mobilenet-V3-1.0-224
     - classifier
     - 224x224
   * - `pp-ocr-rec <https://github.com/PaddlePaddle/PaddleOCR/tree/release/2.1/>`_
     - PP-OCR
     - optical character recognition
     - 32x640
   * - `pp-yolo <https://github.com/PaddlePaddle/PaddleDetection/tree/release/2.1>`_
     - PP-YOLO
     - detection
     - 640x640
   * - `resnet-18-pytorch <https://github.com/openvinotoolkit/open_model_zoo/tree/master/models/public/resnet-18-pytorch>`_
     - ResNet-18 PyTorch
     - classification
     - 224x224
   * - `resnet-50-pytorch <https://github.com/openvinotoolkit/open_model_zoo/tree/master/models/public/resnet-50-pytorch>`_
     - ResNet-50 v1 PyTorch
     - classification
     - 224x224
   * - `resnet-50-TF <https://github.com/openvinotoolkit/open_model_zoo/tree/master/models/public/resnet-50-tf>`_
     - ResNet-50_v1_ILSVRC-2012
     - classification
     - 224x224
   * - `yolo_v4-TF <https://github.com/openvinotoolkit/open_model_zoo/tree/master/models/public/yolo-v4-tf>`_
     - Yolo-V4 TF
     -  object detection
     - 608x608
   * - `ssd_mobilenet_v1_coco-TF <https://github.com/openvinotoolkit/open_model_zoo/tree/master/models/public/ssd_mobilenet_v1_coco>`_
     - ssd_mobilenet_v1_coco
     - object detection
     - 300x300
   * - `ssdlite_mobilenet_v2-TF <https://github.com/openvinotoolkit/open_model_zoo/tree/master/models/public/ssdlite_mobilenet_v2>`_
     - ssdlite_mobilenet_v2
     - object detection
     - 300x300
   * - `unet-camvid-onnx-0001 <https://github.com/openvinotoolkit/open_model_zoo/tree/master/models/intel/unet-camvid-onnx-0001>`_
     - U-Net
     - semantic segmentation
     - 368x480
   * - `yolo-v3-tiny-tf <https://github.com/openvinotoolkit/open_model_zoo/tree/master/models/public/yolo-v3-tiny-tf>`_
     - YOLO v3 Tiny
     - object detection
     - 416x416
   * - `yolo-v3 <https://github.com/openvinotoolkit/open_model_zoo/tree/master/models/public/yolo-v3-tf>`_
     - YOLO v3
     - object detection
     - 416x416
   * - `ssd-resnet34-1200-onnx <https://github.com/openvinotoolkit/open_model_zoo/tree/master/models/public/ssd-resnet34-1200-onnx>`_
     - ssd-resnet34 onnx model
     - object detection
     - 1200x1200

Where can I purchase the specific hardware used in the benchmarking?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Intel partners with vendors all over the world. For a list of
Hardware Manufacturers, see the `Intel® AI: In Production Partners &
Solutions
Catalog <https://www.intel.com/content/www/us/en/internet-of-things/ai-in-production/partners-solutions-catalog.html>`__
. For more details, see the `Supported
Devices <../OV_Runtime_UG/supported_plugins/Supported_Devices.md>`__
documentation. Before purchasing any hardware, you can test and run
models remotely, using `Intel® DevCloud for the
Edge <http://devcloud.intel.com/edge/>`__.

How can I optimize my models for better performance or accuracy?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Set of guidelines and recommendations to optimize models are
available in the `optimization
guide <../optimization_guide/dldt_optimization_guide.md>`__. Join the
conversation in the `Community
Forum <https://software.intel.com/en-us/forums/intel-distribution-of-openvino-toolkit>`__
for further support.

Why are INT8 optimized models used for benchmarking on CPUs with no VNNI support?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The benefit of low-precision optimization using the OpenVINO™
toolkit model optimizer extends beyond processors supporting VNNI
through Intel® DL Boost. The reduced bit width of INT8 compared to FP32
allows Intel® CPU to process the data faster. Therefore, it offers
better throughput on any converted model, regardless of the
intrinsically supported low-precision optimizations within Intel®
hardware. For comparison on boost factors for different network models
and a selection of Intel® CPU architectures, including AVX-2 with Intel®
Core™ i7-8700T, and AVX-512 (VNNI) with Intel® Xeon® 5218T and Intel®
Xeon® 8270, refer to the `Model Accuracy for INT8 and FP32
Precision <performance_int8_vs_fp32.md>`__ article.

Where can I search for OpenVINO™ performance results based on HW-platforms?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The website format has changed in order to support more common
approach of searching for the performance results of a given neural
network model on different HW-platforms. As opposed to reviewing
performance of a given HW-platform when working with different neural
network models.

How is Latency measured?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Latency is measured by running the OpenVINO™ Runtime in
synchronous mode. In this mode, each frame or image is processed through
the entire set of stages (pre-processing, inference, post-processing
>`_
before the next frame or image is processed. This KPI is relevant for
applications where the inference on a single image is required. For
example, the analysis of an ultra sound image in a medical application
or the analysis of a seismic image in the oil & gas industry. Other use
cases include real or near real-time applications, e.g. the response of
industrial robot to changes in its environment and obstacle avoidance
for autonomous vehicles, where a quick response to the result of the
inference is required.
