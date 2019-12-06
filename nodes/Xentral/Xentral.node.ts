import { IExecuteFunctions } from 'n8n-core';

import {
	IDataObject,
	INodeTypeDescription,
	INodeExecutionData,
	INodeType
} from 'n8n-workflow';

import { xentralRequest } from './GenericFunctions';

export class Xentral implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Xentral',
		name: 'xentral',
		icon: 'file:xentral.png',
		group: ['transform'],
		version: 1,
		description: 'Xentral CRM Node',
		defaults: {
			name: 'Xentral',
			color: '#42b8c5'
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'xentral',
				required: true
			}
		],


		properties: [
			// ----------------------------------
			// 				Resources
			// ----------------------------------
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Auftrag (v1)',
						value: 'order'
					},
					/* {
						name: 'Addresses',
						value: 'addresses'
					} */
				],
				default: 'order',
				description: 'The resource to operate on.'
			},

			// ----------------------------------
			// 				order
			// ----------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['order']
					}
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create an order'
					},
					{
						name: 'Edit',
						value: 'update',
						description: 'Update an order'
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get data of an order'
					}
				],
				default: 'create',
				description: 'The operation to perform.'
			},

			// ----------------------------------
			//         order:create
			// ----------------------------------
			{
				displayName: 'Data',
				name: 'data',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['create'],
						resource: ['order']
					}
				},
				default: '',
				required: true,
				description: 'Data of the order to create.'
			},

			// ----------------------------------
			//         order:update
			// ----------------------------------
			{
				displayName: 'Data',
				name: 'data',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['update'],
						resource: ['order']
					}
				},
				default: '',
				required: false,
				description: 'Data of the order to create.'
			},

			// ----------------------------------
			//         order:get
			// ----------------------------------			
			{
				displayName: 'Data',
				name: 'data',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['get'],
						resource: ['order']
					}
				},
				default: '',
				required: false,
				description: 'Data of the order to create.'
			},

			// ----------------------------------
			//         addresses
			// ----------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['addresses']
					}
				},
				options: [
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get the address list'
					},
					{
						name: 'Get by ID',
						value: 'getById',
						description: 'Get single address by its ID'
					}
				],
				default: 'getById',
				description: 'retrieve addresses'
			},

			// ----------------------------------
			//         addresses:getById
			// ----------------------------------
			{
				displayName: 'ID',
				name: 'id',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getById'],
						resource: ['addresses']
					}
				},
				default: 0,
				required: true,
				description: 'Get a single address'
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

		for (let i = 0; i < items.length; i++) {
			requestMethod = 'GET';
			endpoint = '';
			body = {} as IDataObject;

			resource = this.getNodeParameter('resource', 0) as string;
			operation = this.getNodeParameter('operation', 0) as string;

			if (resource === 'order') {
				if (operation === 'create') {
					// ----------------------------------
					//         create
					// ----------------------------------
					requestMethod = 'POST';
					endpoint = '/api/AuftragCreate';

					body = {
						data: JSON.parse(
							this.getNodeParameter('data', i) as string
						) as object
					} as IDataObject;

				} else if (operation === 'update') {
					// ----------------------------------
					//         update
					// ----------------------------------
					requestMethod = 'POST';
					endpoint = '/api/AuftragEdit';

					body = {
						data: JSON.parse(
							this.getNodeParameter('data', i) as string
						) as object
					} as IDataObject;

				} else if (operation === 'get') {
					// ----------------------------------
					//         get
					// ----------------------------------
					requestMethod = 'POST';
					endpoint = '/api/AuftragGet';

					body = {
						data: JSON.parse(
							this.getNodeParameter('data', i) as string
						) as object
					} as IDataObject;

				} else {
					throw new Error(`The operation '${operation}' is not known!`);
				}

			} else if (resource === 'addresses') {
				if (operation === 'getAll') {
					requestMethod = 'GET';

					endpoint = '/api/v1/adressen';

				} else if (operation === 'getById') {
					requestMethod = 'GET';

					const id = this.getNodeParameter('id', i) as number;
					endpoint = `/api/v1/adressen/${id}`;

				}

			} else {
				throw new Error(`The resource '${resource}' is not known!`);
			}

			const responseData = await xentralRequest.call(
				this,
				requestMethod,
				endpoint,
				body
			);

			returnData.push(responseData as IDataObject);
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
