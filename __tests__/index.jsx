import 'core-js/stable/structured-clone';
import {AuthProvider, useAuth} from '../index';
import {render} from '@testing-library/react';

describe('auth', () => {
  test('basic', () => {
    const Child = () => {
      const {access} = useAuth();
      return access('page/sub-page') ? '1' : '0';
    };

    const {container} = render(<AuthProvider permissions={{
      'page/sub-page': true,
    }}>
      <Child/>
    </AuthProvider>);
    expect(container).toMatchSnapshot();
  });
});
