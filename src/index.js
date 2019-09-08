"use strict";
function utils(info) {
    const logger = info.project.projectService.logger;
    return {
        stripExtensionNameDotTs(moduleName) {
            for (const index = moduleName.indexOf('?'); index !== -1; moduleName = moduleName.substring(index + 1)) {
                if (moduleName.substring(0, index).endsWith('.ts')) {
                    const cutLength = moduleName.length - moduleName.length;
                    const replacedModuleName = moduleName.substring(0, index + cutLength);
                    logger.info(`replaced: ${moduleName} -> ${replacedModuleName}`);
                    return replacedModuleName;
                }
            }
            if (!moduleName.endsWith('.ts')) {
                logger.info(`no effect: ${moduleName}`);
                return moduleName;
            }
            const replacedModuleName = moduleName.slice(0, -3);
            logger.info(`replaced: ${moduleName} -> ${replacedModuleName}`);
            return replacedModuleName;
        },
    };
}
module.exports = function init() {
    return {
        create(info) {
            const { stripExtensionNameDotTs } = utils(info);
            const resolveModuleNames = info.languageServiceHost.resolveModuleNames;
            if (resolveModuleNames === undefined) {
                return info.languageService;
            }
            info.languageServiceHost.resolveModuleNames = (moduleNames, containingFile, reusedNames, redirectedReference, options) => {
                return resolveModuleNames.call(info.languageServiceHost, moduleNames.map(stripExtensionNameDotTs), containingFile, reusedNames, redirectedReference, options);
            };
            return info.languageService;
        },
    };
};
