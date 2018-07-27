import { providers as ethersProviders } from 'ethers';
import * as React from 'react';
import Loadable from 'react-loadable';
import { Route, Switch } from 'react-router-dom';
import Loading from '../components/generic/Loading';

interface IOwnProps {}

interface IStateProps {}

interface IDispatchProps {}

type Props = IStateProps & IDispatchProps & IOwnProps;

interface IState {
  noMetaMaskError?: string | boolean;
  provider?: ethersProviders.Web3Provider;
}

const NoMetaMaskPage = Loadable({
  loader: () => import('../components/homepage/NoMetaMaskPage'),
  loading: Loading
});

const HomePage = Loadable({
  loader: () => import('../components/homepage/HomePage'),
  loading: Loading
});

export default class App extends React.Component<Props, IState> {
  constructor(props: Props) {
    super(props);
    let provider;
    if ((global as any).window && ((global as any).window as any).web3) {
      provider = new ethersProviders.Web3Provider(
        (window as any).web3.currentProvider,
        {
          chainId: 1,
          ensAddress: '0x314159265dd8dbb310642f98f50c066173c1259b',
          name: 'homestead'
        }
      );
    }
    this.state = {
      noMetaMaskError: undefined,
      provider
    };
  }

  public async componentDidMount() {
    if (this.state.provider && ((global as any).window as any).web3) {
      const accounts = await this.state.provider.listAccounts();
      if (accounts.length === 0) {
        this.setState({
          noMetaMaskError:
            'Please unlock your account in MetaMask and refresh this page'
        });
      } else {
        this.setState({
          noMetaMaskError: false
        });
      }
    } else {
      this.setState({
        noMetaMaskError:
          'You need MetaMask in Chrome, Firefox or the Brave browser to use this dAPP'
      });
    }
  }

  public render() {
    const { noMetaMaskError, provider } = this.state;
    return (
      <div className="AppWrapper">
        <div className="Header">
          <img src="/images/logo.svg" alt="DataBrokerDAO" width="250" />
          <h1>Bounty Redeem dAPP</h1>
        </div>
        <div className="PageContainer">
          <Switch>
            <Route
              exact={true}
              path="/"
              render={() =>
                noMetaMaskError !== false || !provider ? (
                  <NoMetaMaskPage />
                ) : (
                  <HomePage provider={provider} />
                )
              }
            />
          </Switch>
        </div>
      </div>
    );
  }
}
