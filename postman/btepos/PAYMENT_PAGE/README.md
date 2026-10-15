## Introduction

The Postman Collection enables a [BTePOS IPay](https://btepos.ro/e-commerce) Hosted Pahe to be used to take payments through OPF. 

The integration supports:

* Authorization of Card Payments using Hosted Page Pattern
* Deferred Capture (Single Capture per Order)
* Refunds
* Reversal
* Split payments with loyalty points


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


### Creating the Loyalty Payment Method (LOY)

When an order is paid partly with BT StarBT loyalty points, the points portion settles outside the card rails.
The collection records it as a second OPF transaction against an alternative payment method, so the
loyalty amount appears alongside the card payment.

**Do this before importing the collection.**
Create the APM in the OPF workbench under **Payment Methods** before running the collection:

| Field | Value |
| --- | --- |
| APM Code | ``LOY`` |
| APM Name | Loyalty Points |
| Type | ``REDIRECT`` |
| Capture Pattern | ``PARTIAL_CAPTURE`` |
| Supports Refund | ``true`` |
| Supports Recurring | ``false`` |

Then **associate the APM with this payment integration**, either in the workbench or via the API:

```
PATCH {{rootUrl}}/{{service}}/merchant/apms-accountgroups-batch
{"value": [{"groupId": <your account group id>, "apmId": "<your LOY APM id>"}]}
```

Finally set ``loyaltyPaymentMethodCode`` to the APM code (``LOY``) in the environment file. 

### Split Payments with Loyalty Points

The loyalty leg is recorded during authorization verification:

1. ``getOrderStatusExtended.do`` for the card payment (always runs).
2. ``getOrderStatusExtended.do`` for the loyalty order.
3. ``POST ${vars.opfHost}/opf/merchant/transactions`` — records the loyalty portion as an
   ``AUTHORIZATION`` against the payment integration (account group) with
   ``paymentMethodCode: LOY``. ``accountGroupId`` is mapped from the **Payment Integration ID**
   smart field (``${input.paymentIntegrationId}``), so no account group ID needs configuring and
   OPF does not have to look it up through its API.

**Both legs share the same ``orderPaymentId``.** OPF holds two authorizations against it — the card
leg and the loyalty leg — each with its own transaction ID and its own ``pspReference``. Capture and
refund each leg individually by passing its ``authorizationId``. Sharing the payment ID also means
the loyalty transaction carries the same ``CART_REF`` and ``ORDER_REF`` tags as the card payment.

| Field | Meaning | Mapped from |
| --- | --- | --- |
| ``orderPaymentId`` | the order's payment ID, shared by both legs | ``input.orderId`` |
| ``pspReference`` | the **BTePOS order id** for the loyalty order | ``input.customFields.loyaltyOrderId`` |

``pspReference`` is what capture and refund send to BTePOS as ``orderId`` (``deposit.do`` and
``refund.do`` both map ``$.orderId <- ${input.pspReference}``), so it must be the identifier BTePOS
issued for that leg — not an OPF-side value.

**The card authorization is recorded at the amount BTePOS approved, not the order total.** When
part of the basket is paid with loyalty points, BTePOS pre-authorizes only the remainder on the card.

**OAuth2 for split payments.** OPF calls the OPF API, so it needs an OPF-scoped token from a
client that consumes **``opf-txn-mgt``** 

```
https://<your-ias-host>/oauth2/token?resource=urn:sap:identity:application:provider:name:opf-txn-mgt
```

| Variable | Description |
| --- | --- |
| `opfHost` | Base URL of your OPF tenant, e.g. `https://<tenant>.opf.commerce.stage.context.cloud.sap`. The loyalty leg is recorded through OPF's own API, and this is stored as an OPF variable so the mapping stays portable across tenants |
| `authentication_outbound_oauth2_token_url_export_1184` | IAS token endpoint **including** the `?resource=…opf-txn-mgt` query parameter |
| `authentication_outbound_oauth2_client_id_export_1184` | Client ID of your `opf-txn-mgt` OAuth client |
| `authentication_outbound_oauth2_client_secret_export_1184` | Client secret for that client |
| `loyaltyPaymentMethodCode` | The LOY APM code |

### Capture, Refund and Reversal

The card leg and the loyalty leg are captured, refunded and reversed separately, each by its own OPF
**authorization ID**. Use the card authorization ID for the card leg and the LOY authorization ID for
the loyalty leg. All three calls need an ``opf-txn-mgt`` token.

**1. Find the two authorization IDs.** Both legs share the order's ``orderPaymentId``, so one query
returns both authorizations. The loyalty leg is the one with payment method ``LOY``.

```
GET https://<your-opf-host>/opf/merchant/transactions?orderPaymentId=<orderPaymentId>
```

**2. Capture a leg.**

```
POST https://<your-opf-host>/opf/gateway/payment/capture
{"authorizationId": "<card or LOY authorization id>", "amount": 522.99}
```

**3. Refund a leg.** Pass the authorization ID here too, not the capture ID. OPF finds the capture to
refund against.

```
POST https://<your-opf-host>/opf/gateway/payment/refund
{"authorizationId": "<card or LOY authorization id>", "amount": 522.99}
```

**4. Reverse a leg.** To release an authorization that has not been captured, cancel it by its
authorization ID. No amount is needed.

```
POST https://<your-opf-host>/opf/gateway/payment/cancel
{"authorizationId": "<card or LOY authorization id>"}
```

All three calls return ``202``. OPF sends each one to BTePOS with that leg's ``pspReference``, so a
call on the card leg acts on the card order and a call on the LOY leg acts on the loyalty order.

Keep each amount within its own leg. The card leg is limited to the amount BTePOS approved on the
card, and the loyalty leg to the loyalty amount. BTePOS rejects a capture above the approved amount
with ``errorCode 8``.

### Customer and address data

BTePOS validates the ``orderBundle`` it receives with ``registerPreAuth.do``. The ``orderBundle``
mapping cleans the shopper's data before it is sent, so an ordinary Romanian address does not fail
the payment with ``errorCode 8`` ("[orderBundle…] wrong") or an HTML error page.

| What BTePOS does | What the mapping does |
| --- | --- |
| ``"``, ``\`` or a line break breaks the JSON (``[orderBundle] is invalid``) | replaces ``"`` with ``'``, ``\`` with ``/`` and line breaks with a space |
| ``city`` and ``postAddress`` accept at most 50 characters, ``postalCode`` 16 | truncates to those lengths; a street longer than 50 characters continues in ``postAddress2`` (100 characters in total, the rest is dropped) |
| ``phone`` must be digits only | keeps digits only |
| ``&`` or ``%`` in a value returns an HTML page instead of JSON | percent-encodes every value (OPF does not encode this field itself) |
| the iPay documentation asks for no diacritics | transliterates ``ă â î ș ş ț ţ`` and their capitals (``Brașov`` is sent as ``Brasov``) |

Romanian diacritics (both the comma-below ``ș ț`` and the cedilla ``ş ţ`` forms), the Romanian quotes
``„ ”``, apostrophes, ``#``, ``/``, ``+`` and ``;`` were accepted by BTePOS in testing, so the mapping only
transliterates the Romanian letters and leaves other characters alone.

Things to know when editing the ``orderBundle`` expression in the workbench:

- A mapping expression is limited to 2048 characters.
- Do not define a ``<#function>``: the whole template then fails to render ("Error while rendering
  templates"). ``<#assign>`` and ``<#list>`` work, so repeated logic is written as one cleaning pass
  over all values joined together.
- Commerce limits ``postalCode`` to 10 characters, before the request reaches OPF.
- A split of a street at 50 characters can fall inside a word.

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

#### Split payments with loyalty points (only if StarBT loyalty is in scope)
- ``authentication_outbound_oauth2_token_url_export_1184``
- ``authentication_outbound_oauth2_client_id_export_1184``
- ``authentication_outbound_oauth2_client_secret_export_1184``
- ``opfHost``
- ``loyaltyPaymentMethodCode``


For test environment, all other values can be left as defaults.  

