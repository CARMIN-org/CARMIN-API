# CARMIN

A common web API for remote pipeline execution:

* [Specification and documentation](https://docs.google.com/document/d/1qVSDLWs8cLJ59sIQI1Av5EA5_yrSAWSqRDywwlu-pmI/edit?usp=sharing)
* Implementation in SOAP: see `api.wsdl`.
* Implementation in REST: see `carmin.yaml`.
* [Abstract at 2015 INCF conference](http://www.frontiersin.org/10.3389/conf.fnins.2015.91.00053/event_abstract)

Considering the REST or Richardson Maturity Model (RMM) defined by Leonard Richardson
(please see http://martinfowler.com/articles/richardsonMaturityModel.html) the current
implementation of the CARMIN REST API is considered as level 2 implementation.
Considering that the HATEOAS aspect of an API can be quite helpful, to reach the next
maturity level will be considered in the next evolutions of the CARMIN REST API.
