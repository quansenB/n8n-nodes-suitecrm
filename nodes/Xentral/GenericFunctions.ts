import { IExecuteFunctions, IHookFunctions } from 'n8n-core';

import { IDataObject } from 'n8n-workflow';

import { OptionsWithUri } from 'request';

/**
 * Make an API request to Xentral
 *
 * @param {IHookFunctions} this
 * @param {string} method
 * @param {string} url
 * @param {object} body
 * @returns {Promise<any>}
 */
export async function xentralRequest(
	this: IHookFunctions | IExecuteFunctions,
	method: string,
	endpoint: string,
	body: IDataObject
): Promise<any> {
	// tslint:disable-line:no-any
	const credentials = this.getCredentials('xentral');
	if (credentials === undefined) {
		throw new Error('No credentials got returned!');
	}

	const options: OptionsWithUri = {
		headers: {},
		method,
		uri: `${credentials.url}${endpoint}`,
		json: true,
		rejectUnauthorized: true,
		qs: { json: 'true' },
		auth: {
			user: credentials.username as string,
			pass: credentials.password as string,
			sendImmediately: false
		}
	};

	if (Object.keys(body).length !== 0) {
		options.body = body;
	}

	try {
		const responseData = await this.helpers.request(options);

		if (responseData.success === false) {
			throw new Error(
				`Xentral error response: ${responseData.error} (${responseData.error_info})`
			);
		}

		return responseData;
	} catch (error) {
		if (error.statusCode === 403) {
			// Return a clear error
			throw new Error('The Xentral credentials are not valid!');
		}

		// If that data does not exist for some reason return the actual error
		throw error;
	}
}
