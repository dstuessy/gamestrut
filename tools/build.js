({
	baseUrl: "../dev/script",
	paths: {
		Mousetrap: 'libs/mousetrap',
		box2dweb: 'libs/box2dweb.min',
		game: 'libs/gamestrut/game',
		gamestrut: 'libs/gamestrut/gamestrut'
	},
	shim: {
		'game': {
			deps: ['Mousetrap', 'box2dweb']
		},
		'gamestrut': {
			deps: ['game']
		}
	},
	include: ["libs/gamestrut/gamestrut.js"],
	out: "../build/gamestrut.js",
	optimize: 'none', // uglifies code
	transformAMDChecks: false,
	preserveLicenseComments: true,
	onModuleBundleComplete: function (data) {

		var fs = module.require('fs'),
			amdclean = module.require('amdclean'),
			outputFile = data.path,
			cleanedCode = amdclean.clean({
			'filePath': outputFile
		});

		fs.writeFileSync(outputFile, cleanedCode);
	}
})
