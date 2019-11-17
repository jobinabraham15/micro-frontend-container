import * as React from 'react';

interface IProps {
  title: string;
}

interface IState {
  isCollapsed: boolean;
}

export default class CollapsibleReact extends React.Component<IProps, IState> {
  state: Readonly<IState> = {
    isCollapsed: false
  };

  public toggle = () => {
    this.setState(prevState => ({
      isCollapsed: !prevState.isCollapsed
    }));
  }

  public render() {
    const { isCollapsed } = this.state;
    const { title, children } = this.props;
    return (
      <div style={{ border: 'black dashed 1px' }}>
        <header onClick={this.toggle} style={{ backgroundColor: 'blue', color: 'white'}}>{title}</header>
        <section hidden={isCollapsed}>
          {children}
        </section>
      </div>
    );
  }
}