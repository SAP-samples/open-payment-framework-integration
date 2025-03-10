## Introduction ##
This Postman Collection aids in integrating [GoCardless](https://gocardless.com/) into the Open Payment Framework (OPF).

The integration supports:

* Direct Debit Payments using Hosted Page
* Settlement - Delayed Capture Pattern
* Refund
* Reauthorization


### In summary ###
In summary, to import the [Postman Collection](mapping_configuration.json), this page will guide you through the following steps:

a) [Create your GoCardless Sandbox account](https://manage-sandbox.gocardless.com/sign-up).

b) Create a GoCardless payment integration in OPF.

c) Get the credentials for your GoCardless integration.

d) Prepare the [Postman Environment](environment_configuration.json) file so the collection can be imported with all your OPF Tenant and GoCardless Sandbox Account unique values. 

### Creating a GoCardless Sandbox Account ###
You can sign up for a free GoCardless Sandbox account [here](https://manage-sandbox.gocardless.com/sign-up).


### Creating a GoCardless Payment Integration ###
Create a GoCardless payment integration in the OPF workbench. For reference, see [Creating Payment Integration
](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/3580ff1b17144b8780c055bbb7c2bed3/20a64f954df1425391757759011e7e6b.html).

**Note**:

The Merchant ID is the Organisation Name you add when [Onboarding your brand](https://manage-sandbox.gocardless.com/onboarding/brand)


### Setting up Your GoCardless Sandbox Account to work with OPF ###
Once you have created you GoCardless Sandbox account, do the following to set it up to work with OPF:
2. Navigate to Developers -> Developers -> Create -> Webhook Secret



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

* ``integrationId`` maps to ``accountGroupId`` in postman
* ``configurationId`` maps to ``accountId`` in postman

**4. accessToken**
In The GoCardless Dashboard,  navigate to Developers -> Developers -> Create -> Access Token with Read/Write Access

**5. webhookSecret**

From OPF copy the Notification URL from the General Section of your new created GoCardless Configuration.
In The GoCardless Dashboard,  navigate to Developers -> Developers -> Create -> Webhook
Set the Notification URL, a meaningful name and a cryptographically secure secret.

Use the same secret to set the ``webhookSecret`` value.


**6. GoCardlessWebDomain**

This element aims to point to the location of Javascript file for both the sandbox and production environments. Below are the possible values of this element:

``pay.gocardless.com`` for production script element

``pay-sandbox.gocardless.com`` for sandbox script element

**7. apiEndpoint**

``api.gocardless.com`` for production api

``api-sandbox.gocardless.com`` for sandbox api



### Allowlist
Add the following domains to the domain allowlist in OPF workbench. For instructions, see [Adding Tenant-specific Domain to Allowlist
](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/3580ff1b17144b8780c055bbb7c2bed3/a6836485b4494cfaad4033b4ee7a9c64.html).


``api.gocardless.com`` for production account

``api-sandbox.gocardless.com`` for test account


### Summary

The environment file is now ready for importing into Postman together with the Mapping Configuration Collection file. Ensure you select the correct environment before running the collection.

In summary, you should have edited the following variables: 

#### Common
- ``token``
- ``rootUrl``
- ``accountGroupId``
- ``accountId`` 

#### GoCardless Specific
- ``accessToken``
- ``webhookSecret``
- ``GoCardlessWebDomain``
- ``apiEndpoint``
  
