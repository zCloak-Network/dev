// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

module.exports = function () {
  return {
    visitor: {
      Program(programPath) {
        programPath.traverse({
          ArrowFunctionExpression(path) {
            const node = path.node;

            node.expression = node.body.type !== 'BlockStatement';
          }
        });
      }
    }
  };
};
