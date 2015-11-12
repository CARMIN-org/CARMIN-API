# Carmin tests

This is a [SOAPUI](http://www.soapui.org/) project to test the conformance of a particular endpoint to the Carmin API.

Contents:
* `Carmin-soapui-project.xml`: the SOAPUI project.
* `Carmin.properties.template`: template for properties file.

# How to use

1. Install [SOAPUI](http://www.soapui.org).
2. Import the Carmin project file (Ctrl-I).
3. Click on the Carmin project.
4. Load the property file in "Custom Properties" (bottom-left tabs).
5. Edit the custom properties (see documentation of properties in the template file).
6. In Carmin TestSuite editor, click the green arrow.

If all the tests succeed, the TestSuite editor should look like this:
![tests]
(./images/tests/png)

# Tests

## General principle

All the methods of the Carmin specification are tested in different
TestSteps that are grouped in consistent TestCases. For instance, the
Execution TestCase includes the following TestSteps: `initExecution`,
`playExecution`, `getExecution`, `updateExecution`, `killExecution`
and `deleteExecution`. Property transfers are used when the result of a
TestStep is used in the request of a subsequent TestStep.

## Authentication

TestCases that require authentication begin
with the Authentication TestCase. The HTTP session is maintained
within a TestCase.

## Assertions

Each TestStep contains 4 assertions testing that:
1. A valid SOAP response is returned;
2. The SOAP response complies to the schema defined in the WSDL;
3. No SOAP fault is returned;
4. The SOAP response contains `<statusCode>0</statusCode>`. 


