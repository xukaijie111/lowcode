function checkDeps(deps) {
    let ret = [];
    let depMap = deps.map((pre, now) => {
        let {
            localValue,
            depPackage
        } = now;
        if (pre[depPackage]) pre[depPackage].push(localValue)
        else pre[depPackage] = []
    }, {})

    for (let dep in depMap) {
        console.log(`depmap is `,depMap,depMap[dep])
        let localStr = depMap[dep].join(',')
        let codeStr = `import ${localStr} from ${dep}`
        try {

            babel.transformSync(codeStr, {
                plugins: [['@babel/plugin-proposal-decorators', { legacy: true }], ['@babel/plugin-proposal-class-properties']],
                ast: true,
                babelrc: false,
                configFile: false,
              });
        } catch (err) {
            return {
                result:false,
                error:err
            }
        }
        ret.push({
            localValue:localStr,
            depPackage:dep
        })
    }

    return {
        result:true,
        data:ret
    }
}

module.exports = {
    checkDeps
}