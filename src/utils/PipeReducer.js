export default class PipeReducer {
  constructor(state: Object, action: Object) {
    this.state = state;
    this.action = action;
  }

  bind(transform: Function): Object {
    this.state = {
      ...this.state,
      ...transform(this.state, this.action)
    };
    return this;
  }

  end(): Object {
    return this.state;
  }
}
