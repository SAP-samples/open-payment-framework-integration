## Introduction

The Postman Collection enables a [BTePOS IPay](https://btepos.ro/e-commerce) Hosted Pahe to be used to take payments through OPF. 

The integration supports:

* Authorization of Card Payments using Hosted Page Pattern
* Deferred Capture (Single Capture per Order)
* Refunds
* Reversal
* Loyalty write-back — records the BT StarBT loyalty portion of a split payment as its own OPF transaction

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


### Creating the Loyalty Payment Method (LOY)

**Do this before importing the collection.** When an order is paid partly with BT StarBT loyalty
points, the points portion settles outside the card rails and would otherwise be invisible to OPF.
The collection records it as a second OPF transaction against an alternative payment method, so the
loyalty amount appears alongside the card payment.

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

This endpoint returns ``207`` with a per-item status, so check the inner status rather than the
outer response code, then confirm with a ``GET`` of the account group — ``apmConfigurations`` should
list the APM.

The association matters: without it OPF echoes the raw code back as the payment method, and with it
the transaction resolves the APM's display name (``Loyalty Points``), which is what the storefront
and back office show.

Finally set ``loyaltyPaymentMethodCode`` to the APM code (``LOY``) in the environment file. The
account group ID is not configured: the write-back reads it from the card authorization it is
recording alongside, so the collection works on any tenant without further edits.

### Loyalty Write-Back

The write-back runs during authorization verification:

1. ``getOrderStatusExtended.do`` for the card payment (always runs).
2. ``getOrderStatusExtended.do`` for the loyalty order.
3. ``GET {{rootUrl}}/{{service}}/merchant/transactions?…&expand=accountGroup`` — reads the account
   group from the card authorization, so no account group ID needs configuring.
4. ``POST {{rootUrl}}/{{service}}/merchant/transactions`` — records the loyalty portion as an
   ``AUTHORIZATION`` against that account group with ``paymentMethodCode: LOY``.
5. ``POST {{rootUrl}}/{{service}}/merchant/transactions-tags-batch`` — tags the new transaction with
   ``CART_REF``.

Tags cannot be set on the create call — a ``tags`` array or matching ``customFields`` are both
accepted and silently ignored. The batch endpoint is the only way, and it returns ``207`` with
per-item statuses, so check those rather than the outer response code. ``ORDER_REF`` is not set
here: Commerce writes it when the order is placed, which happens after authorization verification
runs.

**Both legs share the same ``orderPaymentId``.** OPF holds two authorizations against it — the card
leg and the loyalty leg — each with its own transaction ID and its own ``pspReference``. Capture and
refund each leg individually by passing its ``authorizationId``.

| Field | Meaning | Mapped from |
| --- | --- | --- |
| ``orderPaymentId`` | the order's payment ID, shared by both legs | ``input.orderId`` |
| ``pspReference`` | the **BTePOS order id** for the loyalty order | ``input.customFields.loyaltyOrderId`` |

``pspReference`` is what capture and refund send to BTePOS as ``orderId`` (``deposit.do`` and
``refund.do`` both map ``$.orderId <- ${input.pspReference}``), so it must be the identifier BTePOS
issued for that leg — not an OPF-side value.

**The card authorization must be recorded at the amount BTePOS approved, not the order total.** When
part of the basket is paid with loyalty points, BTePOS pre-authorizes only the remainder on the card.
The card verify response therefore maps:

```
paymentAmountInfo.approvedAmount  ->  authorizationAmountInExponent
```

Without this the card authorization keeps the full order total, the loyalty amount is counted twice,
and capture fails with ``errorCode 8, "deposited amount is greater then registered amount"``. The
value is in minor units, so it maps to ``authorizationAmountInExponent`` rather than
``authorizationAmount``.

Steps 2 to 5 are gated by the **``hasLoyalties``** mapping condition:

```
(input.customFields.loyaltyOrderId)!''?has_content
```

so an order with no loyalty component behaves exactly as before — the four extra calls are skipped.
The amount comes from ``input.customFields.loyaltyAmount`` (minor units, divided by 100), and the
currency follows the order rather than being fixed.

> **Import order matters:** the **Authentications** and **Mapping condition expressions** folders must
> run *before* **Authorization**. They create the OAuth2 authentication and the condition and store
> their generated IDs in the environment, which the authorization mapping references. The collection
> is ordered correctly — keep it that way if you re-order anything.

**OAuth2 for the write-back.** Step 3 calls the OPF API, so it needs an OPF-scoped token from a
client that consumes **``opf-txn-mgt``** (an ``opf-int-mgt`` provisioning client returns ``403`` on
this endpoint). SAP IAS only issues a scoped token when the request carries a ``resource`` parameter,
and OPF's OAuth2 authentication has no field for it — ``resource`` is silently dropped from the
stored configuration. Append it to the **token URL** as a query parameter instead:

```
https://<your-ias-host>/oauth2/token?resource=urn:sap:identity:application:provider:name:opf-txn-mgt
```

| Variable | Description |
| --- | --- |
| `opfHost` | Base URL of your OPF tenant, e.g. `https://<tenant>.opf.commerce.stage.context.cloud.sap`. The write-back calls OPF's own API, and this is stored as an OPF variable so the mapping stays portable across tenants |
| `authentication_outbound_oauth2_token_url_export_1184` | IAS token endpoint **including** the `?resource=…opf-txn-mgt` query parameter |
| `authentication_outbound_oauth2_client_id_export_1184` | Client ID of your `opf-txn-mgt` OAuth client |
| `authentication_outbound_oauth2_client_secret_export_1184` | Client secret for that client |
| `loyaltyPaymentMethodCode` | The LOY APM code |


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

#### Loyalty write-back (only if StarBT loyalty is in scope)
- ``authentication_outbound_oauth2_token_url_export_1184``
- ``authentication_outbound_oauth2_client_id_export_1184``
- ``authentication_outbound_oauth2_client_secret_export_1184``
- ``opfHost``
- ``loyaltyPaymentMethodCode``


For test environment, all other values can be left as defaults.  

