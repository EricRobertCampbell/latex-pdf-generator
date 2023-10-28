export const validateToken = async (header: string | undefined) => {
	// should be in the format "Bearer <token>"
	const token = getTokenFromAuthorizationHeader(header);
	if (token && token !== process.env.ACCEPTED_AUTH_KEY) {
		return false;
	}
	return true;
};

export const getTokenFromAuthorizationHeader = (header: string | undefined) => {
	if (!header || typeof header !== "string") {
		return undefined;
	}
	const bearerRegex = /bearer (.+)$/i;
	const match = header.match(bearerRegex);
	if (!match || match.length <= 1) {
		return undefined;
	}
	return match[1];
};
