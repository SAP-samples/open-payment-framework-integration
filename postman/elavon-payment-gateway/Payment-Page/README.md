## Introduction ##
This Postman Collection aids in integrating [Elavon PaymentPage Redirect](https://developer.elavon.com/products/elavon-payment-gateway/v1/redirect-sdk) into the Open Payment Framework (OPF).

The integration supports:

* Authorize card
* Settlement
* Refund
* Reversal

### In summary ###
In summary, to import the [Postman Collection](mapping_configuration.json), this page will guide you through the following steps:

a) Get your Elavon test account.

b) Create a Elavon payment integration in OPF.

c) Get the credentials for your Elavon integration.

d) Prepare the [Postman Environment](environment_configuration.json) file so the collection can be imported with all your OPF Tenant and Elavon Test Account unique values. 

### Get your Elavon Account ###
Please contact the Elavon Support team to obtain test account credentials. 
Their contact details are listed at the bottom of this page: https://developer.elavon.com/products/elavon-payment-gateway/v1/overview

### Creating a Elavon Payment Integration ###
Create a Elavon payment integration in the OPF workbench. For reference, see [Creating Payment Integration
](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/3580ff1b17144b8780c055bbb7c2bed3/20a64f954df1425391757759011e7e6b.html).

In step 6, set the Merchant ID to your ``Merchant Alias``, as provided by the Elavon Support team.

### Get the credentials for your Elavon integration ###

1. EPG's API authenticates using the HTTP BASIC method over secure HTTP using at least Transport Layer Security (TLS) 1.2.
   Integrators receive a set of credentials from the support team; the Merchant Alias (username) and secret key (password) are used for Basic authentication.

2. Webhook configuration
   You need contact support team to set up a webhook that allows EPG to push notifications about transaction events to the OPF notification URL.
You can find the ``Notification URL`` in the ``General Information section`` of OPF workbench.

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

**4. authentication_outbound_basic_auth_username_export_791 and  authentication_outbound_basic_auth_password_export_791**

The ``Merchant Alias`` is for ``authentication_outbound_basic_auth_username_export_791``
and ``secret key`` is for ``authentication_outbound_basic_auth_password_export_791``






### Allowlist
Add the following domains to the domain allowlist in OPF workbench. For instructions, see [Adding Tenant-specific Domain to Allowlist
](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/3580ff1b17144b8780c055bbb7c2bed3/a6836485b4494cfaad4033b4ee7a9c64.html).


``api.eu.convergepay.com`` for production
``uat.api.converge.eu.elavonaws.com`` for test


### Summary

The environment file is now ready for importing into Postman together with the Mapping Configuration Collection file. Ensure you select the correct environment before running the collection.

In summary, you should have edited the following variables: 

#### Common
- ``token``
- ``rootUrl``
- ``accountGroupId``
- ``accountId`` 

#### Elavon Specific
- ``authentication_outbound_basic_auth_username_export_791``
- ``authentication_outbound_basic_auth_password_export_791``
  
