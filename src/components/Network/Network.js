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

/*
// @todo заменить все на fetch
export function ajax(method, url, body = null, callback, image = false) {
	const xhr = new XMLHttpRequest();
	xhr.open(method, url, true);
	xhr.withCredentials = true;

	xhr.addEventListener('readystatechange', function() {
		if (xhr.readyState !== 4) return;
		callback(xhr.status, xhr.responseText);
	});

	if (body) {
		if (image) {
			xhr.send(body);
		} else {
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=utf8');
			xhr.send(JSON.stringify(body));
		}
		return;
	}

	xhr.send();
}
*/