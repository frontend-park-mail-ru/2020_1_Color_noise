import {default as CurrentUser} from "../../utils/userDataSingl";

/**
 *  network logic
 */
export class FetchModule {
	/**
	 * Post request with json
	 *
	 * @param {string} url - request url
	 * @param {map} parameters - parameters for fetch
	 * @return {promise}
	 */
	static fetchRequest({url,
							method = 'post',
							body = null,
							headers = {
								'Content-type': 'application/json; charset=UTF-8',
								'X-CSRF-Token': CurrentUser.Data.token,
							},
						} = {}) {
		const jsonData = JSON.stringify(body); // @todo add err check
		const options = {
			method: method,
			credentials: 'include',
			headers: headers,
			mode: 'cors',
			body: body == null ? null : jsonData, // for GET method
		};
		return fetch(url, options);
	};

	/**
	 *  Send img to Go server
	 *
	 * @param {string} url - request url
	 * @param {map} parameters - parameters for fetch
	 * @return {promise}
	 */
	static fetchRequestSendImage({url,
									 method = 'post',
									 body = null,
								 } = {}) {
		const options = {
			method: method,
			credentials: 'include',
			mode: 'cors',
			body: body,
			//headers: {'X-Csrf-Token': CurrentUser.Data.token}, // @todo add token (first - get token from Go)
		};
		return fetch(url, options);
	};

}
