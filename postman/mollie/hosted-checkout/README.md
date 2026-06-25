## Introduction ##
This Postman Collection aids in integrating [Mollie](https://docs.mollie.com/) into the Open Payment Framework (OPF) using Mollie's [Hosted Checkout](https://docs.mollie.com/reference/create-payment) (the shopper is redirected to Mollie's hosted payment page and returned to the merchant on completion).

The integration supports:

* Authorization of Mollie payments using the OPF "Full Page" (Hosted Checkout) UX pattern
* Settlement (manual capture)
* Refund
* Reversal


### In summary ###
In summary, to import the [Postman Collection](mapping_configuration.json), this page will guide you through the following steps:

a) Create your Mollie test account.

b) Create a Mollie payment integration in OPF.

c) Get the credentials for your Mollie integration.

d) Prepare the [Postman Environment](environment_configuration.json) file so the collection can be imported with all your OPF Tenant and Mollie Test Account unique values.


### Creating a Mollie Account ###
You can sign up for a free Mollie test account at https://www.mollie.com/dashboard/signup


### Creating a Mollie Payment Integration ###
Create a Mollie payment integration in the OPF workbench. For reference, see [Creating Payment Integration
](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/3580ff1b17144b8780c055bbb7c2bed3/20a64f954df1425391757759011e7e6b.html).


### Get the credentials for your Mollie integration ###

After logging in to the [Mollie Dashboard](https://my.mollie.com/dashboard/), open **Developers → API keys** (<https://my.mollie.com/dashboard/developers/api-keys>).

Mollie uses a single API key for server-to-server calls. Test mode keys have the prefix **``test_``** and live mode keys have the prefix **``live_``**. Use your **test** key while validating the integration.


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

**4. API key**

The API key you obtained from the Mollie Dashboard (prefix ``test_`` for test mode, ``live_`` for live mode) is needed for the following field:

* ``authentication_outbound_api_key_value_export_1084``

**5. Mollie API host and version**

These are pre-set and do not normally need to change:

* ``mollieApiHost`` — ``api.mollie.com`` (same host for test and live; the mode is determined by the API key)
* ``apiVersion`` — ``v2``


### Allowlist
Add the following domain to the egress allowlist in the OPF workbench, otherwise OPF cannot make the server-to-server calls to Mollie (create-payment, verify, capture, refund, cancel). For instructions, see [Adding Tenant-specific Domain to Allowlist
](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/3580ff1b17144b8780c055bbb7c2bed3/a6836485b4494cfaad4033b4ee7a9c64.html).

``api.mollie.com`` for both production and test accounts.

> Note: the redirect to Mollie's hosted checkout page (``www.mollie.com``) happens in the shopper's browser, not from OPF, so it does **not** need to be allowlisted — only the ``api.mollie.com`` host does.


### Summary

The environment file is now ready for importing into Postman together with the Mapping Configuration Collection file. Ensure you select the correct environment before running the collection.

In summary, you should have edited the following variables:

#### Common
- ``token``
- ``rootUrl``
- ``accountGroupId``
- ``accountId``

#### Mollie Specific
- ``authentication_outbound_api_key_value_export_1084``
