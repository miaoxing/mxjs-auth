import propTypes from 'prop-types';
import {useAuth} from './';

const Access = ({permission, children}) => {
  const auth = useAuth();
  // Show children when AuthProvider is not set
  return (!auth || auth.access(permission)) ? children : null;
};

Access.propTypes = {
  permission: propTypes.string,
  children: propTypes.node,
};

export default Access;

export const withAccess = (Component) => {
  // eslint-disable-next-line react/prop-types
  return ({permission, ...props}) => (
    <Access permission={permission}>
      <Component {...props}/>
    </Access>
  );
};
