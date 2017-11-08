# CARMIN

A common web API for remote pipeline execution.

## Documentation

* [OpenAPI](https://www.openapis.org) specification: see `carmin.yaml`.
* [Available on Swagger Hub](https://swaggerhub.com/apis/CARMIN/carmin-common_api_for_research_medical_imaging_network/0.3).
* [Abstract at 2015 INCF conference](http://www.frontiersin.org/10.3389/conf.fnins.2015.91.00053/event_abstract)

## How to contribute

* Join the [mailing list](mailto:carmin@googlegroups.com)
* Join the [next teleconference](https://docs.google.com/document/d/1FxXotSyllT-2KDfpDSgGbgUgXBK-jKryhiLFMcq-DWs/edit)

## Deprecated

* [Specification (working document)](https://docs.google.com/document/d/1qVSDLWs8cLJ59sIQI1Av5EA5_yrSAWSqRDywwlu-pmI/edit?usp=sharing). Deprecated by the OpenAPI specification but still contains useful comments.
* Implementation in SOAP: see `api.wsdl`.

## Note

Considering the REST or Richardson Maturity Model (RMM) defined by Leonard Richardson
(please see http://martinfowler.com/articles/richardsonMaturityModel.html) the current
implementation of the CARMIN REST API is considered as level 2 implementation.
Considering that the HATEOAS aspect of an API can be quite helpful, to reach the next
maturity level will be considered in the next evolutions of the CARMIN REST API.
