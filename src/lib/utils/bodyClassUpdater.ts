// Adds a CSS class to both documentElement and body (checks for SSR compatibility)
export function addBodyClass(className: string) {
	if (typeof document !== 'undefined') {
		document.documentElement.classList.add(className);
		document.body.classList.add(className);
	}
}

// Removes a CSS class from both documentElement and body (checks for SSR compatibility)
export function removeBodyClass(className: string) {
	if (typeof document !== 'undefined') {
		document.documentElement.classList.remove(className);
		document.body.classList.remove(className);
	}
}

// Adds or removes a CSS class based on the condition (true = add, false = remove)
export function toggleBodyClass(className: string, condition: boolean) {
	if (condition) {
		addBodyClass(className);
	} else {
		removeBodyClass(className);
	}
}

