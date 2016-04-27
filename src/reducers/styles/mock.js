import * as actions from 'actions/Actions';
import {styles} from 'reducers/styles';

export function createStyle(name: string): Object {
  return {
    name,
    getInitialState: (): StyleType => ({
      someBoolean: false,
      style: {
        opacity: [0]
      },
      transform: {
        translateX: [0, 'px']
      }
    }),
    rules: [
      ['someBoolean', (s: string, v: boolean): boolean => !v],
      ['style.opacity', (s: string, [v, unit]: StyleValueType): StyleValueType => [v+1, unit]],
      ['transform.translateX', (s: string, [v, unit]: StyleValueType): StyleValueType => [v-1, unit]],
    ]
  };
}

export function mockStyles(): GlobalStateType {
  return [...arguments].reduce((state: StyleType[], styleOrStyleName: Object|string): StyleType[] => {
    const style = typeof styleOrStyleName === 'string' ? createStyle(styleOrStyleName) : styleOrStyleName;
    return styles(state, actions.addStyle(style));
  }, []);
}
