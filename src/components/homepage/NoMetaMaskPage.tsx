import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as Redux from 'redux';
import { IReduxState } from '../../redux/configureStore';

interface IOwnProps {}

interface IStateProps {}

interface IDispatchProps {}

type Props = IStateProps & IDispatchProps & IOwnProps;

interface IState {}

class NoMetaMaskPage extends Component<Props, IState> {
  public render() {
    return (
      <div className="Page">
        <h2>Hi stranger,</h2>
        <p>
          To be able to check your bounty earnings and to withdraw your DTX
          tokens, you need to use the{' '}
          <a href="https://metamask.io/">MetaMask plugin</a> in Google Chrome,
          Firefox Opera, or the Brave browser and refresh this page.
        </p>
        <div style={{ textAlign: 'center', marginBottom: '2em' }}>
          <a href="https://metamask.io/">
            <img
              src="/images/metamask.png"
              alt="Download MetaMask"
              width="250px"
            />
          </a>
        </div>
        <p>
          If you have MetaMask installed and still get this message, make sure
          you have it unlocked and refresh this page.
        </p>
      </div>
    );
  }
}

function mapStateToProps(state: IReduxState, ownProps: IOwnProps): IStateProps {
  return {};
}

function mapDispatchToProps(
  dispatch: Redux.Dispatch,
  ownProps: IOwnProps
): IDispatchProps {
  return {};
}

export default connect<IStateProps, IDispatchProps, IOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(NoMetaMaskPage);
