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

		// For Post
		let body: IDataObject;

		let requestMethod: string;
		let endpoint: string;

		let usesOldApi = false;

		for (let i = 0; i < items.length; i++) {
			requestMethod = "GET";
			endpoint = "";
			body = {} as IDataObject;

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
			if (usesOldApi){
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
					body
				);
			}
			

			returnData.push(responseData as IDataObject);
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
