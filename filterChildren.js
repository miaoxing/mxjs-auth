import {useAuth} from './AuthProvider';
import {Children} from 'react';

const filterChildren = (children) => {
  const {access = null} = useAuth();
  if (!access) {
    return children;
  }

  const result = [];
  Children.forEach(children, child => {
    // Child may not be component
    if (!child?.type?.getPermission || access(child.type.getPermission(child.props))) {
      result.push(child);
    }
  });
  return result;
};

export default filterChildren;
