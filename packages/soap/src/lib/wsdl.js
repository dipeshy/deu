const {
    xml2js,
    js2xml,
} = require('xml-js');
const { Document, } = require('./document');
const debug = require('debug')('soap:debug');

/**
 * Load wsdl
 * @param {*} root 
 * @returns 
 */
const loadWSDL = async (outputDir, url, ext = 'wsdl') => {
    debug(`Fetching wsdl from: ${url}`);
    const saveContent = Document.save(outputDir);
    const document = new Document(url);
    const xmlDoc = await document.fetch();
   
    const jsDoc = xml2js(xmlDoc, {
        compact: false,
    });

    await iterateWSDL(outputDir, jsDoc);

    saveContent(`${document.name}.${ext}`)(js2xml(jsDoc, {
        spaces: '    ',
        compact: false,
    }));
}

/**
 * @param {*} root WSDL declaration root
 */
const iterateWSDL = (outputDir, root) => {
    return _iterateWSDL(outputDir, root, null);
}

/**
 * Lots of sideeffect and multation. This version is prototype :)
 * @param {*} root 
 * @param {*} $parent 
 */
const _iterateWSDL = async (outputDir, root, $parent = null) => {
    const type = root.type || 'UNDEFINED';
    const fullName = root.name || 'UNDEFINED';
    const elements = root.elements || [];
    const { name, ns, } = parseName(fullName);

    debug(`Type: ${type}, Name: ${fullName}, #Children: ${elements.length}`);

    switch(name) {
        case 'schema':
            // @todo this should be configurable
            if (!root.attributes.elementFormDefault) {
                root.attributes.elementFormDefault = 'qualified';
            }
            break;
        case 'import':
                if (!$parent.attributes.targetNamespace) {
                    $parent.attributes.targetNamespace = root.attributes.namespace;
                }
                const document = new Document(root.attributes.schemaLocation, Document.TYPE_XML);
                if (document.isHTTP()) {
                    // Run in next event loop
                    setTimeout(() => {
                        loadWSDL(outputDir, document.url.href, 'xsd').catch((err) => {
                            debug(`Error iterating and saving import ${document.href}`)
                        });
                    },0);
                    root.attributes.schemaLocation = `./${document.name}.xsd`;
                }
            break;
    }
    for (const el of elements ) {
        await _iterateWSDL(outputDir, el, root);
    }
};

const parseName = (input) => {
    const parts = input.toLowerCase().split(':');
    const name = parts.pop().toLowerCase();
    const ns = parts.join(':');

    return {
        name,
        ns,
    };
}

module.exports = {
    iterateWSDL,
    loadWSDL,
}