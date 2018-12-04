function makeVendorEntry(config) {
    const packageJson = require('./package.json');
    const vendorDependencies = Object.keys(packageJson['dependencies']);

    const vendorModulesMinusExclusions = vendorDependencies.filter(vendorModule =>
        config.mainModules.indexOf(vendorModule) === -1 && config.modulesToExclude.indexOf(vendorModule) === -1);

    return vendorModulesMinusExclusions;
}

exports.makeVendorEntry = makeVendorEntry;