import _ from 'lodash';

export function getDiff(that, other) {
    if (that == other) { return {}; }

    if (_.isEmpty(other)) {
        return {all: true};
    }

    if (_.isObject(that)) {
        if (!_.isObject(other)) { return {all: true}; }

        const keysDiff = _.difference(_.keys(that), _.keys(other));
        const keysDiffResult = _(keysDiff).map((k) => [k, {all: true}]).zipObject().value();

        const innerDiff = _(that)
            .keys()
            .map((k) => [k, getDiff(that[k], other[k])])
            .reject(([k, v]) => _.isEmpty(v))
            .zipObject()
            .value();

        if (_.isEmpty(innerDiff) && _.isEmpty(keysDiffResult)) {
            return {};
        }

        return {values: _.assign(innerDiff, keysDiffResult)};
    }

    return {all: true};
}
