## Introduction ##
This Postman Collection aids in integrating [SumUp](https://developer.sumup.com/) into the Open Payment Framework (OPF) using SumUp's [Hosted Checkout](https://developer.sumup.com/online-payments/introduction/hosted-checkout) (the shopper is redirected to SumUp's hosted payment page and returned to the merchant on completion).

The integration supports:

* Authorization of SumUp payments using the OPF "Full Page" (Hosted Checkout) UX pattern
* Refund
* Server-to-server notifications, enriched by an API preprocessor
* Card brand and last-4 capture
* SumUp customer records, created on first use and reused thereafter

It does **not** support settlement or authorization reversal. See [What SumUp does not support](#what-sumup-does-not-support).


### In summary ###
In summary, to import the [Postman Collection](mapping_configuration.json), this page will guide you through the following steps:

a) Create your SumUp sandbox account.

b) Create a SumUp payment integration in OPF.

c) Get the credentials for your SumUp integration.

d) Prepare the [Postman Environment](environment_configuration.json) file so the collection can be imported with all your OPF Tenant and SumUp Sandbox Account unique values.


### Creating a SumUp Account ###
You can sign up at <https://me.sumup.com/>. Create a **sandbox merchant** for testing — a sandbox merchant's transactions are never settled and its API key is scoped to it.


### Creating a SumUp Payment Integration ###
Create a SumUp payment integration in the OPF workbench. For reference, see [Creating Payment Integration](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/3580ff1b17144b8780c055bbb7c2bed3/20a64f954df1425391757759011e7e6b.html).

Set the capture pattern to **``AUTO_CAPTURE``**. SumUp has no authorize-only mode, so any deferred-capture pattern will not work.


### Get the credentials for your SumUp integration ###

In the [SumUp developer portal](https://developer.sumup.com/), open **API keys** and create a secret key. Keys are prefixed **``sup_sk_``**. Use a **sandbox** key while validating the integration.

You also need your **merchant code** — the ``MX…`` identifier shown in the SumUp dashboard. It appears in the create-checkout body and in the refund and transaction URLs.


### Preparing the Postman environment_configuration file ###

**1. Token**

Get your access token by [creating an external app](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/8ccca5bb539a49258e924b467ee4e1c2/d927d21974fe4b368e063f72733bf0fe.html) and [making authorized API calls](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/8ccca5bb539a49258e924b467ee4e1c2/40c792e66e2942209dc853a43533d78d.html).

Copy the value of the access_token field (it's a JWT) and set as the ``token`` value in the environment file.

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

The secret key you created in the developer portal (prefix ``sup_sk_``) is needed for the following field:

* ``authentication_outbound_api_key_value_export_1367``

**IMPORTANT**: the value must be prefixed with **Bearer**, e.g. ``Bearer sup_sk_…`` — SumUp authenticates with a bearer token in the ``Authorization`` header.

**5. Merchant code**

* ``merchantCode`` — your ``MX…`` merchant code from the SumUp dashboard.

**6. SumUp API host**

Pre-set and does not normally need to change:

* ``host`` — ``https://api.sumup.com`` (same host for sandbox and live; the mode is determined by the API key)


### Allowlist
Add the following domain to the egress allowlist in the OPF workbench, otherwise OPF cannot make the server-to-server calls to SumUp (create-customer, create-checkout, verify, refund). For instructions, see [Adding Tenant-specific Domain to Allowlist](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/3580ff1b17144b8780c055bbb7c2bed3/a6836485b4494cfaad4033b4ee7a9c64.html).

``api.sumup.com`` for both sandbox and live accounts.

> Note: the redirect to SumUp's hosted checkout page (``checkout.sumup.com``) happens in the shopper's browser, not from OPF, so it does **not** need to be allowlisted — only the ``api.sumup.com`` host does.


## How the integration works ##

### Authorization ###

Two outbound calls run before the shopper is redirected:

1. ``POST /v0.1/customers`` — creates a SumUp customer. Guarded by the ``needsCustomerCreate``
   condition so it only fires when OPF has a ``customerId`` but no ``pspCustomerId`` yet. SumUp's
   customer endpoints do not upsert: ``POST`` fails with ``409 CUSTOMER_ALREADY_EXISTS`` for an
   existing id and ``PUT`` fails with ``404 CUSTOMER_NOT_FOUND`` for a new one, so the create has
   to be conditional.
2. ``POST /v0.1/checkouts`` with ``hosted_checkout.enabled: true`` — returns
   ``hosted_checkout_url``, mapped to the built-in ``redirectUrl`` smart field, which is what the
   destination URL renders. ``customer_id`` is sent only when an identifier exists, guarded by
   ``hasCustomerIdentifier``, and prefers the stored ``pspCustomerId`` over the Commerce
   ``customerId``.

The checkout id is stored as the custom field ``sumupCheckoutId`` with ``persistCustomField``, because verify needs it on the way back.

### Verification ###

Two chained calls:

1. ``GET /v0.1/checkouts/{id}`` — drives ``result`` and ``transactionStatus`` from the checkout
   ``status``, and takes ``pspReference`` from the checkout's top-level **``transaction_id``**.
2. ``GET /v2.1/merchants/{mc}/transactions?id=…`` — supplies ``cardType``, ``cardLast4`` and
   ``paymentMethod``. Guarded by ``hasSumupTransactionId``, so it is skipped when the first call
   produced no transaction.

The second call is needed because the checkout object's embedded ``transactions[]`` carries no card details at all.

### Notifications ###

SumUp posts to the ``return_url`` when a checkout's status changes, but the documented payload is only ``{event_type, id}``. The notification mapping therefore uses an **API preprocessor** (``sumup-fetch-checkout``): the inbound body's ``id`` is parsed into a custom field, the preprocessor calls ``GET /v0.1/checkouts/{id}``, and the full checkout replaces the payload so the outcome fields can be value-mapped from real content rather than fixed.

Retries back off 1 min / 5 min / 20 min / 2 h, and a notification can arrive after verify has already completed.


## Things worth knowing ##

**A failed card attempt sets the whole checkout to ``FAILED``.** The status is not terminal — it returns to ``PAID`` when the shopper retries successfully. The notification mapping therefore maps ``FAILED`` to ``DELAYED`` rather than ``REJECTED``: a terminal rejection on the first failed attempt cannot be lifted by the later success. (``authorization_inbound_request`` has no ``PENDING``, which is why ``DELAYED`` is the non-terminal sink.)


## What SumUp does not support ##

**No settlement or authorization reversal mappings are included, because the API has no operation to map them to.** SumUp has no authorize-only mode, no capture call and no void call — a checkout is captured as it completes. This is why the account must be ``AUTO_CAPTURE``. To cancel, refund.

**Saved cards are not supported by this configuration.** SumUp tokenizes a card only through a separate setup checkout (``purpose: SETUP_RECURRING_PAYMENT``), which authorizes an amount and immediately reimburses it — it is an enrolment transaction, not a purchase, so it cannot be combined with the checkout that collects payment. Charging a stored token afterwards would map to OPF's ``recurrent_authorization``. Neither is configured here.


## Known limitations ##

* **Refunds remain in ``REQUESTED``.** SumUp's refund endpoint returns ``201`` with an empty body, so there is nothing to drive ``transactionStatus`` or ``pspReference`` from. A fixed value is not an acceptable substitute for an outcome field. The refund itself succeeds and is visible in the SumUp dashboard.
* **``cardLast4`` does not populate** even though ``card.last_4_digits`` is present in the same ``/v2.1/transactions`` response that successfully populates ``cardType``. Under investigation.
* **Apple Pay and Google Pay cannot be distinguished from card.** SumUp reports ``payment_type: ECOM`` for all online payments including wallets, so ``paymentMethod`` maps to ``CREDIT_CARD`` throughout.


### Summary

The environment file is now ready for importing into Postman together with the Mapping Configuration Collection file. Ensure you select the correct environment before running the collection.

In summary, you should have edited the following variables:

#### Common
- ``token``
- ``rootUrl``
- ``accountGroupId``
- ``accountId``

#### SumUp Specific
- ``authentication_outbound_api_key_value_export_1367``
- ``merchantCode``
