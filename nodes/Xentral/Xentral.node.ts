import { IExecuteFunctions } from "n8n-core";

import {
	IDataObject,
	INodeTypeDescription,
	INodeExecutionData,
	INodeType
} from "n8n-workflow";

import { xentralRequestOldApi, xentralRequest } from "./GenericFunctions";

export class Xentral implements INodeType {
	description: INodeTypeDescription = {
		displayName: "Xentral",
		name: "xentral",
		icon: "file:xentral.png",
		group: ["transform"],
		version: 1,
		description: "Xentral CRM Node",
		defaults: {
			name: "Xentral",
			color: "#42b8c5"
		},
		inputs: ["main"],
		outputs: ["main"],
		credentials: [
			{
				name: "xentral",
				required: true
			}
		],

		properties: [
			// ----------------------------------
			// 				Resources
			// ----------------------------------
			{
				displayName: "Resource",
				name: "resource",
				type: "options",
				options: [
					{
						name: "Order(v1)",
						value: "order"
					},
					{
						name: "Address(v1/v2)",
						value: "address"
					}
				],
				default: "order",
				description: "The resource to operate on."
			},

			// ----------------------------------
			// 				order
			// ----------------------------------
			{
				displayName: "Operation",
				name: "operation",
				type: "options",
				displayOptions: {
					show: {
						resource: ["order"]
					}
				},
				options: [
					{
						name: "Create",
						value: "create",
						description: "Create an order"
					},
					{
						name: "Update",
						value: "update",
						description: "Update an order"
					},
					{
						name: "Get",
						value: "get",
						description: "Get data of an order"
					}
				],
				default: "create",
				description: "The operation to perform."
			},

			// ----------------------------------
			//         order:create
			// ----------------------------------
			{
				displayName: "Data",
				name: "data",
				type: "string",
				displayOptions: {
					show: {
						operation: ["create"],
						resource: ["order"]
					}
				},
				default: "",
				required: true,
				description: "Data of the order to create."
			},

			// ----------------------------------
			//         order:update
			// ----------------------------------
			{
				displayName: "Data",
				name: "data",
				type: "string",
				displayOptions: {
					show: {
						operation: ["update"],
						resource: ["order"]
					}
				},
				default: "",
				required: true,
				description: "Data of the order to update."
			},

			// ----------------------------------
			//         order:get
			// ----------------------------------
			{
				displayName: "Data",
				name: "data",
				type: "string",
				displayOptions: {
					show: {
						operation: ["get"],
						resource: ["order"]
					}
				},
				default: "",
				required: true,
				description: "Data of the order to create."
			},

			// ----------------------------------
			//         address
			// ----------------------------------
			{
				displayName: "Operation",
				name: "operation",
				type: "options",
				displayOptions: {
					show: {
						resource: ["address"]
					}
				},
				options: [
					{
						name: "Create(v1)",
						value: "create",
						description: "Create new address"
					},
					{
						name: "Update(v1)",
						value: "update",
						description: "Edit address"
					},
					{
						name: "Get All(v2)",
						value: "getAll",
						description: "Call up the address list"
					},
					{
						name: "Get by ID(v2)",
						value: "getById",
						description: "Get individual addresses"
					}
				],
				default: "create",
				description: "Address options"
			},

			// ----------------------------------
			//         address: getById
			// ----------------------------------
			{
				displayName: "ID",
				name: "id",
				type: "number",
				displayOptions: {
					show: {
						operation: ["getById"],
						resource: ["address"]
					}
				},
				default: 1,
				required: true,
				description: "Address Id"
			},

			// ----------------------------------
			//         address: getAll
			// ----------------------------------
			{
				displayName: 'Query Parameter',
				name: 'queryParameters',
				type: 'collection',
				description: 'The query parameters to filter by.',
				placeholder: 'Add Parameter',
				displayOptions: {
					show: {
						operation: ['getAll'],
						resource: ['address']
					},
				},
				default: {},
				options: [
					{
						displayName: 'Anzahl Ergebnisse',
						name: 'items',
						type: 'number',
						default: 20,
						description: 'Anzahl der Ergebnisse pro Seite. Maximum 1000.',
					},
					{
						displayName: 'Seitenzahl',
						name: 'page',
						type: 'number',
						default: 1,
						description: 'Seitenzahl',
					},				
					{
						displayName: 'Projekt',
						name: 'projekt',
						type: 'number',
						default: 0,
						description: 'Suche nach bestimmter Projekt-ID (genaue Übereinstimmung).',
					},
					{
						displayName: 'Firma',
						name: 'firma',
						type: 'string',
						default: '0',
						description: 'Suche nach bestimmter Firmen-ID (genaue Übereinstimmung).',
					},
					{
						displayName: 'Rolle',
						name: 'rolle',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmter Rolle (Wert kunde oder lieferant).',
					},
					{
						displayName: 'Typ',
						name: 'typ',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmtem Adresstyp (genaue Übereinstimmung).',
					},
					{
						displayName: 'Sprache',
						name: 'sprache',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmter Sprache (genaue Übereinstimmung).',
					},
					{
						displayName: 'Währung',
						name: 'waehrung',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmtem Währungscode (genaue Übereinstimmung).',
					},
					{
						displayName: 'Land',
						name: 'land',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmtem Ländercode (genaue Übereinstimmung).',
					},
					{
						displayName: 'Kundennummer',
						name: 'kundennummer',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmter Kundennummer (ungefähre Übereinstimmung).',
					},
					{
						displayName: 'Kundennummer gleicht',
						name: 'kundennummer_equals',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmter Kundennummer (genaue Übereinstimmung).',
					},
					{
						displayName: 'Kundennummer beginnt mit',
						name: 'kundennummer_startswith',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmter Kundennummer (Übereinstimmung am Anfang).',
					},
					{
						displayName: 'Kundennummer endet mit',
						name: 'kundennummer_endswith',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmter Kundennummer (Übereinstimmung am Ende).',
					},
					{
						displayName: 'Lieferantennummer',
						name: 'lieferantennummer',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmter Lieferantennummer (ungefähre Übereinstimmung).',
					},
					{
						displayName: 'Lieferantennummer gleicht',
						name: 'lieferantennummer_equals',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmter Lieferantennummer (genaue Übereinstimmung).',
					},
					{
						displayName: 'Lieferantennummer beginnt mit',
						name: 'lieferantennummer_startswith',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmter Lieferantennummer (Übereinstimmung am Anfang).',
					},
					{
						displayName: 'Lieferantennummer endet mit',
						name: 'lieferantennummer_endswith',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmter Lieferantennummer (Übereinstimmung am Ende).',
					},
					{
						displayName: 'Mitarbeiternummer',
						name: 'mitarbeiternummer',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmter Mitarbeiternummer (ungefähre Übereinstimmung).',
					},
					{
						displayName: 'Mitarbeiternummer gleicht',
						name: 'mitarbeiternummer_equals',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmter Mitarbeiternummer (genaue Übereinstimmung).',
					},
					{
						displayName: 'Mitarbeiternummer beginnt mit',
						name: 'mitarbeiternummer_startswith',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmter Mitarbeiternummer (Übereinstimmung am Anfang).',
					},
					{
						displayName: 'Mitarbeiternummer endet mit',
						name: 'mitarbeiternummer_endswith',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmter Mitarbeiternummer (Übereinstimmung am Ende).',
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmter E-Mail-Adresse (ungefähre Übereinstimmung).',
					},
					{
						displayName: 'Email gleicht',
						name: 'email_equals',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmter E-Mail-Adresse (genaue Übereinstimmung).',
					},
					{
						displayName: 'Email beginnt mit',
						name: 'email_startswith',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmter E-Mail-Adresse (Übereinstimmung am Anfang).',
					},
					{
						displayName: 'Email endet mit',
						name: 'email_endswith',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmter E-Mail-Adresse (Übereinstimmung am Ende).',
					},
					{
						displayName: 'Sortierung',
						name: 'sort',
						type: 'string',
						default: '',
						description: 'Sortierung (Beispiel: sort = name,-kundennummer) Verfügbare Felder: name, kundennummer, lieferantennummer, mitarbeiternummer.',
					},
					{
						displayName: 'Freifeld 1',
						name: 'freifeld1',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmtem Wert im Freifeld1 (ungefähre Übereinstimmung).',
					},
					{
						displayName: 'Freifeld 2',
						name: 'freifeld2',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmtem Wert im Freifeld2 (ungefähre Übereinstimmung).',
					},
					{
						displayName: 'Freifeld 3',
						name: 'freifeld3',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmtem Wert im Freifeld3 (ungefähre Übereinstimmung).',
					},
					{
						displayName: 'Freifeld 4',
						name: 'freifeld4',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmtem Wert im Freifeld4 (ungefähre Übereinstimmung).',
					},
					{
						displayName: 'Freifeld 5',
						name: 'freifeld5',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmtem Wert im Freifeld5 (ungefähre Übereinstimmung).',
					},
					{
						displayName: 'Freifeld 6',
						name: 'freifeld6',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmtem Wert im Freifeld6 (ungefähre Übereinstimmung).',
					},
					{
						displayName: 'Freifeld 7',
						name: 'freifeld7',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmtem Wert im Freifeld7 (ungefähre Übereinstimmung).',
					},
					{
						displayName: 'Freifeld 8',
						name: 'freifeld8',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmtem Wert im Freifeld8 (ungefähre Übereinstimmung).',
					},
					{
						displayName: 'Freifeld 9',
						name: 'freifeld9',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmtem Wert im Freifeld9 (ungefähre Übereinstimmung).',
					},
					{
						displayName: 'Freifeld 10',
						name: 'freifeld10',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmtem Wert im Freifeld10 (ungefähre Übereinstimmung).',
					},
					{
						displayName: 'Freifeld 1 gleich',
						name: 'freifeld1_equals',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmtem Wert im Freifeld1 (genaue Übereinstimmung).',
					},
					{
						displayName: 'Freifeld 2 gleich',
						name: 'freifeld2_equals',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmtem Wert im Freifeld2 (genaue Übereinstimmung).',
					},
					{
						displayName: 'Freifeld 3 gleich',
						name: 'freifeld3_equals',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmtem Wert im Freifeld3 (genaue Übereinstimmung).',
					},
					{
						displayName: 'Freifeld 4 gleich',
						name: 'freifeld4_equals',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmtem Wert im Freifeld4 (genaue Übereinstimmung).',
					},
					{
						displayName: 'Freifeld 5 gleich',
						name: 'freifeld5_equals',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmtem Wert im Freifeld5 (genaue Übereinstimmung).',
					},
					{
						displayName: 'Freifeld 6 gleich',
						name: 'freifeld6_equals',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmtem Wert im Freifeld6 (genaue Übereinstimmung).',
					},
					{
						displayName: 'Freifeld 7 gleich',
						name: 'freifeld7_equals',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmtem Wert im Freifeld7 (genaue Übereinstimmung).',
					},
					{
						displayName: 'Freifeld 8 gleich',
						name: 'freifeld8_equals',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmtem Wert im Freifeld8 (genaue Übereinstimmung).',
					},
					{
						displayName: 'Freifeld 9 gleich',
						name: 'freifeld9_equals',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmtem Wert im Freifeld9 (genaue Übereinstimmung).',
					},
					{
						displayName: 'Freifeld 10 gleich',
						name: 'freifeld10_equals',
						type: 'string',
						default: '',
						description: 'Suche nach bestimmtem Wert im Freifeld10 (genaue Übereinstimmung).',
					},
				]
			},

			// ----------------------------------
			//         address: create
			// ----------------------------------

			{
				displayName: "Data",
				name: "data",
				type: "string",
				displayOptions: {
					show: {
						operation: ["create"],
						resource: ["address"]
					}
				},
				default: "",
				required: true,
				description: "Data of the address to create."
			},


			// ----------------------------------
			//         address: update
			// ----------------------------------
			{
				displayName: "ID",
				name: "id",
				type: "number",
				displayOptions: {
					show: {
						operation: ["update"],
						resource: ["address"]
					}
				},
				default: 1,
				required: true,
				description: "ID of the address to update."
			},
			{
				displayName: "Data",
				name: "data",
				type: "string",
				displayOptions: {
					show: {
						operation: ["update"],
						resource: ["address"]
					}
				},
				default: 1,
				required: true,
				description: "Data of the address to update."
			}

		]
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];

		let resource: string;
		let operation: string;

		// For Body
		let body: IDataObject;
		// For Query string
		let qs: IDataObject;

		let requestMethod: string;
		let endpoint: string;

		let usesOldApi = false;

		for (let i = 0; i < items.length; i++) {
			requestMethod = "GET";
			endpoint = "";
			body = {} as IDataObject;
			qs = {} as IDataObject;

			resource = this.getNodeParameter("resource", 0) as string;
			operation = this.getNodeParameter("operation", 0) as string;

			if (resource === "order") {
				if (operation === "create") {
					// ----------------------------------
					//         create
					// ----------------------------------
					requestMethod = "POST";
					endpoint = "/api/AuftragCreate";

					usesOldApi = true;

					body = {
						data: JSON.parse(
							this.getNodeParameter("data", i) as string
						) as object
					} as IDataObject;
				} else if (operation === "update") {
					// ----------------------------------
					//         update
					// ----------------------------------
					requestMethod = "POST";
					endpoint = "/api/AuftragEdit";

					usesOldApi = true;

					body = {
						data: JSON.parse(
							this.getNodeParameter("data", i) as string
						) as object
					} as IDataObject;
				} else if (operation === "get") {
					// ----------------------------------
					//         get
					// ----------------------------------
					requestMethod = "POST";
					endpoint = "/api/AuftragGet";

					usesOldApi = true;

					body = {
						data: JSON.parse(
							this.getNodeParameter("data", i) as string
						) as object
					} as IDataObject;
				} else {
					throw new Error(`The operation '${operation}' is not known!`);
				}
			} else if (resource === "address") {
				if (operation === "getAll") {
					requestMethod = "GET";

					usesOldApi = false;

					const queryParameters = this.getNodeParameter("queryParameters", i) as IDataObject;
					for (const key of Object.keys(queryParameters)) {
						qs[key] = queryParameters[key];
					}

					endpoint = "/api/v2/adressen";
				} else if (operation === "getById") {
					requestMethod = "GET";

					usesOldApi = false;

					const id = this.getNodeParameter("id", i) as number;
					endpoint = `/api/v2/adressen/${id}`;
				} else if (operation === "create") {
					requestMethod = "POST";
					endpoint = "/api/v1/adressen";

					usesOldApi = false;

					body = JSON.parse(this.getNodeParameter("data", i) as string) as IDataObject;
				} else if (operation === "update") {
					requestMethod = "PUT";
					const id = this.getNodeParameter("id", i) as number;
					endpoint = `/api/v1/adressen/${id}`;

					usesOldApi = false;

					body = JSON.parse(this.getNodeParameter("data", i) as string) as IDataObject;

				}
			} else {
				throw new Error(`The resource '${resource}' is not known!`);
			}

			let responseData = null;
			if (usesOldApi) {
				responseData = await xentralRequestOldApi.call(
					this,
					requestMethod,
					endpoint,
					body
				);
			} else {
				responseData = await xentralRequest.call(
					this,
					requestMethod,
					endpoint,
					body,
					qs
				);
			}


			returnData.push(responseData as IDataObject);
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
