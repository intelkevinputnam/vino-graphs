.. index:: pair: page; Intel® Distribution of OpenVINO™ toolkit Benchmark Results
.. _doxid-openvino_docs_performance_benchmarks_openvino:


Intel® Distribution of OpenVINO™ toolkit Benchmark Results
=============================================================

This benchmark setup includes a single machine on which both the benchmark application and the OpenVINO™ installation reside.

The benchmark application loads the OpenVINO™ Runtime and executes inferences on the specified hardware (CPU, GPU or VPU). The benchmark application measures the time spent on actual inferencing (excluding any pre or post processing) and then reports on the inferences per second (or Frames Per Second). For more information on the benchmark application, please also refer to the entry 5 of the FAQ section doxid-openvino_docs_performance_benchmarks_faq.

Measuring inference performance involves many variables and is extremely use-case and application dependent. We use the below four parameters for measurements, which are key elements to consider for a successful deep learning inference application:

.. raw:: html

    <div class="picker-options">
      <span class="selectable option throughput selected" data-option="throughput">
        Throughput
      </span>
      <span class="selectable option value" data-option="value">
        Value
      </span>
      <span class="selectable option efficiency" data-option="efficiency">
        Efficiency
      </span>
      <span class="selectable option latency" data-option="latency">
        Latency
      </span>
      <p class="selectable throughput selected">
        Measures the number of inferences delivered within a latency threshold. (for example, number of Frames Per Second - FPS). When deploying a system with deep learning inference, select the throughput that delivers the best trade-off between latency and power for the price and performance that meets your requirements.
      </p>
      <p class="selectable value">
        While throughput is important, what is more critical in edge AI deployments is the performance efficiency or performance-per-cost. Application performance in throughput per dollar of system cost is the best measure of value.
      <p class="selectable efficiency">
        System power is a key consideration from the edge to the data center. When selecting deep learning solutions, power efficiency (throughput/watt) is a critical factor to consider. Intel designs provide excellent power efficiency for running deep learning workloads.
      <p class="selectable latency">
        This measures the synchronous execution of inference requests and is reported in milliseconds. Each inference request (for example: preprocess, infer, postprocess) is allowed to complete before the next is started. This performance metric is relevant in usage scenarios where a single image input needs to be acted upon as soon as possible. An example would be the healthcare sector where medical personnel only request analysis of a single ultra sound scanning image or in real-time or near real-time applications for example an industrial robot's response to actions in its environment or obstacle avoidance for autonomous vehicles.
      </p>
    </div>

Platform & Configurations
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
For a listing of all platforms and configuration sused for testing, refer to the following: 


.. raw:: html

    <container class="platform-configurations">
      <div>
        <a href="google.com" class="pdf"><img src="_static/css/media/pdf-icon.svg"/>Hardware Platforms (PDF)</a>
        <a href="google.com" class="xls"><img src="_static/css/media/xls-icon.svg"/>Configuration Details (XLS)</a>
      </div>
    </container>
    <section class="build-benchmark-section">
      <h3>Build benchmark graphs to your specifications</h3>
      <img src="_static/images/sample-graph-image.png" class="sample-graph-image">
      <button id="build-graphs-btn" class="configure-graphs-btn">Configure Graphs</button>
    </section>



Disclaimers
~~~~~~~~~~~

Intel® Distribution of OpenVINO™ toolkit performance benchmark numbers are based on release 2022.1.

Intel technologies’ features and benefits depend on system configuration and may require enabled hardware, software or service activation. Learn more at intel.com, or from the OEM or retailer. Performance results are based on testing as of March 17, 2022 and may not reflect all publicly available updates. See configuration disclosure for details. No product can be absolutely secure.

Performance varies by use, configuration and other factors. Learn more at `www.intel.com/PerformanceIndex <https://www.intel.com/PerformanceIndex>`__.

Your costs and results may vary.

Intel optimizations, for Intel compilers or other products, may not optimize to the same degree for non-Intel products.

© Intel Corporation. Intel, the Intel logo, and other Intel marks are trademarks of Intel Corporation or its subsidiaries. Other names and brands may be claimed as the property of others.
