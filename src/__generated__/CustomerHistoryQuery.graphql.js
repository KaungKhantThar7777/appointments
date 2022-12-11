/**
 * @generated SignedSource<<2e8f4ce068e2a858a31951317d91f7e9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "concreteType": "Customer",
    "kind": "LinkedField",
    "name": "customer",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "firstName",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "lastName",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "phoneNumber",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Appointment",
        "kind": "LinkedField",
        "name": "appointments",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "startsAt",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "stylist",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "service",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "notes",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "CustomerHistoryQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "CustomerHistoryQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "50ce62a3f9d241002d01b87d04529196",
    "id": null,
    "metadata": {},
    "name": "CustomerHistoryQuery",
    "operationKind": "query",
    "text": "query CustomerHistoryQuery(\n  $id: ID!\n) {\n  customer(id: $id) {\n    id\n    firstName\n    lastName\n    phoneNumber\n    appointments {\n      startsAt\n      stylist\n      service\n      notes\n    }\n  }\n}\n"
  }
};
})();

node.hash = "cb8fc79b8b5a7a432b91eb32fbf47b83";

module.exports = node;
