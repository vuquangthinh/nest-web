// tree view helper

function createChildrenData(data, rootItem, { keyAttribute, childrenAttribute, parentAttribute }) {
  return data.filter(item => item[parentAttribute] === rootItem[keyAttribute]).map(child => {
    return {
      ...child,
      [childrenAttribute]: createChildrenData(data, child, {
        keyAttribute,
        childrenAttribute,
        parentAttribute,
      }),
    };
  });
}

/**
 * Tạo tree data từ parent-child items
 * @param {*} data
 * @param {*} parentAttribute
 *
 * createTreeData([], )
 */
const createTreeData = (
  data,
  keyAttribute = 'id',
  childrenAttribute = 'children',
  parentAttribute = 'parent_id',
  isRootKey = val => !val
) =>
  data.filter(item => isRootKey(item[parentAttribute])).map(rItem => ({
    ...rItem,
    [childrenAttribute]: createChildrenData(data, rItem, {
      keyAttribute,
      childrenAttribute,
      parentAttribute,
    }),
  }));

export default createTreeData;

function getParentKey(key, tree, keyAttribute = 'id', childrenAttribute = 'children') {
  return tree.reduce((parentKey, node) => {
    if (node[childrenAttribute]) {
      if (node[childrenAttribute].some(item => item[keyAttribute] === key)) {
        return node[keyAttribute];
      }

      const newParentKey = getParentKey(key, node[childrenAttribute]);
      if (newParentKey) {
        return newParentKey;
      }
    }

    return parentKey;
  });
}

export { getParentKey };
