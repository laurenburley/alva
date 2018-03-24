module.exports = {
	transform: {
		"^.+\\.tsx?$": "ts-jest"
	},
	testRegex: "/tests/.*\.[t]sx?$",
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
	roots: ["src"],
	testEnvironment: "node"
};

