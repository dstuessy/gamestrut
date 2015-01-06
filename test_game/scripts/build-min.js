({
   paths: {
      /*'$': "libs/jquery",*/
      Mousetrap: "libs/mousetrap",
      box2dweb: "libs/box2dweb.min",
      Game: "libs/game/game"
   },
   shim: {
      "Game": {
         deps: ['Mousetrap', 'box2dweb']
      }
   },
   baseUrl: "./",
   name: "Game",
   out: "../../quick-game.min.js",
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
