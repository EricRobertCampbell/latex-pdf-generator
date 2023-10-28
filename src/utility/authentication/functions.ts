export const validateToken = async (token: string) => {
	if (token !== process.env.ACCEPTED_AUTH_KEY) {
		return false;
	}
	return true;
};
