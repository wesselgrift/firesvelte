export function addBodyClass(className: string) {
	if (typeof document !== 'undefined') {
		document.documentElement.classList.add(className);
		document.body.classList.add(className);
	}
}

export function removeBodyClass(className: string) {
	if (typeof document !== 'undefined') {
		document.documentElement.classList.remove(className);
		document.body.classList.remove(className);
	}
}

export function toggleBodyClass(className: string, condition: boolean) {
	if (condition) {
		addBodyClass(className);
	} else {
		removeBodyClass(className);
	}
}

