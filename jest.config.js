module.exports = {
	transform: {
		"^.+\\.tsx?$": "ts-jest"
	},
	testRegex: "\/tests\/[^\.]*\.tsx?$",
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
	roots: ["src"],
	testEnvironment: "node"
};

