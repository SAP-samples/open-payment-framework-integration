## Introduction ##
This Postman Collection aids in integrating [Monei](https://docs.monei.com/docs/) into the Open Payment Framework (OPF).

The integration supports:

* Authorization of Monei payments using the OPF "Hosted Payment Page" UX pattern
* Settlement
* Refund
* Reversal
* Reauthorization


### In summary ###
In summary, to import the [Postman Collection](mapping_configuration.json), this page will guide you through the following steps:

a) Create your Monei test account.

b) Create a Monei payment integration in OPF.

c) Get the credentials for your Monei integration.

d) Prepare the [Postman Environment](environment_configuration.json) file so the collection can be imported with all your OPF Tenant and Monei Test Account unique values. 

### Creating a Monei Account ###
You can sign up for a free Monei test account at https://dashboard.monei.com/?action=signUp

### Creating a Monei Payment Integration ###
Create a Monei payment integration in the OPF workbench. For reference, see [Creating Payment Integration
](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/3580ff1b17144b8780c055bbb7c2bed3/20a64f954df1425391757759011e7e6b.html).

### Get the credentials for your Monei integration ###

You will find the credentials after logging in [Monei test account](https://dashboard.monei.com/?action=signIn)
You can view and manage your API key in the [Monei Dashboard](https://dashboard.monei.com/settings/api?_gl=1*1r9xysg*_gcl_au*NDA1NjY1MzMyLjE3MzE1NDc4MDk.).
Test mode private keys have the prefix pk_test_ and live mode private keys have the prefix pk_live_.


### Preparing the Postman environment_configuration file ###

**1. Token**

Get your access token by [creating an external app](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/8ccca5bb539a49258e924b467ee4e1c2/d927d21974fe4b368e063f72733bf0fe.html) and [making authorized API calls](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/8ccca5bb539a49258e924b467ee4e1c2/40c792e66e2942209dc853a43533d78d.html).

Copy the value of the access_token field (it’s a JWT) and set as the ``token`` value in the environment file.

**IMPORTANT**: Ensure the value is prefixed with **Bearer**. e.g. ``Bearer {{token}}``.

**2. Root url**

The ``rootUrl`` is the **BASE URL** of your OPF tenant.

E.g. if your workbench/OPF cockpit url was this …

<https://opf-iss-d0.uis.commerce.stage.context.cloud.sap/opf-workbench>.

The base Url would be

https://opf-iss-d0.uis.commerce.stage.context.cloud.sap.


**3. Integration ID and Configuration ID**

The ``integrationId`` and ``configurationId`` values identify the payment integration and payment configuration, which can be found in the top left of your **Configuration Details** page in the OPF workbench.

* ``integrationId`` maps to ``accountGroupId`` in Postman
* ``configurationId`` maps to ``accountId`` in Postman

**4. apikey**

The API keys you obtained from the Monei Dashboard, Which has the prefix "pk_test_" for test mode and "pk_live_" for live mode,
the value is needed for the following fields:

* ``authentication_outbound_api_key_value_export_366``
* ``webHookKey``

**6. apiEnv**

``api.monei.com`` for  both sandbox and production script element


### Allowlist
Add the following domains to the domain allowlist in OPF workbench. For instructions, see [Adding Tenant-specific Domain to Allowlist
](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/3580ff1b17144b8780c055bbb7c2bed3/a6836485b4494cfaad4033b4ee7a9c64.html).


``api.monei.com`` for both  production account and test account


### Summary

The environment file is now ready for importing into Postman together with the Mapping Configuration Collection file. Ensure you select the correct environment before running the collection.

In summary, you should have edited the following variables: 

#### Common
- ``token``
- ``rootUrl``
- ``accountGroupId``
- ``accountId`` 

#### Monei Specific
- ``webHookKey``
- ``authentication_outbound_api_key_value_export_366``
  
