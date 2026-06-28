export function buildCallbackUrl(origin: string, callbackPath: string): string {
	if (!callbackPath) {
		return origin;
	}

	if (/^https?:\/\//i.test(callbackPath)) {
		return callbackPath;
	}

	return new URL(callbackPath, origin).toString();
}
