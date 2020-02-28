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
			xhr.setRequestHeader('Content-type', 'multipart/form-data');
			xhr.send(body);
		} else {
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=utf8');
			xhr.send(JSON.stringify(body));
		}
		
		return;
	}

	xhr.send();
}