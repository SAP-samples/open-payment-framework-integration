## Introduction

The Postman Collection enables a [BTePOS IPay](https://btepos.ro/e-commerce) Hosted Pahe to be used to take payments through OPF. 

The integration supports:

* Authorization of Card Payments using Hosted Page Pattern
* Deferred Capture (Single Capture per Order)
* Refunds
* Reversal

Roadmap Items
* Native support in OPF for ISO 3166-1 Numeric country codes.


## Setup Instructions

### Overview
To import the [BTePOS IPay Postman Collection](BTePOS_mapping_configuration.json) this page will take you through the following steps

a) Create a payment integration in OPF workbench.
b) Prepare the [Postman Environment](BTePOS_environment_configuration.json) file so the collection can be imported with all your OPF Tenant and BTePOS Test environment unique values. 


### Creating Payment Integration
Create a new payment integration in the OPF workbench and set the Merchant ID. For reference, see [Creating Payment Integration](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/3580ff1b17144b8780c055bbb7c2bed3/20a64f954df1425391757759011e7e6b.html).

The Merchant ID will be provided by BTePOS technical support.


### Preparing the Postman environment_configuration file

**1. Token**

Get your access token by [creating an external app](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/8ccca5bb539a49258e924b467ee4e1c2/d927d21974fe4b368e063f72733bf0fe.html) and [making authorized API calls](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/8ccca5bb539a49258e924b467ee4e1c2/40c792e66e2942209dc853a43533d78d.html).

Copy the value of the access_token field (it’s a JWT) and set as the ``token`` value in the environment file.

IMPORTANT: Ensure the value is prefixed with **Bearer**. e.g. ``Bearer {{token}}``.

**2. Root url**

The ``rootUrl`` is the **BASE URL** of your OPF tenant.

E.g. if your workbench/OPF cockpit url was this …

<https://opf-iss-d0.uis.commerce.stage.context.cloud.sap/opf-workbench>.

The base Url would be

https://opf-iss-d0.uis.commerce.stage.context.cloud.sap.


**3. Integration ID and Configuration ID**

The ``integrationId`` and ``configurationId`` values identify the payment integration and payment integration, which can be found in the top left of your **Configuration Details** page in the OPF workbench.

* ``integrationId`` maps to ``accountGroupId`` in postman
* ``configurationId`` maps to ``accountId`` in postman

**4. API Credentials**

The API requires a username and password to be provided by BTePOS technical support.

* Set the ipay_bt_username **value** for environment variable ``authentication_outbound_basic_auth_username_export_792``
* Set the ipay_bt_password **value** for environment variable ``authentication_outbound_basic_auth_password_export_792``


### Allowlist
Add the following domains to the domain allowlist in OPF workbench. For instructions, see [Adding Tenant-specific Domain to Allowlist
](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/3580ff1b17144b8780c055bbb7c2bed3/a6836485b4494cfaad4033b4ee7a9c64.html).

``ecclients-sandbox.btrl.ro``
``ecclients.btrl.ro``

### Summary

The environment file is now ready for importing into Postman together with the Mapping Configuration Collection file. Ensure you select the correct environment before running the collection.

In summary, you should have edited the following variables: 

#### Common
- ``token``
- ``rootUrl``
- ``accountGroupId``
- ``accountId`` 

#### BTePOS Specific
API Key Configuration
- ``authentication_outbound_basic_auth_username_export_792``
- ``authentication_outbound_basic_auth_password_export_792``


For test environment, all other values can be left as defaults.  

