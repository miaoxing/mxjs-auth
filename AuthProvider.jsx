import {createContext, useContext, useEffect, useState} from 'react';
import propTypes from 'prop-types';

const AuthContext = createContext(null);

const defaultPermissions = {
  fixed: {},
  dynamic: [],
};

const convertPermissions = (userPermissions) => {
  const permissions = structuredClone(defaultPermissions);
  for (const permission in userPermissions) {
    if (permission.includes('[id]')) {
      permissions.dynamic.push(new RegExp(permission.replaceAll('[id]', '(.+?)')));
    } else {
      permissions.fixed[permission] = true;
    }
  }
  return permissions;
};

const matchPermission = (permissions, name) => {
  // Allow all permissions
  if (permissions.fixed['*']) {
    return true;
  }

  if (permissions.fixed[name]) {
    return true;
  }

  // TODO: 可通过树结构，首字母索引优化查找
  return permissions.dynamic.find(regex => regex.test(name));
};

export const AuthProvider = ({permissions: userPermissions = {}, baseUrl = '', children}) => {
  const [permissions, setPermissions] = useState(defaultPermissions);
  const updatePermission = (userPermissions) => {
    setPermissions(convertPermissions(userPermissions));
  };

  useEffect(() => {
    updatePermission(userPermissions);
  }, [userPermissions]);

  const access = (permission) => {
    if ('/' === permission?.substring(0, 1)) {
      // Remove baseUrl and `/` in URL
      permission = permission.substring(baseUrl.length + 1);
    }

    return matchPermission(permissions, permission);
  };

  return (
    <AuthContext.Provider
      value={{
        setPermissions: updatePermission,
        access,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  permissions: propTypes.object,

  /**
   * 校验的权限为 URL 地址时，将移除基础地址再做检查
   */
  baseUrl: propTypes.string,

  children: propTypes.node,
};

export const useAuth = () => {
  return useContext(AuthContext);
};
