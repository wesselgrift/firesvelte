// Adds a CSS class to both the document element and body element
// Checks for document availability to ensure SSR compatibility
export function addBodyClass(className: string) {
	if (typeof document !== 'undefined') {
		document.documentElement.classList.add(className);
		document.body.classList.add(className);
	}
}

// Removes a CSS class from both the document element and body element
// Checks for document availability to ensure SSR compatibility
export function removeBodyClass(className: string) {
	if (typeof document !== 'undefined') {
		document.documentElement.classList.remove(className);
		document.body.classList.remove(className);
	}
}

// Conditionally adds or removes a CSS class based on the provided condition
// If condition is true, adds the class; if false, removes it
export function toggleBodyClass(className: string, condition: boolean) {
	if (condition) {
		addBodyClass(className);
	} else {
		removeBodyClass(className);
	}
}

